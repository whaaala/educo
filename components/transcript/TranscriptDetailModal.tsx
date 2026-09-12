"use client";

import { useState } from "react";
import { Download, Printer, FileText, School } from "lucide-react";
import { TranscriptRequest } from "@/types/transcript";
import Modal from "@/components/shared/Modal";
import TranscriptTemplate from "./TranscriptTemplate";
import TranscriptTemplatePrintable from "./TranscriptTemplatePrintable";
import { mockTenantConfigs } from "@/data/mockTenantConfig";
import { generateTranscriptPDF } from "@/utils/transcriptPdfExport";

interface TranscriptDetailModalProps {
  request: TranscriptRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TranscriptDetailModal({ request, isOpen, onClose }: TranscriptDetailModalProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedTenant, setSelectedTenant] = useState("educo-default");

  if (!request) return null;

  // Get all tenant options for testing
  const tenantOptions = Object.entries(mockTenantConfigs).map(([id, config]) => ({
    id,
    name: config.branding.schoolName,
  }));

  const handlePrint = async () => {
    console.log("Print button clicked! Request:", request.requestNumber);
    try {
      // Generate PDF using the same professional design
      const { printTranscriptPDF } = await import("@/utils/transcriptPdfExport");
      await printTranscriptPDF(request, selectedTenant);
    } catch (error) {
      console.error("Error printing transcript:", error);
      alert("Failed to print transcript. Please try again.");
    }
  };

  const handleDownload = async () => {
    try {
      // Use the improved PDF generation method that captures the full template
      await generateTranscriptPDF(request, selectedTenant);
    } catch (error) {
      console.error("Error downloading transcript:", error);
      alert("Failed to download transcript. Please try again.");
    }
  };

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 150));
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50));
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  const footer = (
    <div className="flex flex-col gap-3">
      {/* Tenant Selector (for testing) - Full width on mobile */}
      <div className="flex items-center gap-2 w-full">
        <School className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
        <select
          value={selectedTenant}
          onChange={(e) => setSelectedTenant(e.target.value)}
          className="flex-1 px-3 py-2 text-xs sm:text-sm bg-white dark:bg-[#22262e] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          {tenantOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      {/* Zoom Controls & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Zoom Controls */}
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoomLevel <= 50}
            className="flex-1 sm:flex-initial px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            -
          </button>
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 min-w-[3rem] sm:min-w-[4rem] text-center">
            {zoomLevel}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoomLevel >= 150}
            className="flex-1 sm:flex-initial px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            +
          </button>
          <button
            type="button"
            onClick={resetZoom}
            className="flex-1 sm:flex-initial px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 rounded-lg cursor-pointer"
          >
            Reset
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-[#22262e] dark:hover:bg-[#2a2d35] midnight:bg-cyan-900/20 midnight:hover:bg-cyan-900/30 purple:bg-pink-900/20 purple:hover:bg-pink-900/30 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer flex-1"
          >
            <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Print</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer flex-1"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Hidden transcript template for PDF generation - using printable version with RGB colors */}
      <div className="hidden">
        <div id={`transcript-temp-${request.id}`}>
          <TranscriptTemplatePrintable
            request={request}
            showWatermark={request.transcriptType === "official"}
            tenantId={selectedTenant}
          />
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Transcript Preview"
        subtitle={`${request.requestNumber} - ${request.studentName}`}
        icon={<FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />}
        maxWidth="7xl"
        footer={footer}
      >
        {/* Transcript Preview Container */}
        <div
          id="transcript-preview-container"
          className="overflow-auto max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] bg-gray-100 dark:bg-[#0f1115] midnight:bg-[#0a0f1a] purple:bg-[#1a0f28] p-2 sm:p-4 rounded-lg"
          style={{
            zoom: `${zoomLevel}%`,
          }}
        >
          <TranscriptTemplate
            request={request}
            showWatermark={request.transcriptType === "official"}
            tenantId={selectedTenant}
          />
        </div>

      {/* Status Information */}
      <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 rounded-lg border border-blue-200 dark:border-blue-800 midnight:border-cyan-800 purple:border-pink-800">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="flex-shrink-0 hidden sm:block">
            <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-semibold text-ink mb-2">
              Transcript Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
              <div className="flex flex-wrap items-baseline gap-1">
                <span className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  Status:
                </span>
                <span className="font-medium text-ink capitalize">
                  {request.status}
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-1">
                <span className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  Type:
                </span>
                <span className="font-medium text-ink capitalize">
                  {request.transcriptType}
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-1">
                <span className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  Delivery:
                </span>
                <span className="font-medium text-ink capitalize">
                  {request.deliveryMethod}
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-1">
                <span className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  Payment:
                </span>
                <span className="font-medium text-ink capitalize">
                  {request.payment.status} ({request.payment.currency} {request.payment.amount.toLocaleString()})
                </span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </Modal>
    </>
  );
}
