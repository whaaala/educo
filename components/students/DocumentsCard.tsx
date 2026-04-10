"use client";

import { Download, FileText, Eye } from "lucide-react";
import { useState } from "react";
import DocumentViewerModal from "./DocumentViewerModal";

interface Document {
  name?: string;
  url?: string;
  type?: string;
}

interface DocumentsCardProps {
  documents: Document[];
}

export default function DocumentsCard({ documents }: DocumentsCardProps) {
  const documentsArray = Array.isArray(documents) ? documents : [];
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleView = (doc: Document) => {
    setSelectedDocument(doc);
    setViewerOpen(true);
  };

  const handleDownload = (doc: Document, index: number) => {
    // Handle download logic here
    console.log("Downloading document:", doc.name || `Document ${index + 1}`);
    if (doc.url) {
      // Create a temporary link element
      const link = document.createElement("a");
      link.href = doc.url;
      link.download = doc.name || `Document ${index + 1}`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="group bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-800/50 midnight:from-gray-800 midnight:to-gray-900/50 purple:from-gray-800 purple:to-gray-900/50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 pt-2 px-3 sm:px-4 pb-2 sm:pb-3 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      {/* Header */}
      <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">
        Documents
      </h3>

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 mb-2"></div>

      {/* Documents List */}
      {documentsArray.length > 0 ? (
        <div className="space-y-2">
          {documentsArray.map((doc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-800/20 midnight:from-gray-900/40 midnight:to-gray-900/20 purple:from-gray-900/40 purple:to-gray-900/20 border border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/10 purple:border-pink-500/10 hover:from-gray-100 hover:to-gray-100/70 dark:hover:from-gray-800/60 dark:hover:to-gray-800/40 midnight:hover:from-gray-900/60 midnight:hover:to-gray-900/40 purple:hover:from-gray-900/60 purple:hover:to-gray-900/40 hover:border-gray-300/50 dark:hover:border-gray-600/50 midnight:hover:border-cyan-500/20 purple:hover:border-pink-500/20 shadow-sm hover:shadow-md transition-all duration-300 group/doc"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-900/20 midnight:from-red-900/40 midnight:to-red-900/20 purple:from-red-900/40 purple:to-red-900/20 flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 group-hover/doc:scale-105 group-hover/doc:from-red-200 group-hover/doc:to-red-300">
                  <span className="text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 text-xs font-bold">
                    PDF
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
                  {doc?.name || `Document ${idx + 1}`}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleView(doc)}
                  className="w-7 h-7 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-700/80 midnight:from-gray-700 midnight:to-gray-700/80 purple:from-gray-700 purple:to-gray-700/80 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 rounded-lg flex items-center justify-center hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-600/80 midnight:hover:from-gray-600 midnight:hover:to-gray-600/80 purple:hover:from-gray-600 purple:hover:to-gray-600/80 shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 cursor-pointer group/view"
                  title="View document"
                >
                  <Eye className="w-3.5 h-3.5 transition-transform duration-300 group-hover/view:scale-110" />
                </button>
                <button
                  onClick={() => handleDownload(doc, idx)}
                  className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 midnight:from-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:to-pink-700 text-white rounded-lg flex items-center justify-center hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 midnight:hover:from-cyan-700 midnight:hover:to-cyan-800 purple:hover:from-pink-700 purple:hover:to-pink-800 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 dark:shadow-blue-500/40 midnight:shadow-cyan-500/30 purple:shadow-pink-500/30 active:scale-95 transition-all duration-300 cursor-pointer group/download"
                  title="Download document"
                >
                  <Download className="w-3.5 h-3.5 transition-transform duration-300 group-hover/download:scale-110" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-3 px-4">
          <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 flex items-center justify-center mb-1.5">
            <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 text-center">
            No documents available
          </p>
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewerModal
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          documentName={selectedDocument.name || "Document"}
          documentUrl={selectedDocument.url || ""}
          documentType={selectedDocument.type || "pdf"}
        />
      )}
    </div>
  );
}

