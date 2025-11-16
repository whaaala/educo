"use client";

import { useState } from "react";
import {
  FileText,
  ChevronUp,
  Upload,
} from "lucide-react";
import FileUpload from "@/components/shared/FileUpload";
import { ValidationErrors } from "@/lib/validation";

interface DocumentsSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: ValidationErrors;
}

export default function DocumentsSection({
  formData,
  onChange,
  errors = {},
}: DocumentsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Documents & Certificates
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Upload required documents and certifications
            </p>
          </div>
        </div>
        <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 cursor-pointer">
          <ChevronUp
            className={`w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isExpanded ? "rotate-0" : "rotate-180"
            }`}
          />
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload
                label="CV/Resume"
                value={formData.cvDocument}
                onChange={(file) => onChange("cvDocument", file)}
                helpText="Upload PDF, DOC, or DOCX (Max 5MB)"
                accept=".pdf,.doc,.docx"
              />
              <FileUpload
                label="Degree Certificate"
                value={formData.degreeCertificate}
                onChange={(file) => onChange("degreeCertificate", file)}
                helpText="Upload PDF or image (Max 5MB)"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <FileUpload
                label="Teaching Certification"
                value={formData.teachingCertificate}
                onChange={(file) => onChange("teachingCertificate", file)}
                helpText="Upload PDF or image (Max 5MB)"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <FileUpload
                label="ID Proof"
                value={formData.idProof}
                onChange={(file) => onChange("idProof", file)}
                helpText="Upload government-issued ID (Max 5MB)"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <FileUpload
                label="Police Clearance"
                value={formData.policeClearance}
                onChange={(file) => onChange("policeClearance", file)}
                helpText="Upload PDF or image (Max 5MB)"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <FileUpload
                label="Other Documents"
                value={formData.otherDocuments}
                onChange={(file) => onChange("otherDocuments", file)}
                helpText="Upload any additional documents (Max 5MB)"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
