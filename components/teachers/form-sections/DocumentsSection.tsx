"use client";

import { useState } from "react";
import {
  FileText,
  ChevronUp,
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
}: DocumentsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <section className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-violet-50/50 dark:bg-violet-900/10 midnight:bg-violet-900/10 purple:bg-violet-900/10 hover:bg-violet-50 dark:hover:bg-violet-900/20 midnight:hover:bg-violet-900/20 purple:hover:bg-violet-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 midnight:bg-violet-900/30 purple:bg-violet-900/30 flex items-center justify-center">
            <FileText className="w-4 h-4 text-violet-600 dark:text-violet-400 midnight:text-violet-400 purple:text-violet-400" />
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
        <div className={isExpanded ? "overflow-visible" : "overflow-hidden"}>
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employment Documents */}
              <FileUpload
                label="Appointment Letter"
                value={formData.appointmentLetter}
                onChange={(file) => onChange("appointmentLetter", file)}
                helpText="Upload PDF or image (Max 5MB)"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <FileUpload
                label="Acceptance Letter"
                value={formData.acceptanceLetter}
                onChange={(file) => onChange("acceptanceLetter", file)}
                helpText="Upload PDF or image (Max 5MB)"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <FileUpload
                label="Offer Letter"
                value={formData.offerLetter}
                onChange={(file) => onChange("offerLetter", file)}
                helpText="Upload PDF or image (Max 5MB)"
                accept=".pdf,.jpg,.jpeg,.png"
              />

              {/* Identification Documents */}
              <FileUpload
                label="National ID / Passport"
                value={formData.nationalId}
                onChange={(file) => onChange("nationalId", file)}
                helpText="Upload government-issued ID (Max 5MB)"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <FileUpload
                label="Passport Photograph"
                value={formData.passportPhoto}
                onChange={(file) => onChange("passportPhoto", file)}
                helpText="Upload passport-size photo (Max 5MB)"
                accept=".jpg,.jpeg,.png"
              />

              {/* Academic & Professional Certificates */}
              <FileUpload
                label="Degree Certificate"
                value={formData.degreeCertificate}
                onChange={(file) => onChange("degreeCertificate", file)}
                helpText="Upload highest degree certificate (Max 5MB)"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <FileUpload
                label="Other Certificates"
                value={formData.otherCertificates}
                onChange={(file) => onChange("otherCertificates", file)}
                helpText="Upload additional certificates (Max 5MB)"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <FileUpload
                label="TRCN Certificate"
                value={formData.trcnCertificate}
                onChange={(file) => onChange("trcnCertificate", file)}
                helpText="Upload TRCN certificate (Nigeria) (Max 5MB)"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <FileUpload
                label="Teaching License"
                value={formData.teachingLicense}
                onChange={(file) => onChange("teachingLicense", file)}
                helpText="Upload teaching license (Max 5MB)"
                accept=".pdf,.jpg,.jpeg,.png"
              />

              {/* Clearance Documents */}
              <FileUpload
                label="Police Clearance Certificate"
                value={formData.policeClearance}
                onChange={(file) => onChange("policeClearance", file)}
                helpText="Upload police clearance (Max 5MB)"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <FileUpload
                label="Medical Certificate"
                value={formData.medicalCertificate}
                onChange={(file) => onChange("medicalCertificate", file)}
                helpText="Upload medical fitness certificate (Max 5MB)"
                accept=".pdf,.jpg,.jpeg,.png"
              />

              {/* Resume and References */}
              <FileUpload
                label="Resume / CV"
                value={formData.cvDocument}
                onChange={(file) => onChange("cvDocument", file)}
                helpText="Upload PDF, DOC, or DOCX (Max 5MB)"
                accept=".pdf,.doc,.docx"
              />
              <FileUpload
                label="Reference Letters"
                value={formData.referenceLetters}
                onChange={(file) => onChange("referenceLetters", file)}
                helpText="Upload reference letters (Max 5MB)"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />

              {/* Other Documents */}
              <FileUpload
                label="Bank Statement"
                value={formData.bankStatement}
                onChange={(file) => onChange("bankStatement", file)}
                helpText="Upload recent bank statement (Max 5MB)"
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

            {/* Info Note */}
            <div className="p-4 rounded-lg bg-violet-50 dark:bg-violet-900/20 midnight:bg-violet-900/20 purple:bg-violet-900/20 border border-violet-200 dark:border-violet-800/30 midnight:border-violet-800/30 purple:border-violet-800/30">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded bg-violet-100 dark:bg-violet-900/30 midnight:bg-violet-900/30 purple:bg-violet-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 midnight:text-violet-400 purple:text-violet-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-violet-700 dark:text-violet-300 midnight:text-violet-300 purple:text-violet-300">
                    <strong className="font-semibold">Document Guidelines:</strong>
                  </p>
                  <ul className="text-xs text-violet-600 dark:text-violet-400 midnight:text-violet-400 purple:text-violet-400 list-disc list-inside space-y-0.5">
                    <li>All documents should be clear and legible</li>
                    <li>Maximum file size: 5MB per document</li>
                    <li>Accepted formats: PDF, JPG, PNG, DOC, DOCX</li>
                    <li>Documents marked with asterisk (*) are mandatory</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
