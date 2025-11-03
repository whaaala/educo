"use client";

import { FileText } from "lucide-react";
import FileUpload from "@/components/shared/FileUpload";

interface DocumentsSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export default function DocumentsSection({
  formData,
  onChange,
}: DocumentsSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-600 dark:to-blue-600 midnight:from-cyan-700 midnight:to-blue-700 purple:from-blue-600 purple:to-cyan-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Documents & Certificates
            </h2>
            <p className="text-sm text-white/80">
              Upload required and optional documents
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-6">
        {/* Birth Certificate */}
        <FileUpload
          label="Birth Certificate"
          accept="application/pdf,image/jpeg,image/png"
          maxSize={4}
          value={formData.birthCertificate}
          onChange={(file) => onChange("birthCertificate", file)}
          helpText="Upload PDF or Image, max 4MB"
          preview={true}
        />

        {/* Transfer Certificate */}
        <FileUpload
          label="Transfer Certificate (TC)"
          accept="application/pdf,image/jpeg,image/png"
          maxSize={4}
          value={formData.transferCertificate}
          onChange={(file) => onChange("transferCertificate", file)}
          helpText="Upload PDF or Image, max 4MB (Required if transferring from another school)"
          preview={true}
        />

        {/* Previous School Certificate */}
        <FileUpload
          label="Previous School Certificate"
          accept="application/pdf,image/jpeg,image/png"
          maxSize={4}
          value={formData.previousSchoolCertificate}
          onChange={(file) => onChange("previousSchoolCertificate", file)}
          helpText="Upload PDF or Image, max 4MB"
          preview={true}
        />

        {/* Parent ID Card */}
        <FileUpload
          label="Parent/Guardian ID Card"
          accept="application/pdf,image/jpeg,image/png"
          maxSize={4}
          value={formData.parentIdCard}
          onChange={(file) => onChange("parentIdCard", file)}
          helpText="Upload PDF or Image, max 4MB"
          preview={true}
        />

        {/* Medical Report */}
        <FileUpload
          label="Medical Report/Health Card"
          accept="application/pdf,image/jpeg,image/png"
          maxSize={4}
          value={formData.medicalReport}
          onChange={(file) => onChange("medicalReport", file)}
          helpText="Upload PDF or Image, max 4MB"
          preview={true}
        />

        {/* Immunization Certificate */}
        <FileUpload
          label="Immunization Certificate"
          accept="application/pdf,image/jpeg,image/png"
          maxSize={4}
          value={formData.immunizationCertificate}
          onChange={(file) => onChange("immunizationCertificate", file)}
          helpText="Upload PDF or Image, max 4MB"
          preview={true}
        />

        {/* Passport Photograph */}
        <FileUpload
          label="Passport Photograph"
          accept="image/jpeg,image/png"
          maxSize={2}
          value={formData.passportPhoto}
          onChange={(file) => onChange("passportPhoto", file)}
          helpText="Upload Image (JPG, PNG), max 2MB"
          preview={true}
        />

        {/* Other Documents */}
        <FileUpload
          label="Other Documents (Optional)"
          accept="application/pdf,image/jpeg,image/png"
          maxSize={4}
          value={formData.otherDocuments}
          onChange={(file) => onChange("otherDocuments", file)}
          helpText="Upload any other relevant documents (PDF or Image, max 4MB)"
          preview={true}
        />

        {/* Info Box */}
        <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border border-blue-200 dark:border-blue-800/30 midnight:border-cyan-800/30 purple:border-pink-800/30">
          <p className="text-sm text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
            <strong>Important:</strong> Ensure all documents are clear and
            legible. Accepted formats: PDF, JPG, PNG. Birth Certificate is
            mandatory for admission.
          </p>
        </div>
      </div>
    </div>
  );
}
