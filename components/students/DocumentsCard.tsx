"use client";

import { Download, FileText } from "lucide-react";

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

  const handleDownload = (doc: Document, index: number) => {
    // Handle download logic here
    console.log("Downloading document:", doc.name || `Document ${index + 1}`);
    if (doc.url) {
      window.open(doc.url, "_blank");
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-sm border border-gray-200/40 dark:border-gray-800/40 midnight:border-cyan-500/20 purple:border-pink-500/20 pt-2 px-3 sm:px-4 pb-2 sm:pb-3 transition-all duration-200 hover:shadow-md hover:border-gray-300/60 dark:hover:border-gray-700/60 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30">
      {/* Header */}
      <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">
        Documents
      </h3>

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-gray-800/50 midnight:bg-gray-800/30 purple:bg-gray-800/30 mb-2"></div>

      {/* Documents List */}
      {documentsArray.length > 0 ? (
        <div className="space-y-2">
          {documentsArray.map((doc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-50/50 dark:bg-gray-800/30 midnight:bg-gray-900/30 purple:bg-gray-900/30 hover:bg-gray-100/70 dark:hover:bg-gray-800/50 transition-colors duration-200"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 text-xs font-bold">
                    PDF
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
                  {doc?.name || `Document ${idx + 1}`}
                </span>
              </div>
              <button
                onClick={() => handleDownload(doc, idx)}
                className="w-7 h-7 bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 text-white rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-blue-700 dark:hover:bg-blue-600 midnight:hover:bg-cyan-700 purple:hover:bg-pink-700 hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-3 px-4">
          <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 flex items-center justify-center mb-1.5">
            <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 text-center">
            No documents available
          </p>
        </div>
      )}
    </div>
  );
}

