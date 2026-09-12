/**
 * Generic Document Utilities
 *
 * Reusable functions for printing, downloading (PDF), and emailing documents.
 * These utilities are designed to work with any type of document content.
 */

import jsPDF from "jspdf";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface DocumentStyles {
  primaryColor?: string;
  secondaryColor?: string;
  headerBackground?: string;
  fontFamily?: string;
}

export interface DocumentOptions {
  /** Document title displayed in the header */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** School or organization name */
  organizationName?: string;
  /** Organization logo URL */
  logoUrl?: string;
  /** Custom styles */
  styles?: DocumentStyles;
  /** File name for downloads (without extension) */
  filename?: string;
  /** Page orientation: portrait or landscape */
  orientation?: "portrait" | "landscape";
  /** Page size: A4, Letter, etc. */
  pageSize?: "A4" | "Letter";
}

export interface DocumentSection {
  /** Section title */
  title?: string;
  /** Section content as HTML string */
  content: string;
  /** Optional CSS class for the section */
  className?: string;
}

export interface EmailOptions {
  /** Recipient email address */
  to?: string;
  /** Email subject */
  subject: string;
  /** Email body text */
  body: string;
  /** CC recipients */
  cc?: string;
  /** BCC recipients */
  bcc?: string;
}

// ============================================================================
// DEFAULT STYLES
// ============================================================================

const defaultStyles: DocumentStyles = {
  primaryColor: "#10b981",
  secondaryColor: "#059669",
  headerBackground: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

// ============================================================================
// PRINT UTILITIES
// ============================================================================

/**
 * Generate base CSS styles for documents
 */
function generateBaseStyles(options: DocumentOptions): string {
  const styles = { ...defaultStyles, ...options.styles };
  const isLandscape = options.orientation === "landscape";

  return `
    @media print {
      @page {
        size: ${options.pageSize || "A4"} ${isLandscape ? "landscape" : "portrait"};
        margin: 15mm 15mm 15mm 15mm;
      }
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      /* Hide browser default headers and footers */
      @page { margin: 15mm; }
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      height: 100%;
    }

    body {
      font-family: ${styles.fontFamily};
      font-size: 11pt;
      color: #333;
      padding: 0;
      line-height: 1.5;
    }

    .document-container {
      min-height: 100%;
      display: flex;
      flex-direction: column;
      padding: 20px;
    }

    .document-content {
      flex: 1;
    }

    .document-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 2px solid ${styles.primaryColor};
      width: 100%;
    }

    .document-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .document-header .document-title {
      font-size: 24pt;
      font-weight: 700;
      color: #111827;
      margin: 0;
      line-height: 1;
    }

    .document-header-right {
      text-align: right;
    }

    .document-header .organization-name {
      font-size: 16pt;
      font-weight: 700;
      color: #111827;
      margin-bottom: 4px;
    }

    .document-header .document-meta {
      font-size: 12pt;
      color: #374151;
      font-weight: 500;
    }

    .document-logo {
      width: 50px;
      height: 50px;
      object-fit: contain;
    }

    .document-section {
      margin-bottom: 25px;
    }

    .document-section .section-title {
      font-size: 12pt;
      font-weight: 600;
      color: #374151;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid #e5e7eb;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }

    .info-grid.two-col {
      grid-template-columns: repeat(2, 1fr);
    }

    .info-grid.three-col {
      grid-template-columns: repeat(3, 1fr);
    }

    .info-item {
      background: #f9fafb;
      padding: 15px 18px;
      border-radius: 8px;
      border-left: 4px solid ${styles.primaryColor};
    }

    .info-item .info-label {
      font-size: 9pt;
      color: #6b7280;
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-item .info-value {
      font-size: 12pt;
      font-weight: 600;
      color: #111827;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 11pt;
    }

    th {
      background: ${styles.primaryColor};
      color: white;
      padding: 12px 15px;
      text-align: left;
      font-weight: 600;
      font-size: 10pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    td {
      padding: 12px 15px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 11pt;
    }

    tr:nth-child(even) {
      background-color: #f9fafb;
    }

    .summary-row {
      display: flex;
      gap: 20px;
      margin-top: 20px;
    }

    .summary-box {
      flex: 1;
      background: #f9fafb;
      border-radius: 10px;
      padding: 15px;
      border: 1px solid #e5e7eb;
    }

    .summary-box.highlight {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      border-color: ${styles.primaryColor};
    }

    .totals-section {
      background: #f9fafb;
      padding: 15px;
      border-radius: 10px;
      margin-top: 15px;
      border: 1px solid #e5e7eb;
    }

    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 11pt;
    }

    .totals-row.total {
      font-weight: bold;
      font-size: 14pt;
      border-top: 2px solid #d1d5db;
      padding-top: 12px;
      margin-top: 10px;
      color: ${styles.secondaryColor};
    }

    .totals-label {
      color: #6b7280;
    }

    .totals-value {
      font-weight: 600;
      color: #111827;
    }

    .totals-value.success {
      color: ${styles.primaryColor};
    }

    .totals-value.warning {
      color: #d97706;
    }

    .totals-value.danger {
      color: #dc2626;
    }

    .status-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 10pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.success {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.warning {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.danger {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-badge.info {
      background: #dbeafe;
      color: #1e40af;
    }

    .two-column-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 20px;
    }

    .document-footer {
      margin-top: auto;
      padding-top: 25px;
      text-align: center;
      font-size: 9pt;
      color: #9ca3af;
      border-top: 2px solid #e5e7eb;
    }

    .document-footer p {
      margin: 4px 0;
    }

    .notes-section {
      background: #fffbeb;
      border: 1px solid #fcd34d;
      border-radius: 8px;
      padding: 15px 18px;
      margin-top: 15px;
    }

    .notes-section .notes-title {
      font-size: 9pt;
      font-weight: 600;
      color: #92400e;
      margin-bottom: 5px;
      text-transform: uppercase;
    }

    .notes-section .notes-content {
      font-size: 10pt;
      color: #78350f;
    }

    .highlight-box {
      background: ${styles.headerBackground};
      border: 1px solid #a7f3d0;
      border-radius: 10px;
      padding: 15px;
      margin: 15px 0;
    }

    .payment-summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-top: 20px;
    }

    .payment-card {
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }

    .payment-card.success {
      border-color: ${styles.primaryColor};
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    }

    .payment-card.warning {
      border-color: #f59e0b;
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    }

    .payment-card .card-label {
      font-size: 9pt;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }

    .payment-card .card-value {
      font-size: 18pt;
      font-weight: 700;
      color: #111827;
    }

    .payment-card.success .card-value {
      color: ${styles.secondaryColor};
    }

    .payment-card.warning .card-value {
      color: #d97706;
    }

    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .text-left { text-align: left; }
    .font-bold { font-weight: bold; }
    .font-mono { font-family: monospace; }
  `;
}

/**
 * Generate document HTML with header, content sections, and footer
 */
function generateDocumentHTML(
  sections: DocumentSection[],
  options: DocumentOptions & { receiptNumber?: string }
): string {
  const styles = generateBaseStyles(options);
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${options.title}</title>
        <meta charset="UTF-8">
        <style>${styles}</style>
      </head>
      <body>
        <div class="document-container">
          <div class="document-content">
            <div class="document-header">
              <div class="document-header-left">
                <div class="document-title">${options.title}</div>
              </div>
              <div class="document-header-right">
                ${options.organizationName ? `<div class="organization-name">${options.organizationName}</div>` : ""}
                <div class="document-meta">${dateStr}</div>
              </div>
            </div>

            ${sections
              .map(
                (section) => `
                <div class="document-section ${section.className || ""}">
                  ${section.title ? `<div class="section-title">${section.title}</div>` : ""}
                  ${section.content}
                </div>
              `
              )
              .join("")}
          </div>

          <div class="document-footer">
            <p>This is a computer-generated document. No signature is required.</p>
            <p>&copy; ${now.getFullYear()} ${options.organizationName || "School Management System"}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Print a document with custom sections
 * @param sections Array of document sections to print
 * @param options Document options (title, subtitle, etc.)
 */
export function printDocument(
  sections: DocumentSection[],
  options: DocumentOptions
): void {
  const html = generateDocumentHTML(sections, options);

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
      }, 100);
    };
  } else {
    alert("Please allow popups to print this document");
  }
}

// ============================================================================
// DOWNLOAD (PDF) UTILITIES
// ============================================================================

/**
 * Download a document as PDF (using browser's print-to-PDF functionality)
 * @param sections Array of document sections
 * @param options Document options
 */
export function downloadDocumentAsPDF(
  sections: DocumentSection[],
  options: DocumentOptions
): void {
  const html = generateDocumentHTML(sections, options);

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    // Add special PDF download hint
    const pdfHtml = html.replace(
      "</head>",
      `
      <style>
        @media print {
          @page {
            size: ${options.pageSize || "A4"} ${options.orientation === "landscape" ? "landscape" : "portrait"};
            margin: 10mm;
          }
        }
      </style>
      </head>
      `
    );

    printWindow.document.write(pdfHtml);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      // Prompt user to save as PDF
      printWindow.print();

      // Note: The actual "Save as PDF" functionality depends on the browser
      // Most modern browsers offer "Save as PDF" in their print dialog
      setTimeout(() => {
        printWindow.close();
      }, 100);
    };
  } else {
    alert("Please allow popups to download this document");
  }
}

// ============================================================================
// EMAIL UTILITIES
// ============================================================================

/**
 * Open email client with pre-filled content
 * @param options Email options (to, subject, body, etc.)
 */
export function openEmailClient(options: EmailOptions): void {
  const { to = "", subject, body, cc, bcc } = options;

  // Encode parameters for mailto URL
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  let mailtoUrl = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;

  if (cc) {
    mailtoUrl += `&cc=${encodeURIComponent(cc)}`;
  }

  if (bcc) {
    mailtoUrl += `&bcc=${encodeURIComponent(bcc)}`;
  }

  // Open the default email client
  window.location.href = mailtoUrl;
}

/**
 * Generate a plain text version of document sections for email body
 * @param sections Document sections
 * @param options Document options
 */
export function generateEmailBody(
  sections: { title?: string; content: string }[],
  options: DocumentOptions
): string {
  const lines: string[] = [];

  // Header
  if (options.organizationName) {
    lines.push(options.organizationName);
    lines.push("=".repeat(options.organizationName.length));
    lines.push("");
  }

  lines.push(options.title);
  lines.push("-".repeat(options.title.length));

  if (options.subtitle) {
    lines.push(options.subtitle);
  }

  lines.push("");
  lines.push(`Generated: ${new Date().toLocaleDateString()}`);
  lines.push("");

  // Sections
  sections.forEach((section) => {
    if (section.title) {
      lines.push(section.title);
      lines.push("-".repeat(section.title.length));
    }

    // Strip HTML tags and convert to plain text
    const plainText = section.content
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<\/tr>/gi, "\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\n\s*\n/g, "\n\n")
      .trim();

    lines.push(plainText);
    lines.push("");
  });

  // Footer
  lines.push("---");
  lines.push("This is a computer-generated document.");
  lines.push(`© ${new Date().getFullYear()} ${options.organizationName || "School Management System"}`);

  return lines.join("\n");
}

// ============================================================================
// HELPER FUNCTIONS FOR BUILDING DOCUMENT SECTIONS
// ============================================================================

/**
 * Create an info grid section with key-value pairs
 */
export function createInfoGrid(items: { label: string; value: string }[]): string {
  return `
    <div class="info-grid">
      ${items
        .map(
          (item) => `
        <div class="info-item">
          <div class="info-label">${item.label}</div>
          <div class="info-value">${item.value}</div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

/**
 * Create a table section
 */
export function createTable(
  headers: string[],
  rows: string[][],
  columnAlignments?: ("left" | "center" | "right")[]
): string {
  return `
    <table>
      <thead>
        <tr>
          ${headers.map((h, i) => `<th class="text-${columnAlignments?.[i] || "left"}">${h}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `
          <tr>
            ${row.map((cell, i) => `<td class="text-${columnAlignments?.[i] || "left"}">${cell}</td>`).join("")}
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

/**
 * Create a totals section
 */
export function createTotalsSection(
  items: { label: string; value: string; variant?: "normal" | "success" | "warning" | "danger"; isTotal?: boolean }[]
): string {
  return `
    <div class="totals-section">
      ${items
        .map(
          (item) => `
        <div class="totals-row ${item.isTotal ? "total" : ""}">
          <span class="totals-label">${item.label}</span>
          <span class="totals-value ${item.variant || ""}">${item.value}</span>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

/**
 * Create a status badge
 */
export function createStatusBadge(
  text: string,
  variant: "success" | "warning" | "danger" | "info" = "info"
): string {
  return `<span class="status-badge ${variant}">${text}</span>`;
}

/**
 * Create a notes section
 */
export function createNotesSection(notes: string): string {
  return `
    <div class="notes-section">
      <div class="notes-title">Notes</div>
      <div class="notes-content">${notes}</div>
    </div>
  `;
}

/**
 * Create a highlight box
 */
export function createHighlightBox(content: string): string {
  return `<div class="highlight-box">${content}</div>`;
}

// ============================================================================
// RECEIPT-SPECIFIC HELPERS (Can be moved to a separate file if needed)
// ============================================================================

export interface ReceiptData {
  receiptNumber: string;
  studentName: string;
  studentNumber: string;
  studentClass: string;
  studentAvatar?: string;
  items: { description: string; quantity: number; amount: number }[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  paymentMethod: string;
  paymentReference?: string;
  status: string;
  issueDate: string;
  academicYear: string;
  term: string;
  issuedBy: string;
  notes?: string;
}

/**
 * Generate sections for a receipt document (full-page layout)
 */
export function generateReceiptSections(
  receipt: ReceiptData,
  formatCurrency: (amount: number) => string
): DocumentSection[] {
  const sections: DocumentSection[] = [];

  // Status and Academic Period - prominent header
  const statusVariant =
    receipt.status === "issued" ? "success" :
    receipt.status === "pending" ? "warning" : "danger";

  sections.push({
    content: `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        ${createStatusBadge(receipt.status.toUpperCase(), statusVariant)}
        <span style="font-size: 11pt; color: #374151; font-weight: 600;">
          ${receipt.academicYear} • ${receipt.term.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
        </span>
      </div>
    `,
  });

  // Student Information - 4 column grid with spacious padding
  sections.push({
    title: "Student Details",
    content: `
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Student Name</div>
          <div class="info-value">${receipt.studentName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Student ID</div>
          <div class="info-value" style="font-family: monospace;">${receipt.studentNumber}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Class</div>
          <div class="info-value">${receipt.studentClass}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Issue Date</div>
          <div class="info-value">${new Date(receipt.issueDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
        </div>
      </div>
    `,
  });

  // Items Table - full width with generous padding
  sections.push({
    title: "Fee Items",
    content: createTable(
      ["Description", "Qty", "Amount"],
      receipt.items.map((item) => [
        item.description,
        item.quantity.toString(),
        formatCurrency(item.amount * item.quantity),
      ]),
      ["left", "center", "right"]
    ),
  });

  // Payment Summary Cards - large and visual
  const hasBalance = receipt.balance > 0;
  sections.push({
    content: `
      <div class="payment-summary">
        <div class="payment-card">
          <div class="card-label">Total Amount</div>
          <div class="card-value">${formatCurrency(receipt.totalAmount)}</div>
        </div>
        <div class="payment-card success">
          <div class="card-label">Amount Paid</div>
          <div class="card-value">${formatCurrency(receipt.amountPaid)}</div>
        </div>
        <div class="payment-card ${hasBalance ? 'warning' : 'success'}">
          <div class="card-label">${hasBalance ? 'Balance Due' : 'Balance'}</div>
          <div class="card-value">${formatCurrency(receipt.balance)}</div>
        </div>
      </div>
    `,
  });

  // Payment Information - 3 column grid
  sections.push({
    title: "Payment Details",
    content: `
      <div class="info-grid three-col">
        <div class="info-item">
          <div class="info-label">Payment Method</div>
          <div class="info-value">${receipt.paymentMethod.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</div>
        </div>
        ${receipt.paymentReference ? `
        <div class="info-item">
          <div class="info-label">Reference</div>
          <div class="info-value" style="font-family: monospace;">${receipt.paymentReference}</div>
        </div>
        ` : ''}
        <div class="info-item">
          <div class="info-label">Issued By</div>
          <div class="info-value">${receipt.issuedBy}</div>
        </div>
      </div>
    `,
  });

  // Notes - only if present
  if (receipt.notes) {
    sections.push({
      content: createNotesSection(receipt.notes),
    });
  }

  return sections;
}

/**
 * Print a receipt
 */
export function printReceipt(
  receipt: ReceiptData,
  formatCurrency: (amount: number) => string,
  organizationName?: string
): void {
  const sections = generateReceiptSections(receipt, formatCurrency);

  printDocumentWithReceiptNumber(sections, {
    title: "Receipt",
    organizationName,
    filename: `receipt-${receipt.receiptNumber}`,
    orientation: "portrait",
    receiptNumber: receipt.receiptNumber,
  });
}

/**
 * Internal function to print document with receipt number in header
 * Opens document in new window and triggers print dialog - window stays open
 */
function printDocumentWithReceiptNumber(
  sections: DocumentSection[],
  options: DocumentOptions & { receiptNumber?: string }
): void {
  const html = generateDocumentHTML(sections, options);

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      // Don't auto-close - let user decide when to close the window
    };
  } else {
    alert("Please allow popups to print this document");
  }
}

/**
 * Download a receipt as PDF
 */
export function downloadReceipt(
  receipt: ReceiptData,
  formatCurrency: (amount: number) => string,
  organizationName?: string
): void {
  generateReceiptPDF(receipt, formatCurrency, {
    title: "Receipt",
    organizationName,
    filename: `receipt-${receipt.receiptNumber}`,
    orientation: "portrait",
    receiptNumber: receipt.receiptNumber,
  });
}

/**
 * Generate receipt PDF using jsPDF
 * Creates a properly formatted PDF that uses the full page and triggers download
 */
function generateReceiptPDF(
  receipt: ReceiptData,
  formatCurrency: (amount: number) => string,
  options: DocumentOptions & { receiptNumber?: string }
): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let y = margin;

  // Colors
  const primaryColor = { r: 16, g: 185, b: 129 }; // #10b981
  const darkGray = { r: 17, g: 24, b: 39 }; // #111827
  const mediumGray = { r: 55, g: 65, b: 81 }; // #374151
  const lightGray = { r: 107, g: 114, b: 128 }; // #6b7280

  // Helper functions
  const setColor = (color: { r: number; g: number; b: number }) => {
    doc.setTextColor(color.r, color.g, color.b);
  };

  const drawLine = (yPos: number, color?: { r: number; g: number; b: number }) => {
    const c = color || primaryColor;
    doc.setDrawColor(c.r, c.g, c.b);
    doc.setLineWidth(0.8);
    doc.line(margin, yPos, pageWidth - margin, yPos);
  };

  // Helper to truncate text to fit within a width
  const truncateText = (text: string, maxWidth: number, fontSize: number): string => {
    doc.setFontSize(fontSize);
    if (doc.getTextWidth(text) <= maxWidth) return text;
    let truncated = text;
    while (doc.getTextWidth(truncated + "...") > maxWidth && truncated.length > 0) {
      truncated = truncated.slice(0, -1);
    }
    return truncated + "...";
  };

  // Helper to format currency for PDF (replaces special symbols with text codes)
  // jsPDF's default fonts don't support ₦, ₵, KSh, etc.
  const formatPDFCurrency = (amount: number): string => {
    const formatted = formatCurrency(amount);
    // Replace common currency symbols with text equivalents
    return formatted
      .replace(/₦/g, "NGN ")  // Nigerian Naira
      .replace(/₵/g, "GHS ")  // Ghanaian Cedi
      .replace(/KSh/g, "KES ") // Kenyan Shilling
      .replace(/R/g, "ZAR ")   // South African Rand (if at start)
      .replace(/€/g, "EUR ")  // Euro
      .replace(/£/g, "GBP ")  // British Pound
      .replace(/\$/g, "USD "); // US Dollar (fallback, though $ usually works)
  };

  // Header: Receipt on left, School name + date on right
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  setColor(darkGray);
  doc.text("Receipt", margin, y + 8);

  // Right side: Organization name and date
  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  setColor(darkGray);
  if (options.organizationName) {
    const orgNameWidth = doc.getTextWidth(options.organizationName);
    doc.text(options.organizationName, pageWidth - margin - orgNameWidth, y + 4);
  }

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  setColor(mediumGray);
  const dateWidth = doc.getTextWidth(dateStr);
  doc.text(dateStr, pageWidth - margin - dateWidth, y + 10);

  y += 18;
  drawLine(y);
  y += 12;

  // Status badge and academic period
  const statusText = receipt.status.toUpperCase();
  const academicPeriod = `${receipt.academicYear} - ${receipt.term.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`;

  // Status badge
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  const statusBadgeWidth = doc.getTextWidth(statusText) + 10;
  doc.setFillColor(
    receipt.status === "issued" ? 209 : 254,
    receipt.status === "issued" ? 250 : 243,
    receipt.status === "issued" ? 229 : 199
  );
  doc.roundedRect(margin, y - 5, statusBadgeWidth, 8, 2, 2, "F");
  doc.setTextColor(
    receipt.status === "issued" ? 6 : 146,
    receipt.status === "issued" ? 95 : 64,
    receipt.status === "issued" ? 70 : 14
  );
  doc.text(statusText, margin + 5, y);

  // Academic period on right
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  setColor(mediumGray);
  const periodWidth = doc.getTextWidth(academicPeriod);
  doc.text(academicPeriod, pageWidth - margin - periodWidth, y);

  y += 14;

  // Section: Student Details
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  setColor(mediumGray);
  doc.text("STUDENT DETAILS", margin, y);
  y += 3;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.4);
  doc.line(margin, y, margin + 38, y);
  y += 8;

  // Info grid - 4 columns
  const colWidth = contentWidth / 4;
  const infoBoxHeight = 22;
  const infoItems = [
    { label: "Student Name", value: receipt.studentName },
    { label: "Student ID", value: receipt.studentNumber },
    { label: "Class", value: receipt.studentClass },
    {
      label: "Issue Date",
      value: new Date(receipt.issueDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    },
  ];

  infoItems.forEach((item, index) => {
    const x = margin + index * colWidth;
    const boxWidth = colWidth - 4;

    // Background
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(x, y, boxWidth, infoBoxHeight, 2, 2, "F");

    // Left border accent
    doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.rect(x, y, 2, infoBoxHeight, "F");

    // Label
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    setColor(lightGray);
    doc.text(item.label.toUpperCase(), x + 5, y + 6);

    // Value - truncate if too long
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    setColor(darkGray);
    const maxTextWidth = boxWidth - 8;
    const displayValue = truncateText(item.value, maxTextWidth, 10);
    doc.text(displayValue, x + 5, y + 15);
  });

  y += infoBoxHeight + 12;

  // Section: Fee Items
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  setColor(mediumGray);
  doc.text("FEE ITEMS", margin, y);
  y += 3;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.4);
  doc.line(margin, y, margin + 25, y);
  y += 8;

  // Table header
  const tableHeaderHeight = 10;
  doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.rect(margin, y, contentWidth, tableHeaderHeight, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("DESCRIPTION", margin + 6, y + 7);
  doc.text("QTY", margin + contentWidth * 0.65, y + 7);
  doc.text("AMOUNT", pageWidth - margin - 6 - doc.getTextWidth("AMOUNT"), y + 7);
  y += tableHeaderHeight;

  // Table rows
  const tableRowHeight = 10;
  receipt.items.forEach((item, index) => {
    if (index % 2 === 1) {
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, y, contentWidth, tableRowHeight, "F");
    }

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    setColor(darkGray);

    // Truncate description if needed
    const maxDescWidth = contentWidth * 0.55;
    const truncatedDesc = truncateText(item.description, maxDescWidth, 10);
    doc.text(truncatedDesc, margin + 6, y + 7);
    doc.text(item.quantity.toString(), margin + contentWidth * 0.65, y + 7);
    const amountText = formatPDFCurrency(item.amount * item.quantity);
    doc.text(amountText, pageWidth - margin - 6 - doc.getTextWidth(amountText), y + 7);
    y += tableRowHeight;
  });

  y += 12;

  // Payment Summary Cards
  const cardWidth = (contentWidth - 12) / 3;
  const cardHeight = 32;
  const cards = [
    { label: "Total Amount", value: formatPDFCurrency(receipt.totalAmount), type: "normal" },
    { label: "Amount Paid", value: formatPDFCurrency(receipt.amountPaid), type: "success" },
    { label: receipt.balance > 0 ? "Balance Due" : "Balance", value: formatPDFCurrency(receipt.balance), type: receipt.balance > 0 ? "warning" : "success" },
  ];

  cards.forEach((card, index) => {
    const x = margin + index * (cardWidth + 6);

    // Card background
    if (card.type === "success") {
      doc.setFillColor(236, 253, 245);
      doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
    } else if (card.type === "warning") {
      doc.setFillColor(255, 251, 235);
      doc.setDrawColor(245, 158, 11);
    } else {
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(229, 231, 235);
    }

    doc.setLineWidth(0.6);
    doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, "FD");

    // Label - centered
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    setColor(lightGray);
    const labelText = card.label.toUpperCase();
    const labelWidth = doc.getTextWidth(labelText);
    doc.text(labelText, x + (cardWidth - labelWidth) / 2, y + 10);

    // Value - centered
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    if (card.type === "success") {
      doc.setTextColor(5, 150, 105);
    } else if (card.type === "warning") {
      doc.setTextColor(217, 119, 6);
    } else {
      setColor(darkGray);
    }
    const valueWidth = doc.getTextWidth(card.value);
    doc.text(card.value, x + (cardWidth - valueWidth) / 2, y + 23);
  });

  y += cardHeight + 14;

  // Section: Payment Details
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  setColor(mediumGray);
  doc.text("PAYMENT DETAILS", margin, y);
  y += 3;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.4);
  doc.line(margin, y, margin + 40, y);
  y += 8;

  // Payment info grid - 3 columns
  const paymentColWidth = contentWidth / 3;
  const paymentBoxHeight = 22;
  const paymentItems = [
    { label: "Payment Method", value: receipt.paymentMethod.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) },
    receipt.paymentReference ? { label: "Reference", value: receipt.paymentReference } : null,
    { label: "Issued By", value: receipt.issuedBy },
  ].filter(Boolean) as { label: string; value: string }[];

  paymentItems.forEach((item, index) => {
    const x = margin + index * paymentColWidth;
    const boxWidth = paymentColWidth - 4;

    // Background
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(x, y, boxWidth, paymentBoxHeight, 2, 2, "F");

    // Left border accent
    doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
    doc.rect(x, y, 2, paymentBoxHeight, "F");

    // Label
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    setColor(lightGray);
    doc.text(item.label.toUpperCase(), x + 5, y + 6);

    // Value - truncate if needed
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    setColor(darkGray);
    const maxTextWidth = boxWidth - 8;
    const displayValue = truncateText(item.value, maxTextWidth, 10);
    doc.text(displayValue, x + 5, y + 15);
  });

  y += paymentBoxHeight + 12;

  // Notes section (if present)
  if (receipt.notes) {
    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(252, 211, 77);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentWidth, 20, 2, 2, "FD");

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(146, 64, 14);
    doc.text("NOTES", margin + 6, y + 6);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 53, 15);
    const maxNotesWidth = contentWidth - 12;
    const truncatedNotes = truncateText(receipt.notes, maxNotesWidth, 9);
    doc.text(truncatedNotes, margin + 6, y + 14);

    y += 26;
  }

  // Footer - positioned at bottom of page
  const footerY = pageHeight - 18;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.4);
  doc.line(margin, footerY - 6, pageWidth - margin, footerY - 6);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  setColor(lightGray);

  const footerText1 = "This is a computer-generated document. No signature is required.";
  const footerText2 = `© ${new Date().getFullYear()} ${options.organizationName || "School Management System"}`;

  doc.text(footerText1, pageWidth / 2 - doc.getTextWidth(footerText1) / 2, footerY);
  doc.text(footerText2, pageWidth / 2 - doc.getTextWidth(footerText2) / 2, footerY + 4);

  // Save the PDF using blob to avoid browser navigation issues
  const filename = options.filename || `receipt-${receipt.receiptNumber}`;
  const pdfBlob = doc.output("blob");

  // Create a download link and trigger it
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Email a receipt
 */
export function emailReceipt(
  receipt: ReceiptData,
  formatCurrency: (amount: number) => string,
  organizationName?: string,
  recipientEmail?: string
): void {
  const sections = generateReceiptSections(receipt, formatCurrency);

  const body = generateEmailBody(sections, {
    title: `Receipt ${receipt.receiptNumber}`,
    subtitle: `Issued on ${new Date(receipt.issueDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
    organizationName,
  });

  openEmailClient({
    to: recipientEmail,
    subject: `${organizationName || "School"} - Receipt ${receipt.receiptNumber}`,
    body,
  });
}
