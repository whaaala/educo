import { StaffTransferRequest } from "@/types/staffTransfer";
import jsPDF from "jspdf";

interface LetterConfig {
  schoolName: string;
  schoolAddress: string;
  schoolPhone: string;
  schoolEmail: string;
  principalName: string;
  principalSignature?: string;
  schoolLogo?: string; // Base64 or URL to logo image
}

export function generateTransferLetter(
  transfer: StaffTransferRequest,
  config: LetterConfig
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Format dates
  const effectiveDate = new Date(transfer.effectiveDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  let yPosition = margin + 5;

  // Add school logo if provided
  if (config.schoolLogo) {
    try {
      const logoWidth = 30;
      const logoHeight = 30;
      const logoX = (pageWidth - logoWidth) / 2;
      doc.addImage(config.schoolLogo, "PNG", logoX, yPosition, logoWidth, logoHeight);
      yPosition += logoHeight + 3;
    } catch (e) {
      console.error("Error adding school logo:", e);
    }
  }

  // Helper function to add text with controlled spacing
  const addText = (text: string, size: number, style: string, align: "left" | "center" | "right" = "left", spacing: number = 5) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
    doc.setTextColor(0, 0, 0);

    if (align === "center") {
      doc.text(text, pageWidth / 2, yPosition, { align: "center" });
    } else if (align === "right") {
      doc.text(text, pageWidth - margin, yPosition, { align: "right" });
    } else {
      doc.text(text, margin, yPosition);
    }

    yPosition += spacing;
  };

  // Helper function to add wrapped text with controlled spacing
  const addWrappedText = (text: string, size: number, style: string, spacing: number = 5) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
    doc.setTextColor(0, 0, 0);
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, yPosition);
    yPosition += (lines.length * spacing);
  };

  // LETTERHEAD
  doc.setTextColor(0, 51, 102); // Dark blue
  addText(config.schoolName, 18, "bold", "center", 7);
  doc.setTextColor(60, 60, 60);
  addText(config.schoolAddress, 10, "normal", "center", 5);
  addText(`Tel: ${config.schoolPhone} | Email: ${config.schoolEmail}`, 10, "normal", "center", 10);

  // Horizontal line
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(1);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;

  // Date (right-aligned)
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(currentDate, pageWidth - margin, yPosition, { align: "right" });
  yPosition += 12;

  // Reference number
  addText(`Ref: ${transfer.id}`, 10, "bold", "left", 12);

  // Recipient details
  addText(transfer.staffName, 11, "bold", "left", 5);
  addText(transfer.currentDesignation, 10, "normal", "left", 5);
  addText(`${transfer.currentDepartment} Department`, 10, "normal", "left", 5);
  addText(transfer.currentBranch, 10, "normal", "left", 15);

  // Letter title
  const isPromotion = transfer.transferType === "promotion";
  const letterTitle = isPromotion ? "LETTER OF PROMOTION" : "TRANSFER NOTIFICATION LETTER";

  doc.setTextColor(0, 51, 102);
  addText(letterTitle, 14, "bold", "center", 15);
  doc.setTextColor(0, 0, 0);

  // Salutation
  addText(`Dear ${transfer.staffName.split(" ")[0]},`, 11, "normal", "left", 10);

  // Body
  if (isPromotion) {
    addWrappedText(
      `We are pleased to inform you that following a thorough review of your performance and contributions to ${config.schoolName}, the management has decided to promote you${transfer.newDesignation ? ` to the position of ${transfer.newDesignation}` : ""}.`,
      11,
      "normal",
      5.5
    );
    yPosition += 8;

    addText("Details of your promotion:", 11, "bold", "left", 8);

    // Promotion details
    if (transfer.newDesignation) {
      addText(`Current Position: ${transfer.currentDesignation}`, 10, "normal", "left", 5);
      addText(`New Position: ${transfer.newDesignation}`, 10, "bold", "left", 8);
    }

    if (transfer.currentSalary && transfer.newSalary) {
      const increase = transfer.newSalary - transfer.currentSalary;
      const percentage = ((increase / transfer.currentSalary) * 100).toFixed(1);

      addText(`Current Salary: ₦${transfer.currentSalary.toLocaleString()}`, 10, "normal", "left", 5);
      addText(`New Salary: ₦${transfer.newSalary.toLocaleString()}`, 10, "bold", "left", 5);

      // Highlight the increase
      doc.setFillColor(255, 251, 230); // Light yellow background
      doc.rect(margin - 2, yPosition - 4, contentWidth + 4, 8, 'F');
      addText(`Salary Increase: ₦${increase.toLocaleString()} (${percentage}% increase)`, 10, "bold", "left", 10);
    }

    addText(`Effective Date: ${effectiveDate}`, 10, "normal", "left", 10);

    if (transfer.newResponsibilities) {
      addText("New Responsibilities:", 11, "bold", "left", 6);
      addWrappedText(transfer.newResponsibilities, 10, "normal", 5);
      yPosition += 8;
    }

    addWrappedText(
      `This promotion is a testament to your hard work, dedication, and outstanding performance. We are confident that you will excel in your new role and continue to contribute significantly to our institution's success.`,
      11,
      "normal",
      5.5
    );
  } else {
    // Regular transfer
    const transferTypeLabels: Record<string, string> = {
      department: "department transfer",
      branch: "branch transfer",
      designation: "designation change",
      location: "location transfer",
    };
    const transferTypeText = transferTypeLabels[transfer.transferType] || "transfer";

    addWrappedText(
      `This letter serves to notify you of your ${transferTypeText} within ${config.schoolName}. Following administrative review and organizational requirements, we are pleased to inform you of the following changes:`,
      11,
      "normal",
      5.5
    );
    yPosition += 8;

    addText("Transfer Details:", 11, "bold", "left", 8);

    // Transfer details
    if (transfer.transferType === "department") {
      addText(`From: ${transfer.currentDepartment} Department`, 10, "normal", "left", 5);
      addText(`To: ${transfer.newDepartment} Department`, 10, "bold", "left", 8);
    }

    if (transfer.transferType === "branch") {
      addText(`From: ${transfer.currentBranch}`, 10, "normal", "left", 5);
      addText(`To: ${transfer.newBranch}`, 10, "bold", "left", 8);
    }

    if (transfer.transferType === "designation") {
      addText(`From: ${transfer.currentDesignation}`, 10, "normal", "left", 5);
      addText(`To: ${transfer.newDesignation}`, 10, "bold", "left", 8);
    }

    if (transfer.transferType === "location") {
      addText(`From: ${transfer.currentLocation}`, 10, "normal", "left", 5);
      addText(`To: ${transfer.newLocation}`, 10, "bold", "left", 8);
    }

    addText(`Effective Date: ${effectiveDate}`, 10, "normal", "left", 10);

    addWrappedText(
      `Your terms and conditions of employment remain unchanged except as specified above. We are confident that this transfer will provide you with new opportunities for professional growth and development.`,
      11,
      "normal",
      5.5
    );
  }

  yPosition += 8;

  // Reason
  if (transfer.reason) {
    addText("Reason:", 11, "bold", "left", 6);
    addWrappedText(transfer.reason, 10, "normal", 5);
    yPosition += 8;
  }

  // Closing
  addWrappedText(
    `Please report to your new ${transfer.transferType === "branch" ? "location" : "department"} on ${effectiveDate}. We wish you all the best in your new role and look forward to your continued contribution to our institution.`,
    11,
    "normal",
    5.5
  );

  // Calculate signature position - ensure it's not too close to the bottom
  const remainingSpace = pageHeight - yPosition - 40;
  if (remainingSpace < 30) {
    yPosition = pageHeight - 70; // Force signature to a specific position from bottom
  } else {
    yPosition += 15;
  }

  // Signature section
  addText("Yours sincerely,", 11, "normal", "left", 25);

  // Signature line
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, margin + 60, yPosition);
  yPosition += 6;

  addText(config.principalName, 11, "bold", "left", 5);
  addText("Principal", 10, "normal", "left", 0);

  // Footer
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(128, 128, 128);
  doc.text(
    `This is an official document from ${config.schoolName}`,
    pageWidth / 2,
    pageHeight - 12,
    { align: "center" }
  );

  return doc;
}

export function downloadTransferLetter(
  transfer: StaffTransferRequest,
  config: LetterConfig
) {
  const doc = generateTransferLetter(transfer, config);
  const fileName = `Transfer_Letter_${transfer.staffName.replace(/\s+/g, "_")}_${transfer.id}.pdf`;
  doc.save(fileName);
}

export function printTransferLetter(
  transfer: StaffTransferRequest,
  config: LetterConfig
) {
  const doc = generateTransferLetter(transfer, config);
  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank");
}
