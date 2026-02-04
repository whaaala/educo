"use client";

import { useState, useCallback } from "react";
import type { ExportConfig, UseExportReturn } from "@/types/components";

/**
 * Hook for handling export functionality (PDF, Excel, Print)
 *
 * @example
 * ```tsx
 * const { handlePrint, handleExportPDF, handleExportExcel, isExporting } = useExport({
 *   filename: "fee-records",
 *   getPdfData: (items) => ({ title: "Fee Records", columns: [...], data: items }),
 *   getExcelData: (items) => ({ sheetName: "Fees", columns: [...], data: items }),
 * });
 * ```
 */
export function useExport<T>(config?: ExportConfig<T>): UseExportReturn<T> {
  const [isExporting, setIsExporting] = useState(false);

  // Print handler
  const handlePrint = useCallback(
    (items: T[]) => {
      if (!config?.getPrintContent) {
        // Default print behavior - print current page
        window.print();
        return;
      }

      const content = config.getPrintContent(items);
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    },
    [config]
  );

  // PDF export handler
  const handleExportPDF = useCallback(
    async (items: T[]) => {
      if (!config?.getPdfData) {
        console.warn("PDF export not configured");
        return;
      }

      setIsExporting(true);

      try {
        // Dynamic import to reduce bundle size
        const { default: jsPDF } = await import("jspdf");
        const pdfData = config.getPdfData(items);
        const doc = new jsPDF();

        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let yPos = 20;

        // Title
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(pdfData.title, pageWidth / 2, yPos, { align: "center" });
        yPos += 10;

        // Subtitle
        if (pdfData.subtitle) {
          doc.setFontSize(12);
          doc.setFont("helvetica", "normal");
          doc.text(pdfData.subtitle, pageWidth / 2, yPos, { align: "center" });
          yPos += 10;
        }

        yPos += 10;

        // Summary section
        if (pdfData.summary && pdfData.summary.length > 0) {
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text("Summary", margin, yPos);
          yPos += 7;

          doc.setFont("helvetica", "normal");
          pdfData.summary.forEach((item) => {
            doc.text(`${item.label}: ${item.value}`, margin, yPos);
            yPos += 5;
          });
          yPos += 10;
        }

        // Table header
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        const colWidth = (pageWidth - margin * 2) / pdfData.columns.length;

        pdfData.columns.forEach((col, index) => {
          doc.text(col.header, margin + index * colWidth, yPos);
        });
        yPos += 7;

        // Table rows
        doc.setFont("helvetica", "normal");
        pdfData.data.forEach((row) => {
          if (yPos > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage();
            yPos = 20;
          }

          pdfData.columns.forEach((col, index) => {
            let value: string;
            if (typeof col.key === "function") {
              value = col.key(row);
            } else {
              value = String(row[col.key] ?? "");
            }
            // Truncate long values
            if (value.length > 20) {
              value = value.substring(0, 17) + "...";
            }
            doc.text(value, margin + index * colWidth, yPos);
          });
          yPos += 6;
        });

        // Footer
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.text(
            `Page ${i} of ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: "center" }
          );
          doc.text(
            `Generated: ${new Date().toLocaleString()}`,
            margin,
            doc.internal.pageSize.getHeight() - 10
          );
        }

        doc.save(`${config.filename || "export"}.pdf`);
      } catch (error) {
        console.error("PDF export error:", error);
      } finally {
        setIsExporting(false);
      }
    },
    [config]
  );

  // Excel export handler
  const handleExportExcel = useCallback(
    async (items: T[]) => {
      if (!config?.getExcelData) {
        console.warn("Excel export not configured");
        return;
      }

      setIsExporting(true);

      try {
        // Dynamic import to reduce bundle size
        const XLSX = await import("xlsx");
        const excelData = config.getExcelData(items);

        // Prepare data rows
        const rows = excelData.data.map((row) => {
          const rowData: Record<string, unknown> = {};
          excelData.columns.forEach((col) => {
            let value: unknown;
            if (typeof col.key === "function") {
              value = col.key(row);
            } else {
              value = row[col.key];
            }
            rowData[col.header] = value;
          });
          return rowData;
        });

        // Add summary rows if present
        if (excelData.summary && excelData.summary.length > 0) {
          rows.push({}); // Empty row
          excelData.summary.forEach((item) => {
            rows.push({ [excelData.columns[0].header]: item.label, [excelData.columns[1]?.header || ""]: item.value });
          });
        }

        // Create workbook
        const ws = XLSX.utils.json_to_sheet(rows);

        // Set column widths
        const colWidths = excelData.columns.map((col) => ({
          wch: col.width || 15,
        }));
        ws["!cols"] = colWidths;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, excelData.sheetName);

        // Download
        XLSX.writeFile(wb, `${config.filename || "export"}.xlsx`);
      } catch (error) {
        console.error("Excel export error:", error);
      } finally {
        setIsExporting(false);
      }
    },
    [config]
  );

  return {
    handlePrint,
    handleExportPDF,
    handleExportExcel,
    isExporting,
  };
}

export default useExport;
