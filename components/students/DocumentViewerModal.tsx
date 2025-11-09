"use client";

import { FileText, Download, X } from "lucide-react";
import { useEffect } from "react";
import ModalHeader from "@/components/shared/ModalHeader";

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  documentUrl: string;
  documentType?: string;
}

export default function DocumentViewerModal({
  isOpen,
  onClose,
  documentName,
  documentUrl,
  documentType = "pdf",
}: DocumentViewerModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleDownload = () => {
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = documentUrl;
    link.download = documentName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <ModalHeader
          title={documentName}
          icon={FileText}
          onClose={onClose}
          variant="blue"
        />

        {/* Document Viewer */}
        <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-900 midnight:bg-gray-950 purple:bg-gray-950 p-4">
          {documentUrl && documentType.toLowerCase() === "pdf" ? (
            <iframe
              src={`${documentUrl}#toolbar=0&navpanes=0&scrollbar=1`}
              className="w-full h-full rounded-lg border border-gray-300 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white"
              title={documentName}
              allow="fullscreen"
            />
          ) : documentUrl ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                <p className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 mb-4">
                  Preview not available for this file type
                </p>
                <button
                  onClick={handleDownload}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  Download File
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-red-400" />
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 mb-2">
                  Document Not Available
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
                  The document URL is missing or invalid
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50/30 dark:bg-gray-800/20 midnight:bg-gray-800/20 purple:bg-gray-800/20">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
            <FileText className="w-4 h-4" />
            <span className="font-medium">{documentType.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 text-white font-medium text-sm shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 midnight:bg-gray-700 purple:bg-gray-700 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-300 dark:hover:bg-gray-600 midnight:hover:bg-gray-600 purple:hover:bg-gray-600 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow active:scale-95 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
