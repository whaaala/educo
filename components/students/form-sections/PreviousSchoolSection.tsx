"use client";

import { useState } from "react";
import {
  GraduationCap,
  MapPin,
  LogOut,
  ChevronUp,
  ChevronDown,
  Info,
  BookOpen,
  Calendar,
  User,
  Phone,
  Mail,
  FileCheck,
} from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormTextarea from "@/components/shared/FormTextarea";

interface PreviousSchoolSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export default function PreviousSchoolSection({
  formData,
  onChange,
}: PreviousSchoolSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-violet-50/50 dark:bg-violet-900/10 midnight:bg-violet-900/10 purple:bg-violet-900/10 hover:bg-violet-50 dark:hover:bg-violet-900/20 midnight:hover:bg-violet-900/20 purple:hover:bg-violet-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 midnight:bg-violet-900/30 purple:bg-violet-900/30 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-violet-600 dark:text-violet-400 midnight:text-violet-400 purple:text-violet-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Previous School Details
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Information about previous educational institution
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
          {/* School Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/20 midnight:bg-violet-900/20 purple:bg-violet-900/20 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-4 h-4 text-violet-600 dark:text-violet-400 midnight:text-violet-400 purple:text-violet-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                School Information
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
              <FormInput
                label="Previous School Name"
                icon={<GraduationCap className="w-full h-full" />}
                iconBgColor="bg-violet-100 dark:bg-violet-900/30 midnight:bg-violet-900/30 purple:bg-violet-900/30"
                iconColor="text-violet-600 dark:text-violet-400 midnight:text-violet-400 purple:text-violet-400"
                value={formData.previousSchoolName || ""}
                onChange={(value) => onChange("previousSchoolName", value)}
                placeholder="Enter name of previous school"
                type="text"
              />
              <FormInput
                label="Last Class Attended"
                icon={<BookOpen className="w-full h-full" />}
                iconBgColor="bg-violet-100 dark:bg-violet-900/30 midnight:bg-violet-900/30 purple:bg-violet-900/30"
                iconColor="text-violet-600 dark:text-violet-400 midnight:text-violet-400 purple:text-violet-400"
                value={formData.previousClass || ""}
                onChange={(value) => onChange("previousClass", value)}
                placeholder="e.g., Primary 5, JSS 2"
                type="text"
              />
              <FormInput
                label="Year of Leaving"
                icon={<Calendar className="w-full h-full" />}
                iconBgColor="bg-violet-100 dark:bg-violet-900/30 midnight:bg-violet-900/30 purple:bg-violet-900/30"
                iconColor="text-violet-600 dark:text-violet-400 midnight:text-violet-400 purple:text-violet-400"
                value={formData.yearOfLeaving || ""}
                onChange={(value) => onChange("yearOfLeaving", value)}
                placeholder="e.g., 2024"
                type="number"
              />
            </div>
            <div className="pl-2">
              <FormTextarea
                label="School Address"
                icon={<MapPin className="w-full h-full" />}
                iconBgColor="bg-violet-100 dark:bg-violet-900/30 midnight:bg-violet-900/30 purple:bg-violet-900/30"
                iconColor="text-violet-600 dark:text-violet-400 midnight:text-violet-400 purple:text-violet-400"
                value={formData.previousSchoolAddress || ""}
                onChange={(value) => onChange("previousSchoolAddress", value)}
                placeholder="Enter complete address of previous school"
                rows={3}
              />
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/20 midnight:bg-violet-900/20 purple:bg-violet-900/20 flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-violet-600 dark:text-violet-400 midnight:text-violet-400 purple:text-violet-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Contact Information
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
              <FormInput
                label="Contact Person Name"
                icon={<User className="w-full h-full" />}
                iconBgColor="bg-violet-100 dark:bg-violet-900/30 midnight:bg-violet-900/30 purple:bg-violet-900/30"
                iconColor="text-violet-600 dark:text-violet-400 midnight:text-violet-400 purple:text-violet-400"
                value={formData.previousSchoolContactName || ""}
                onChange={(value) => onChange("previousSchoolContactName", value)}
                placeholder="Principal/Administrator name"
                type="text"
              />
              <FormInput
                label="Contact Phone Number"
                icon={<Phone className="w-full h-full" />}
                iconBgColor="bg-violet-100 dark:bg-violet-900/30 midnight:bg-violet-900/30 purple:bg-violet-900/30"
                iconColor="text-violet-600 dark:text-violet-400 midnight:text-violet-400 purple:text-violet-400"
                value={formData.previousSchoolContactPhone || ""}
                onChange={(value) => onChange("previousSchoolContactPhone", value)}
                placeholder="+234xxxxxxxxxx"
                type="text"
              />
              <FormInput
                label="Contact Email"
                icon={<Mail className="w-full h-full" />}
                iconBgColor="bg-violet-100 dark:bg-violet-900/30 midnight:bg-violet-900/30 purple:bg-violet-900/30"
                iconColor="text-violet-600 dark:text-violet-400 midnight:text-violet-400 purple:text-violet-400"
                value={formData.previousSchoolContactEmail || ""}
                onChange={(value) => onChange("previousSchoolContactEmail", value)}
                placeholder="school@example.com"
                type="email"
              />
              <FormInput
                label="Transfer Certificate Number"
                icon={<FileCheck className="w-full h-full" />}
                iconBgColor="bg-violet-100 dark:bg-violet-900/30 midnight:bg-violet-900/30 purple:bg-violet-900/30"
                iconColor="text-violet-600 dark:text-violet-400 midnight:text-violet-400 purple:text-violet-400"
                value={formData.transferCertificateNumber || ""}
                onChange={(value) => onChange("transferCertificateNumber", value)}
                placeholder="TC number if applicable"
                type="text"
              />
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/20 midnight:bg-violet-900/20 purple:bg-violet-900/20 flex items-center justify-center flex-shrink-0">
                <LogOut className="w-4 h-4 text-violet-600 dark:text-violet-400 midnight:text-violet-400 purple:text-violet-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Additional Information
              </h3>
            </div>
            <div className="pl-2">
              <FormTextarea
                label="Reason for Leaving"
                icon={<LogOut className="w-full h-full" />}
                iconBgColor="bg-violet-100 dark:bg-violet-900/30 midnight:bg-violet-900/30 purple:bg-violet-900/30"
                iconColor="text-violet-600 dark:text-violet-400 midnight:text-violet-400 purple:text-violet-400"
                value={formData.reasonForLeaving || ""}
                onChange={(value) => onChange("reasonForLeaving", value)}
                placeholder="Brief explanation for leaving previous school"
                rows={3}
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="pl-2">
            <div className="p-4 rounded-lg bg-violet-50 dark:bg-violet-900/20 midnight:bg-violet-900/20 purple:bg-violet-900/20 border border-violet-200 dark:border-violet-800/30 midnight:border-violet-800/30 purple:border-violet-800/30">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded bg-violet-100 dark:bg-violet-900/30 midnight:bg-violet-900/30 purple:bg-violet-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 midnight:text-violet-400 purple:text-violet-400" />
                </div>
                <p className="text-sm text-violet-700 dark:text-violet-300 midnight:text-violet-300 purple:text-violet-300">
                  <strong className="font-semibold">Note:</strong> Previous school
                  information is optional for new students or those starting primary
                  education. Required for transfer students.
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
