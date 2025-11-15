"use client";

import { useState } from "react";
import {
  FileText,
  ChevronUp,
  ChevronDown,
  Info,
  FileCheck,
  File,
  Image as ImageIcon,
  User,
  Heart,
  Shield,
  FolderOpen,
  Plus,
  Trash2,
} from "lucide-react";
import FileUpload from "@/components/shared/FileUpload";
import FormInput from "@/components/shared/FormInput";
import { ValidationErrors } from "@/lib/validation";

interface AdditionalDocument {
  id: string;
  label: string;
  file: File | null;
}

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
  const [additionalDocuments, setAdditionalDocuments] = useState<
    AdditionalDocument[]
  >(formData.additionalDocuments || []);

  const addAdditionalDocument = () => {
    const newDoc: AdditionalDocument = {
      id: Date.now().toString(),
      label: "",
      file: null,
    };
    const updatedDocs = [...additionalDocuments, newDoc];
    setAdditionalDocuments(updatedDocs);
    onChange("additionalDocuments", updatedDocs);
  };

  const removeAdditionalDocument = (id: string) => {
    const updatedDocs = additionalDocuments.filter((doc) => doc.id !== id);
    setAdditionalDocuments(updatedDocs);
    onChange("additionalDocuments", updatedDocs);
  };

  const updateAdditionalDocumentLabel = (id: string, label: string) => {
    const updatedDocs = additionalDocuments.map((doc) =>
      doc.id === id ? { ...doc, label } : doc
    );
    setAdditionalDocuments(updatedDocs);
    onChange("additionalDocuments", updatedDocs);
  };

  const updateAdditionalDocumentFile = (id: string, file: File | null) => {
    const updatedDocs = additionalDocuments.map((doc) =>
      doc.id === id ? { ...doc, file } : doc
    );
    setAdditionalDocuments(updatedDocs);
    onChange("additionalDocuments", updatedDocs);
  };

  return (
    <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-cyan-50/50 dark:bg-cyan-900/10 midnight:bg-cyan-900/10 purple:bg-cyan-900/10 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-cyan-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30 flex items-center justify-center">
            <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Documents & Certificates
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Upload required and optional documents
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
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 lg:space-y-10">
          {/* Required Documents Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-900/20 midnight:bg-cyan-900/20 purple:bg-cyan-900/20 flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Required Documents
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                    <div className="w-2.5 h-2.5 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400">
                      <File className="w-full h-full" />
                    </div>
                  </div>
                  <span>Birth Certificate</span>
                </label>
                <FileUpload
                  accept="application/pdf,image/jpeg,image/png"
                  maxSize={4}
                  value={formData.birthCertificate}
                  onChange={(file) => onChange("birthCertificate", file)}
                  helpText="Upload PDF or Image, max 4MB"
                  preview={true}
                  compact={true}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                    <div className="w-2.5 h-2.5 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400">
                      <FileCheck className="w-full h-full" />
                    </div>
                  </div>
                  <span>Transfer Certificate (TC)</span>
                </label>
                <FileUpload
                  accept="application/pdf,image/jpeg,image/png"
                  maxSize={4}
                  value={formData.transferCertificate}
                  onChange={(file) => onChange("transferCertificate", file)}
                  helpText="PDF or Image, max 4MB (Required if transferring)"
                  preview={true}
                  compact={true}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                    <div className="w-2.5 h-2.5 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400">
                      <FileText className="w-full h-full" />
                    </div>
                  </div>
                  <span>Previous School Certificate</span>
                </label>
                <FileUpload
                  accept="application/pdf,image/jpeg,image/png"
                  maxSize={4}
                  value={formData.previousSchoolCertificate}
                  onChange={(file) => onChange("previousSchoolCertificate", file)}
                  helpText="Upload PDF or Image, max 4MB"
                  preview={true}
                  compact={true}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                    <div className="w-2.5 h-2.5 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400">
                      <ImageIcon className="w-full h-full" />
                    </div>
                  </div>
                  <span>Passport Photograph</span>
                </label>
                <FileUpload
                  accept="image/jpeg,image/png"
                  maxSize={2}
                  value={formData.passportPhoto}
                  onChange={(file) => onChange("passportPhoto", file)}
                  helpText="Upload Image (JPG, PNG), max 2MB"
                  preview={true}
                  compact={true}
                />
              </div>
            </div>
          </div>

          {/* Additional Documents Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-900/20 midnight:bg-cyan-900/20 purple:bg-cyan-900/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Additional Documents
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                    <div className="w-2.5 h-2.5 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400">
                      <User className="w-full h-full" />
                    </div>
                  </div>
                  <span>Parent/Guardian ID Card</span>
                </label>
                <FileUpload
                  accept="application/pdf,image/jpeg,image/png"
                  maxSize={4}
                  value={formData.parentIdCard}
                  onChange={(file) => onChange("parentIdCard", file)}
                  helpText="Upload PDF or Image, max 4MB"
                  preview={true}
                  compact={true}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                    <div className="w-2.5 h-2.5 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400">
                      <Heart className="w-full h-full" />
                    </div>
                  </div>
                  <span>Medical Report/Health Card</span>
                </label>
                <FileUpload
                  accept="application/pdf,image/jpeg,image/png"
                  maxSize={4}
                  value={formData.medicalReport}
                  onChange={(file) => onChange("medicalReport", file)}
                  helpText="Upload PDF or Image, max 4MB"
                  preview={true}
                  compact={true}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                    <div className="w-2.5 h-2.5 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400">
                      <Shield className="w-full h-full" />
                    </div>
                  </div>
                  <span>Immunization Certificate</span>
                </label>
                <FileUpload
                  accept="application/pdf,image/jpeg,image/png"
                  maxSize={4}
                  value={formData.immunizationCertificate}
                  onChange={(file) => onChange("immunizationCertificate", file)}
                  helpText="Upload PDF or Image, max 4MB"
                  preview={true}
                  compact={true}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                    <div className="w-2.5 h-2.5 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400">
                      <FolderOpen className="w-full h-full" />
                    </div>
                  </div>
                  <span>Other Documents (Optional)</span>
                </label>
                <FileUpload
                  accept="application/pdf,image/jpeg,image/png"
                  maxSize={4}
                  value={formData.otherDocuments}
                  onChange={(file) => onChange("otherDocuments", file)}
                  helpText="Any other relevant documents, max 4MB"
                  preview={true}
                  compact={true}
                />
              </div>
            </div>
          </div>

          {/* Additional Custom Documents Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pl-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-900/20 midnight:bg-cyan-900/20 purple:bg-cyan-900/20 flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Additional Documents
                </h3>
              </div>
              <button
                type="button"
                onClick={addAdditionalDocument}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30 hover:bg-cyan-200 dark:hover:bg-cyan-900/40 midnight:hover:bg-cyan-900/40 purple:hover:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400 font-medium text-xs transition-all duration-200 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Document
              </button>
            </div>

            {additionalDocuments.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                {additionalDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="space-y-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50/50 dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                          <div className="w-2.5 h-2.5 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400">
                            <File className="w-full h-full" />
                          </div>
                        </div>
                        <span>Document Name</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => removeAdditionalDocument(doc.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 midnight:hover:bg-red-900/30 purple:hover:bg-red-900/30 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 font-medium text-xs transition-all duration-200 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                    <FormInput
                      label=""
                      icon={<FileText className="w-full h-full" />}
                      iconBgColor="bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30"
                      iconColor="text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400"
                      value={doc.label}
                      onChange={(value) =>
                        updateAdditionalDocumentLabel(doc.id, value)
                      }
                      placeholder="Enter document name (e.g., Character Certificate)"
                      type="text"
                    />
                    <FileUpload
                      accept="application/pdf,image/jpeg,image/png"
                      maxSize={4}
                      value={doc.file}
                      onChange={(file) => updateAdditionalDocumentFile(doc.id, file)}
                      helpText="Upload PDF or Image, max 4MB"
                      preview={true}
                      compact={true}
                    />
                  </div>
                ))}
              </div>
            )}

            {additionalDocuments.length === 0 && (
              <div className="pl-2">
                <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    No additional documents added yet. Click "Add Document" to
                    add more.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="pl-2">
            <div className="p-4 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 midnight:bg-cyan-900/20 purple:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800/30 midnight:border-cyan-800/30 purple:border-cyan-800/30">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400" />
                </div>
                <p className="text-sm text-cyan-700 dark:text-cyan-300 midnight:text-cyan-300 purple:text-cyan-300">
                  <strong className="font-semibold">Important:</strong> Ensure
                  all documents are clear and legible. Accepted formats: PDF,
                  JPG, PNG. Birth Certificate is mandatory for admission.
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
