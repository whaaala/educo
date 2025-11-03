"use client";

import { GraduationCap } from "lucide-react";

interface PreviousSchoolSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export default function PreviousSchoolSection({
  formData,
  onChange,
}: PreviousSchoolSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-500 dark:from-violet-600 dark:to-purple-600 midnight:from-violet-700 midnight:to-purple-700 purple:from-purple-600 purple:to-violet-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Previous School Details
            </h2>
            <p className="text-sm text-white/80">
              Information about previous educational institution
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-6">
        {/* School Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
            Previous School Name
          </label>
          <input
            type="text"
            value={formData.previousSchoolName || ""}
            onChange={(e) => onChange("previousSchoolName", e.target.value)}
            placeholder="Enter name of previous school"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
          />
        </div>

        {/* School Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
            School Address
          </label>
          <textarea
            value={formData.previousSchoolAddress || ""}
            onChange={(e) =>
              onChange("previousSchoolAddress", e.target.value)
            }
            placeholder="Enter complete address of previous school"
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Previous Class */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Last Class Attended
            </label>
            <input
              type="text"
              value={formData.previousClass || ""}
              onChange={(e) => onChange("previousClass", e.target.value)}
              placeholder="e.g., Primary 5, JSS 2"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
            />
          </div>

          {/* Year Left */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Year of Leaving
            </label>
            <input
              type="number"
              value={formData.yearOfLeaving || ""}
              onChange={(e) => onChange("yearOfLeaving", e.target.value)}
              placeholder="e.g., 2024"
              min="1990"
              max={new Date().getFullYear()}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Contact Person Name
            </label>
            <input
              type="text"
              value={formData.previousSchoolContactName || ""}
              onChange={(e) =>
                onChange("previousSchoolContactName", e.target.value)
              }
              placeholder="Principal/Administrator name"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Contact Phone Number
            </label>
            <input
              type="tel"
              value={formData.previousSchoolContactPhone || ""}
              onChange={(e) =>
                onChange("previousSchoolContactPhone", e.target.value)
              }
              placeholder="+234xxxxxxxxxx"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
            />
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.previousSchoolContactEmail || ""}
              onChange={(e) =>
                onChange("previousSchoolContactEmail", e.target.value)
              }
              placeholder="school@example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
            />
          </div>

          {/* Transfer Certificate Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Transfer Certificate Number
            </label>
            <input
              type="text"
              value={formData.transferCertificateNumber || ""}
              onChange={(e) =>
                onChange("transferCertificateNumber", e.target.value)
              }
              placeholder="TC number if applicable"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
            />
          </div>
        </div>

        {/* Reason for Leaving */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
            Reason for Leaving
          </label>
          <textarea
            value={formData.reasonForLeaving || ""}
            onChange={(e) => onChange("reasonForLeaving", e.target.value)}
            placeholder="Brief explanation for leaving previous school"
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all resize-none"
          />
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border border-blue-200 dark:border-blue-800/30 midnight:border-cyan-800/30 purple:border-pink-800/30">
          <p className="text-sm text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
            <strong>Note:</strong> Previous school information is optional for
            new students or those starting primary education. Required for
            transfer students.
          </p>
        </div>
      </div>
    </div>
  );
}
