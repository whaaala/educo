import { StaffTransferRequest } from "@/types/staffTransfer";
import jsPDF from "jspdf";

interface LetterConfig {
  schoolName: string;
  schoolAddress: string;
  schoolPhone: string;
  schoolEmail: string;
  principalName: string;
  principalSignature?: string;
  schoolLogo?: string;
}

export function generateTerminationLetter(
  termination: StaffTransferRequest,
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
  const effectiveDate = new Date(termination.effectiveDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const lastWorkingDay = termination.lastWorkingDay
    ? new Date(termination.lastWorkingDay).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : effectiveDate;

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
  const addText = (
    text: string,
    size: number,
    style: string,
    align: "left" | "center" | "right" = "left",
    spacing: number = 5
  ) => {
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
    yPosition += lines.length * spacing;
  };

  // LETTERHEAD
  doc.setTextColor(139, 0, 0); // Dark red
  addText(config.schoolName, 18, "bold", "center", 7);
  doc.setTextColor(60, 60, 60);
  addText(config.schoolAddress, 10, "normal", "center", 5);
  addText(`Tel: ${config.schoolPhone} | Email: ${config.schoolEmail}`, 10, "normal", "center", 10);

  // Horizontal line
  doc.setDrawColor(139, 0, 0);
  doc.setLineWidth(1);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;

  // Date (right-aligned)
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(currentDate, pageWidth - margin, yPosition, { align: "right" });
  yPosition += 12;

  // Reference number
  addText(`Ref: ${termination.id}`, 10, "bold", "left", 12);

  // Recipient details
  addText(termination.staffName, 11, "bold", "left", 5);
  addText(termination.currentDesignation, 10, "normal", "left", 5);
  addText(`${termination.currentDepartment} Department`, 10, "normal", "left", 5);
  addText(termination.currentBranch, 10, "normal", "left", 15);

  // Letter title
  const terminationTypeMap: Record<string, string> = {
    resignation: "ACCEPTANCE OF RESIGNATION",
    dismissal: "LETTER OF TERMINATION",
    retirement: "RETIREMENT NOTIFICATION",
    "contract-end": "CONTRACT COMPLETION NOTICE",
    "mutual-agreement": "SEPARATION AGREEMENT",
  };

  const letterTitle = terminationTypeMap[termination.terminationType || "dismissal"] || "TERMINATION LETTER";

  doc.setTextColor(139, 0, 0);
  addText(letterTitle, 14, "bold", "center", 15);
  doc.setTextColor(0, 0, 0);

  // Salutation
  addText(`Dear ${termination.staffName.split(" ")[0]},`, 11, "normal", "left", 10);

  // Body based on termination type
  const terminationType = termination.terminationType || "dismissal";

  if (terminationType === "resignation") {
    addWrappedText(
      `This letter serves to acknowledge receipt of your resignation letter dated ${currentDate}. We have reviewed your request and hereby accept your resignation from the position of ${termination.currentDesignation} at ${config.schoolName}.`,
      11,
      "normal",
      5.5
    );
  } else if (terminationType === "retirement") {
    addWrappedText(
      `We write to formally acknowledge your retirement from ${config.schoolName}. Your years of dedicated service and commitment to our institution have been invaluable, and we extend our heartfelt gratitude for your contributions.`,
      11,
      "normal",
      5.5
    );
  } else if (terminationType === "contract-end") {
    addWrappedText(
      `This letter serves to notify you that your contract with ${config.schoolName} will come to an end as scheduled. We appreciate your service during the contract period.`,
      11,
      "normal",
      5.5
    );
  } else if (terminationType === "mutual-agreement") {
    addWrappedText(
      `This letter confirms our mutual agreement to terminate your employment with ${config.schoolName}. Both parties have agreed to this separation on amicable terms.`,
      11,
      "normal",
      5.5
    );
  } else {
    // dismissal
    addWrappedText(
      `We regret to inform you that ${config.schoolName} has decided to terminate your employment as ${termination.currentDesignation}, effective ${effectiveDate}.`,
      11,
      "normal",
      5.5
    );
  }

  yPosition += 8;

  // Termination Details
  addText("Termination Details:", 11, "bold", "left", 8);

  addText(`Position: ${termination.currentDesignation}`, 10, "normal", "left", 5);
  addText(`Department: ${termination.currentDepartment}`, 10, "normal", "left", 5);
  addText(`Effective Date: ${effectiveDate}`, 10, "bold", "left", 5);
  addText(`Last Working Day: ${lastWorkingDay}`, 10, "bold", "left", 10);

  // Reason
  if (termination.terminationReason || termination.reason) {
    addText("Reason:", 11, "bold", "left", 6);
    addWrappedText(termination.terminationReason || termination.reason, 10, "normal", 5);
    yPosition += 8;
  }

  // Severance package
  if (termination.severancePackage && termination.severancePackage > 0) {
    doc.setFillColor(255, 251, 230);
    doc.rect(margin - 2, yPosition - 4, contentWidth + 4, 8, "F");
    addText(
      `Severance Package: ₦${termination.severancePackage.toLocaleString()}`,
      10,
      "bold",
      "left",
      10
    );
  }

  // Exit requirements
  addText("Exit Requirements:", 11, "bold", "left", 8);

  const requirements = [
    "Return all company property including ID card, access cards, and any equipment",
    "Complete knowledge transfer and handover of ongoing projects",
    "Settle any outstanding financial obligations",
    "Participate in an exit interview (if required)",
    "Sign all necessary separation documents",
  ];

  requirements.forEach((req) => {
    addText(`• ${req}`, 10, "normal", "left", 5);
  });

  yPosition += 5;

  // Closing message based on type
  let closingMessage = "";
  if (terminationType === "resignation") {
    closingMessage =
      "We wish you all the best in your future endeavors. Thank you for your service to our institution.";
  } else if (terminationType === "retirement") {
    closingMessage =
      "We wish you a happy and healthy retirement. Your legacy at our institution will not be forgotten.";
  } else if (terminationType === "contract-end") {
    closingMessage =
      "We appreciate your contributions during your tenure. We wish you success in your future endeavors.";
  } else {
    closingMessage =
      "We appreciate your understanding in this matter. Please ensure all exit procedures are completed by your last working day.";
  }

  addWrappedText(closingMessage, 11, "normal", 5.5);

  // Calculate signature position
  const remainingSpace = pageHeight - yPosition - 40;
  if (remainingSpace < 30) {
    yPosition = pageHeight - 70;
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

  // Add "CONFIDENTIAL" watermark
  doc.setFontSize(50);
  doc.setTextColor(200, 200, 200);
  doc.setFont("helvetica", "bold");
  doc.text("CONFIDENTIAL", pageWidth / 2, pageHeight / 2, {
    align: "center",
    angle: 45,
  });

  return doc;
}

export function downloadTerminationLetter(
  termination: StaffTransferRequest,
  config: LetterConfig
) {
  const doc = generateTerminationLetter(termination, config);
  const fileName = `Termination_Letter_${termination.staffName.replace(/\s+/g, "_")}_${termination.id}.pdf`;
  doc.save(fileName);
}

export function printTerminationLetter(termination: StaffTransferRequest, config: LetterConfig) {
  const doc = generateTerminationLetter(termination, config);
  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank");
}
