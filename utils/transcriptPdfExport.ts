import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { TranscriptRequest } from "@/types/transcript";
import { mockAcademicRecords } from "@/data/mockTranscriptData";

export interface TranscriptPDFOptions {
  request: TranscriptRequest;
  tenantId?: string;
  showWatermark?: boolean;
}

/**
 * Export a transcript to PDF by rendering the HTML element
 * @param elementId - The ID of the HTML element containing the transcript
 * @param options - PDF generation options
 * @param filename - Optional custom filename
 */
export async function exportTranscriptToPDF(
  elementId: string,
  options: TranscriptPDFOptions,
  filename?: string
): Promise<void> {
  const { request } = options;

  try {
    const element = document.getElementById(elementId);

    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Show loading state
    const originalCursor = document.body.style.cursor;
    document.body.style.cursor = "wait";

    // Capture the element as a canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    // Calculate PDF dimensions
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageHeight = 297; // A4 height in mm

    // Create PDF document
    const pdf = new jsPDF({
      orientation: imgHeight > pageHeight ? "portrait" : "portrait",
      unit: "mm",
      format: "a4",
    });

    // Convert canvas to image
    const imgData = canvas.toDataURL("image/png");

    // Add image to PDF
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if content overflows
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Generate filename
    const pdfFilename =
      filename ||
      `Transcript_${request.studentName.replace(/\s+/g, "_")}_${request.requestNumber}.pdf`;

    // Save the PDF
    pdf.save(pdfFilename);

    // Restore cursor
    document.body.style.cursor = originalCursor;
  } catch (error) {
    console.error("Error generating PDF:", error);
    document.body.style.cursor = "default";
    throw error;
  }
}

/**
 * Export transcript directly from request data (without HTML rendering)
 * Enhanced version with improved visual design
 */
export function exportTranscriptDataToPDF(
  request: TranscriptRequest,
  tenantId?: string,
  filename?: string
): void {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  let yPos = 20;
  const primaryColor: [number, number, number] = [17, 24, 39]; // Dark gray for professional look
  const accentColor: [number, number, number] = [37, 99, 235]; // Blue accent

  // Add decorative border around entire page
  pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.setLineWidth(1.5);
  pdf.rect(10, 10, 190, 277, "S");

  // Inner border
  pdf.setLineWidth(0.3);
  pdf.rect(12, 12, 186, 273, "S");

  yPos = 25;

  // Official seal placeholder (decorative circle)
  pdf.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
  pdf.setLineWidth(2);
  pdf.circle(25, yPos + 5, 8, "S");
  pdf.setLineWidth(0.5);
  pdf.circle(25, yPos + 5, 6, "S");

  pdf.setFontSize(6);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  pdf.text("OFFICIAL", 25, yPos + 4, { align: "center" });
  pdf.text("SEAL", 25, yPos + 7, { align: "center" });

  // School name - Larger and more prominent
  pdf.setFontSize(24);
  pdf.setFont("times", "bold");
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text("EDUCO SCHOOL SYSTEM", 105, yPos + 3, { align: "center" });

  // School motto
  pdf.setFontSize(9);
  pdf.setFont("times", "italic");
  pdf.setTextColor(80, 80, 80);
  pdf.text("\"Excellence in Education\"", 105, yPos + 10, { align: "center" });

  // Contact info
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100, 100, 100);
  pdf.text("123 Education Street, Academic City", 105, yPos + 15, { align: "center" });
  pdf.text("Phone: +234 123 456 7890 | Email: info@educo.school", 105, yPos + 19, { align: "center" });

  yPos = 53;

  // Decorative separator line
  pdf.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
  pdf.setLineWidth(0.8);
  pdf.line(20, yPos, 190, yPos);

  yPos += 8;

  // Document title
  pdf.setFontSize(16);
  pdf.setFont("times", "bold");
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text("OFFICIAL ACADEMIC TRANSCRIPT", 105, yPos, { align: "center" });

  // Underline for title
  pdf.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
  pdf.setLineWidth(0.5);
  pdf.line(60, yPos + 1.5, 150, yPos + 1.5);

  yPos += 10;

  // Student Information Section with professional styling
  pdf.setFontSize(10);
  pdf.setFont("times", "bold");
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text("STUDENT INFORMATION", 20, yPos);

  // Underline
  pdf.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
  pdf.setLineWidth(0.5);
  pdf.line(20, yPos + 1, 75, yPos + 1);

  yPos += 7;

  // Student details in table format
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(60, 60, 60);

  const infoData = [
    ["Student Name:", request.studentName.toUpperCase(), "Request Number:", request.requestNumber],
    ["Admission Number:", request.studentAdmissionNumber, "Class/Level:", request.studentClass],
    ["Academic Period:", `${request.fromYear} - ${request.toYear}`, "Request Date:", new Date(request.requestDate).toLocaleDateString()],
  ];

  // Draw student info with proper spacing
  infoData.forEach((row, index) => {
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(40, 40, 40);
    pdf.text(row[0], 20, yPos);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(60, 60, 60);
    pdf.text(row[1], 58, yPos);

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(40, 40, 40);
    pdf.text(row[2], 120, yPos);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(60, 60, 60);
    pdf.text(row[3], 158, yPos);

    yPos += 6;
  });

  yPos += 4;

  // Separator line
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.3);
  pdf.line(20, yPos, 190, yPos);

  yPos += 8;

  // Get academic records
  const academicRecords = mockAcademicRecords[request.studentId as keyof typeof mockAcademicRecords] || [];

  if (academicRecords.length > 0) {
    // Academic Performance heading
    pdf.setFontSize(10);
    pdf.setFont("times", "bold");
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.text("ACADEMIC PERFORMANCE", 20, yPos);

    // Underline
    pdf.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    pdf.setLineWidth(0.5);
    pdf.line(20, yPos + 1, 85, yPos + 1);

    yPos += 8;

    // Add each term's records
    academicRecords.forEach((term, termIndex) => {
      // Check if we need a new page
      if (yPos > 240) {
        pdf.addPage();

        // Re-add borders on new page
        pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.setLineWidth(1.5);
        pdf.rect(10, 10, 190, 277, "S");
        pdf.setLineWidth(0.3);
        pdf.rect(12, 12, 186, 273, "S");

        yPos = 25;
      }

      // Term header - professional style
      pdf.setFontSize(9);
      pdf.setFont("times", "bold");
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text(`${term.termName.toUpperCase()} - ${term.academicYear}`, 20, yPos);

      // Light underline for term
      pdf.setDrawColor(180, 180, 180);
      pdf.setLineWidth(0.2);
      pdf.line(20, yPos + 1, 190, yPos + 1);

      yPos += 5;

      // Create subjects table
      const tableData = term.subjects.map((subject) => {
        const row = [
          subject.subjectName,
          subject.score?.toString() || "-",
          subject.grade || "-",
        ];
        if (subject.gradePoint !== undefined) row.push(subject.gradePoint.toFixed(1));
        if (subject.creditHours !== undefined) row.push(subject.creditHours.toString());
        row.push(subject.remarks || "");
        return row;
      });

      const headers = ["Subject", "Score", "Grade"];
      if (term.subjects[0]?.gradePoint !== undefined) headers.push("GP");
      if (term.subjects[0]?.creditHours !== undefined) headers.push("Credits");
      headers.push("Remarks");

      autoTable(pdf, {
        startY: yPos,
        head: [headers],
        body: tableData,
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 2.5,
          lineColor: [100, 100, 100],
          lineWidth: 0.1,
          font: "helvetica",
          textColor: [40, 40, 40],
        },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [20, 20, 20],
          fontStyle: "bold",
          halign: "center",
          lineColor: [100, 100, 100],
          lineWidth: 0.3,
        },
        bodyStyles: {
          lineColor: [180, 180, 180],
        },
        columnStyles: {
          0: { cellWidth: 75, halign: "left" },
          1: { halign: "center", cellWidth: 25 },
          2: { halign: "center", cellWidth: 25 },
          3: { halign: "left", cellWidth: 45 },
        },
        margin: { left: 20, right: 20 },
      });

      yPos = (pdf as any).lastAutoTable.finalY + 3;

      // Term summary - professional format
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(40, 40, 40);

      let summaryText = "";
      if (term.termAverage) {
        summaryText += `Term Average: ${term.termAverage.toFixed(1)}%`;
      }
      if (term.termGPA) {
        summaryText += `  |  GPA: ${term.termGPA.toFixed(2)}`;
      }
      if (term.position && term.totalStudents) {
        summaryText += `  |  Position: ${term.position} of ${term.totalStudents}`;
      }

      if (summaryText) {
        // Light background for summary
        pdf.setFillColor(252, 252, 252);
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(20, yPos - 2, 170, 6, "FD");

        pdf.text(summaryText, 25, yPos + 2);
      }

      yPos += 9;
    });
  } else {
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "italic");
    pdf.setTextColor(150, 150, 150);
    pdf.text("No academic records available for this period.", 20, yPos);
    yPos += 10;
  }

  // Add grading scale legend (on last page or new page if needed)
  const currentPage = (pdf as any).internal.getCurrentPageInfo().pageNumber;
  if (yPos > 215) {
    pdf.addPage();

    // Re-add borders on new page
    pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setLineWidth(1.5);
    pdf.rect(10, 10, 190, 277, "S");
    pdf.setLineWidth(0.3);
    pdf.rect(12, 12, 186, 273, "S");

    yPos = 25;
  } else {
    yPos += 6;
  }

  pdf.setFontSize(10);
  pdf.setFont("times", "bold");
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text("GRADING SCALE", 20, yPos);

  // Underline
  pdf.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
  pdf.setLineWidth(0.5);
  pdf.line(20, yPos + 1, 60, yPos + 1);

  yPos += 7;

  // Grading scale table
  const gradingData = [
    ["A", "80-100", "Excellent"],
    ["B", "70-79", "Very Good"],
    ["C", "60-69", "Good"],
    ["D", "50-59", "Pass"],
    ["E", "40-49", "Fair"],
    ["F", "0-39", "Fail"],
  ];

  autoTable(pdf, {
    startY: yPos,
    head: [["Grade", "Score Range", "Remark"]],
    body: gradingData,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      halign: "center",
      lineColor: [100, 100, 100],
      lineWidth: 0.1,
      textColor: [40, 40, 40],
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [20, 20, 20],
      fontStyle: "bold",
      lineColor: [100, 100, 100],
      lineWidth: 0.3,
    },
    margin: { left: 20, right: 20 },
    tableWidth: 85,
  });

  yPos = (pdf as any).lastAutoTable.finalY + 12;

  // Signatures section
  if (yPos > 235) {
    pdf.addPage();

    // Re-add borders on new page
    pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setLineWidth(1.5);
    pdf.rect(10, 10, 190, 277, "S");
    pdf.setLineWidth(0.3);
    pdf.rect(12, 12, 186, 273, "S");

    yPos = 25;
  }

  // Separator line before signatures
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.3);
  pdf.line(20, yPos, 190, yPos);

  yPos += 8;

  // Certification statement
  pdf.setFontSize(8);
  pdf.setFont("times", "italic");
  pdf.setTextColor(60, 60, 60);
  pdf.text("This is to certify that the above is a true and complete record of the student's academic performance.", 105, yPos, { align: "center" });

  yPos += 10;

  // Signature section
  pdf.setFontSize(9);
  pdf.setFont("times", "bold");
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text("OFFICIAL SIGNATURES", 20, yPos);

  // Underline
  pdf.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
  pdf.setLineWidth(0.5);
  pdf.line(20, yPos + 1, 75, yPos + 1);

  yPos += 10;

  const signatureY = yPos;

  // Principal signature box
  pdf.setDrawColor(180, 180, 180);
  pdf.setLineWidth(0.3);
  pdf.rect(20, signatureY - 2, 70, 20, "S");

  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(120, 120, 120);
  pdf.text("Authorized Signature", 22, signatureY + 2);

  // Signature line
  pdf.setDrawColor(60, 60, 60);
  pdf.setLineWidth(0.5);
  pdf.line(22, signatureY + 10, 85, signatureY + 10);

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(40, 40, 40);
  pdf.text("Principal/Head of School", 22, signatureY + 14);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Date: ${new Date().toLocaleDateString()}`, 22, signatureY + 17);

  // Registrar signature box
  pdf.setDrawColor(180, 180, 180);
  pdf.setLineWidth(0.3);
  pdf.rect(120, signatureY - 2, 70, 20, "S");

  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(120, 120, 120);
  pdf.text("Authorized Signature", 122, signatureY + 2);

  // Signature line
  pdf.setDrawColor(60, 60, 60);
  pdf.setLineWidth(0.5);
  pdf.line(122, signatureY + 10, 185, signatureY + 10);

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(40, 40, 40);
  pdf.text("Registrar/Academic Officer", 122, signatureY + 14);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Date: ${new Date().toLocaleDateString()}`, 122, signatureY + 17);

  yPos = signatureY + 25;

  // Verification code with emphasis
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(80, 80, 80);
  pdf.text(`Document Verification Code: ${request.verificationCode || "N/A"}`, 105, yPos, { align: "center" });

  // Footer with page numbers and generation timestamp
  const pageCount = (pdf as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);

    // Footer separator line
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.2);
    pdf.line(20, 280, 190, 280);

    // Page number and document info
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(120, 120, 120);
    pdf.text(`Page ${i} of ${pageCount}`, 20, 284);

    // School info in footer
    pdf.text("EDUCO SCHOOL SYSTEM", 105, 284, { align: "center" });

    // Generation timestamp
    pdf.setFontSize(6);
    pdf.setTextColor(140, 140, 140);
    pdf.text(`Issued: ${new Date().toLocaleDateString()}`, 190, 284, { align: "right" });

    // Confidentiality notice
    pdf.setFontSize(6);
    pdf.setFont("helvetica", "italic");
    pdf.setTextColor(150, 150, 150);
    pdf.text("This document is confidential and contains sensitive academic information", 105, 288, { align: "center" });
  }

  // Add watermark if unofficial
  if (request.transcriptType === "unofficial") {
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(70);
      pdf.setTextColor(240, 240, 240);
      pdf.text("UNOFFICIAL", 105, 150, {
        align: "center",
        angle: 45,
      });
    }
  }

  // Generate filename
  const pdfFilename =
    filename ||
    `Transcript_${request.studentName.replace(/\s+/g, "_")}_${request.requestNumber}.pdf`;

  // Save the PDF
  pdf.save(pdfFilename);
}

/**
 * Generate transcript PDF by rendering component dynamically
 * This function is meant to be called from a React component with the TranscriptTemplate
 */
export async function generateTranscriptPDF(
  request: TranscriptRequest,
  tenantId?: string
): Promise<void> {
  // Due to persistent issues with html2canvas and oklch colors in Tailwind v4,
  // we're using the reliable jsPDF direct generation method
  // TODO: Revisit html2canvas approach when Tailwind v4 color compatibility improves

  try {
    // Show loading cursor
    document.body.style.cursor = "wait";

    // Use the reliable fallback method with enhanced styling
    exportTranscriptDataToPDF(request, tenantId);

    // Restore cursor
    document.body.style.cursor = "default";
  } catch (error) {
    document.body.style.cursor = "default";
    console.error("Error generating PDF:", error);
    throw error;
  }
}

/**
 * Generate and print transcript PDF using the professional design
 * Opens the browser's print dialog with the generated PDF
 */
export async function printTranscriptPDF(
  request: TranscriptRequest,
  tenantId?: string
): Promise<void> {
  try {
    // Show loading cursor
    document.body.style.cursor = "wait";

    // Create the PDF document
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    let yPos = 20;
    const primaryColor: [number, number, number] = [17, 24, 39];
    const accentColor: [number, number, number] = [37, 99, 235];

    // Add decorative border around entire page
    pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setLineWidth(1.5);
    pdf.rect(10, 10, 190, 277, "S");
    pdf.setLineWidth(0.3);
    pdf.rect(12, 12, 186, 273, "S");

    yPos = 25;

    // Official seal placeholder
    pdf.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    pdf.setLineWidth(2);
    pdf.circle(25, yPos + 5, 8, "S");
    pdf.setLineWidth(0.5);
    pdf.circle(25, yPos + 5, 6, "S");
    pdf.setFontSize(6);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    pdf.text("OFFICIAL", 25, yPos + 4, { align: "center" });
    pdf.text("SEAL", 25, yPos + 7, { align: "center" });

    // School name
    pdf.setFontSize(24);
    pdf.setFont("times", "bold");
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.text("EDUCO SCHOOL SYSTEM", 105, yPos + 3, { align: "center" });

    // School motto
    pdf.setFontSize(9);
    pdf.setFont("times", "italic");
    pdf.setTextColor(80, 80, 80);
    pdf.text('"Excellence in Education"', 105, yPos + 10, { align: "center" });

    // Contact info
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 100, 100);
    pdf.text("123 Education Street, Academic City", 105, yPos + 15, { align: "center" });
    pdf.text("Phone: +234 123 456 7890 | Email: info@educo.school", 105, yPos + 19, { align: "center" });

    yPos = 53;

    // Decorative separator line
    pdf.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    pdf.setLineWidth(0.8);
    pdf.line(20, yPos, 190, yPos);
    yPos += 8;

    // Document title
    pdf.setFontSize(16);
    pdf.setFont("times", "bold");
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.text("OFFICIAL ACADEMIC TRANSCRIPT", 105, yPos, { align: "center" });
    pdf.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    pdf.setLineWidth(0.5);
    pdf.line(60, yPos + 1.5, 150, yPos + 1.5);
    yPos += 10;

    // Student Information
    pdf.setFontSize(10);
    pdf.setFont("times", "bold");
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.text("STUDENT INFORMATION", 20, yPos);
    pdf.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    pdf.setLineWidth(0.5);
    pdf.line(20, yPos + 1, 75, yPos + 1);
    yPos += 7;

    const infoData = [
      ["Student Name:", request.studentName.toUpperCase(), "Request Number:", request.requestNumber],
      ["Admission Number:", request.studentAdmissionNumber, "Class/Level:", request.studentClass],
      ["Academic Period:", `${request.fromYear} - ${request.toYear}`, "Request Date:", new Date(request.requestDate).toLocaleDateString()],
    ];

    pdf.setFontSize(9);
    infoData.forEach((row) => {
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(40, 40, 40);
      pdf.text(row[0], 20, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(60, 60, 60);
      pdf.text(row[1], 58, yPos);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(40, 40, 40);
      pdf.text(row[2], 120, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(60, 60, 60);
      pdf.text(row[3], 158, yPos);
      yPos += 6;
    });

    yPos += 4;
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(20, yPos, 190, yPos);
    yPos += 8;

    // Get academic records
    const academicRecords = mockAcademicRecords[request.studentId as keyof typeof mockAcademicRecords] || [];

    if (academicRecords.length > 0) {
      pdf.setFontSize(10);
      pdf.setFont("times", "bold");
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text("ACADEMIC PERFORMANCE", 20, yPos);
      pdf.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
      pdf.setLineWidth(0.5);
      pdf.line(20, yPos + 1, 85, yPos + 1);
      yPos += 8;

      academicRecords.forEach((term) => {
        if (yPos > 240) {
          pdf.addPage();
          pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.setLineWidth(1.5);
          pdf.rect(10, 10, 190, 277, "S");
          pdf.setLineWidth(0.3);
          pdf.rect(12, 12, 186, 273, "S");
          yPos = 25;
        }

        pdf.setFontSize(9);
        pdf.setFont("times", "bold");
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.text(`${term.termName.toUpperCase()} - ${term.academicYear}`, 20, yPos);
        pdf.setDrawColor(180, 180, 180);
        pdf.setLineWidth(0.2);
        pdf.line(20, yPos + 1, 190, yPos + 1);
        yPos += 5;

        const tableData = term.subjects.map((subject) => [
          subject.subjectName,
          subject.score?.toString() || "-",
          subject.grade || "-",
          subject.remarks || "",
        ]);

        autoTable(pdf, {
          startY: yPos,
          head: [["Subject", "Score", "Grade", "Remarks"]],
          body: tableData,
          theme: "grid",
          styles: {
            fontSize: 8,
            cellPadding: 2.5,
            lineColor: [100, 100, 100],
            lineWidth: 0.1,
            textColor: [40, 40, 40],
          },
          headStyles: {
            fillColor: [240, 240, 240],
            textColor: [20, 20, 20],
            fontStyle: "bold",
            halign: "center",
            lineColor: [100, 100, 100],
            lineWidth: 0.3,
          },
          columnStyles: {
            0: { cellWidth: 75, halign: "left" },
            1: { halign: "center", cellWidth: 25 },
            2: { halign: "center", cellWidth: 25 },
            3: { halign: "left", cellWidth: 45 },
          },
          margin: { left: 20, right: 20 },
        });

        yPos = (pdf as any).lastAutoTable.finalY + 3;

        let summaryText = "";
        if (term.termAverage) summaryText += `Term Average: ${term.termAverage.toFixed(1)}%`;
        if (term.termGPA) summaryText += `  |  GPA: ${term.termGPA.toFixed(2)}`;
        if (term.position && term.totalStudents) summaryText += `  |  Position: ${term.position} of ${term.totalStudents}`;

        if (summaryText) {
          pdf.setFillColor(252, 252, 252);
          pdf.setDrawColor(200, 200, 200);
          pdf.rect(20, yPos - 2, 170, 6, "FD");
          pdf.setFontSize(8);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(40, 40, 40);
          pdf.text(summaryText, 25, yPos + 2);
        }

        yPos += 9;
      });
    }

    // Add grading scale, signatures, and footer (same as download function)
    if (yPos > 215) {
      pdf.addPage();
      pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.setLineWidth(1.5);
      pdf.rect(10, 10, 190, 277, "S");
      pdf.setLineWidth(0.3);
      pdf.rect(12, 12, 186, 273, "S");
      yPos = 25;
    } else {
      yPos += 6;
    }

    // Grading scale
    pdf.setFontSize(10);
    pdf.setFont("times", "bold");
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.text("GRADING SCALE", 20, yPos);
    pdf.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    pdf.setLineWidth(0.5);
    pdf.line(20, yPos + 1, 60, yPos + 1);
    yPos += 7;

    const gradingData = [
      ["A", "80-100", "Excellent"],
      ["B", "70-79", "Very Good"],
      ["C", "60-69", "Good"],
      ["D", "50-59", "Pass"],
      ["E", "40-49", "Fair"],
      ["F", "0-39", "Fail"],
    ];

    autoTable(pdf, {
      startY: yPos,
      head: [["Grade", "Score Range", "Remark"]],
      body: gradingData,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2.5,
        halign: "center",
        lineColor: [100, 100, 100],
        lineWidth: 0.1,
        textColor: [40, 40, 40],
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [20, 20, 20],
        fontStyle: "bold",
        lineColor: [100, 100, 100],
        lineWidth: 0.3,
      },
      margin: { left: 20, right: 20 },
      tableWidth: 85,
    });

    yPos = (pdf as any).lastAutoTable.finalY + 12;

    // Signatures section
    if (yPos > 235) {
      pdf.addPage();
      pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.setLineWidth(1.5);
      pdf.rect(10, 10, 190, 277, "S");
      pdf.setLineWidth(0.3);
      pdf.rect(12, 12, 186, 273, "S");
      yPos = 25;
    }

    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(20, yPos, 190, yPos);
    yPos += 8;

    pdf.setFontSize(8);
    pdf.setFont("times", "italic");
    pdf.setTextColor(60, 60, 60);
    pdf.text("This is to certify that the above is a true and complete record of the student's academic performance.", 105, yPos, { align: "center" });
    yPos += 10;

    pdf.setFontSize(9);
    pdf.setFont("times", "bold");
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.text("OFFICIAL SIGNATURES", 20, yPos);
    pdf.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    pdf.setLineWidth(0.5);
    pdf.line(20, yPos + 1, 75, yPos + 1);
    yPos += 10;

    const signatureY = yPos;

    // Principal signature box
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.3);
    pdf.rect(20, signatureY - 2, 70, 20, "S");
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(120, 120, 120);
    pdf.text("Authorized Signature", 22, signatureY + 2);
    pdf.setDrawColor(60, 60, 60);
    pdf.setLineWidth(0.5);
    pdf.line(22, signatureY + 10, 85, signatureY + 10);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(40, 40, 40);
    pdf.text("Principal/Head of School", 22, signatureY + 14);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 22, signatureY + 17);

    // Registrar signature box
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.3);
    pdf.rect(120, signatureY - 2, 70, 20, "S");
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(120, 120, 120);
    pdf.text("Authorized Signature", 122, signatureY + 2);
    pdf.setDrawColor(60, 60, 60);
    pdf.setLineWidth(0.5);
    pdf.line(122, signatureY + 10, 185, signatureY + 10);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(40, 40, 40);
    pdf.text("Registrar/Academic Officer", 122, signatureY + 14);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 122, signatureY + 17);

    yPos = signatureY + 25;
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(80, 80, 80);
    pdf.text(`Document Verification Code: ${request.verificationCode || "N/A"}`, 105, yPos, { align: "center" });

    // Footer
    const pageCount = (pdf as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setDrawColor(180, 180, 180);
      pdf.setLineWidth(0.2);
      pdf.line(20, 280, 190, 280);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(120, 120, 120);
      pdf.text(`Page ${i} of ${pageCount}`, 20, 284);
      pdf.text("EDUCO SCHOOL SYSTEM", 105, 284, { align: "center" });
      pdf.setFontSize(6);
      pdf.setTextColor(140, 140, 140);
      pdf.text(`Issued: ${new Date().toLocaleDateString()}`, 190, 284, { align: "right" });
      pdf.setFontSize(6);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(150, 150, 150);
      pdf.text("This document is confidential and contains sensitive academic information", 105, 288, { align: "center" });
    }

    // Add watermark if unofficial
    if (request.transcriptType === "unofficial") {
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(70);
        pdf.setTextColor(240, 240, 240);
        pdf.text("UNOFFICIAL", 105, 150, { align: "center", angle: 45 });
      }
    }

    // Create blob URL and open in new window with print dialog
    const blob = pdf.output("blob");
    const blobUrl = URL.createObjectURL(blob);

    // Open PDF in new window
    const printWindow = window.open(blobUrl, "_blank");

    if (printWindow) {
      // Wait for PDF to load, then trigger print
      printWindow.onload = function() {
        printWindow.print();

        // Clean up blob URL after a delay
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 1000);
      };
    } else {
      // Fallback if popup was blocked
      alert("Please allow popups to print the transcript");
      URL.revokeObjectURL(blobUrl);
    }

    // Restore cursor
    document.body.style.cursor = "default";
  } catch (error) {
    document.body.style.cursor = "default";
    console.error("Error printing PDF:", error);
    throw error;
  }
}
