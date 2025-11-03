"use client";

import { Users } from "lucide-react";
import FileUpload from "@/components/shared/FileUpload";

interface ParentsGuardianSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export default function ParentsGuardianSection({
  formData,
  onChange,
}: ParentsGuardianSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 midnight:from-purple-700 midnight:to-pink-700 purple:from-pink-600 purple:to-purple-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Parents & Guardian Information
            </h2>
            <p className="text-sm text-white/80">
              Parent and guardian contact details
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-8">
        {/* Father's Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-300 purple:text-pink-300 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 pb-2">
            Father&apos;s Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Father's Photo */}
            <div className="lg:col-span-3">
              <FileUpload
                label="Father's Photo"
                accept="image/jpeg,image/png,image/svg+xml"
                maxSize={4}
                value={formData.fatherPhoto}
                onChange={(file) => onChange("fatherPhoto", file)}
                helpText="Upload image size 4MB, Format JPG, PNG, SVG"
                preview={true}
              />
            </div>

            {/* Father's Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Father&apos;s Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fatherName || ""}
                onChange={(e) => onChange("fatherName", e.target.value)}
                placeholder="Enter father's full name"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
              />
            </div>

            {/* Father's Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.fatherEmail || ""}
                onChange={(e) => onChange("fatherEmail", e.target.value)}
                placeholder="father@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
              />
            </div>

            {/* Father's Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.fatherPhone || ""}
                onChange={(e) => onChange("fatherPhone", e.target.value)}
                placeholder="+234xxxxxxxxxx"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
              />
            </div>

            {/* Father's Occupation */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Occupation
              </label>
              <input
                type="text"
                value={formData.fatherOccupation || ""}
                onChange={(e) => onChange("fatherOccupation", e.target.value)}
                placeholder="Enter father's occupation"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Mother's Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-300 purple:text-pink-300 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 pb-2">
            Mother&apos;s Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mother's Photo */}
            <div className="lg:col-span-3">
              <FileUpload
                label="Mother's Photo"
                accept="image/jpeg,image/png,image/svg+xml"
                maxSize={4}
                value={formData.motherPhoto}
                onChange={(file) => onChange("motherPhoto", file)}
                helpText="Upload image size 4MB, Format JPG, PNG, SVG"
                preview={true}
              />
            </div>

            {/* Mother's Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Mother&apos;s Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.motherName || ""}
                onChange={(e) => onChange("motherName", e.target.value)}
                placeholder="Enter mother's full name"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
              />
            </div>

            {/* Mother's Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.motherEmail || ""}
                onChange={(e) => onChange("motherEmail", e.target.value)}
                placeholder="mother@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
              />
            </div>

            {/* Mother's Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.motherPhone || ""}
                onChange={(e) => onChange("motherPhone", e.target.value)}
                placeholder="+234xxxxxxxxxx"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
              />
            </div>

            {/* Mother's Occupation */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Occupation
              </label>
              <input
                type="text"
                value={formData.motherOccupation || ""}
                onChange={(e) => onChange("motherOccupation", e.target.value)}
                placeholder="Enter mother's occupation"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Guardian Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-300 purple:text-pink-300 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 pb-2">
            Guardian Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Guardian Is */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-3">
                Guardian Is <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-4">
                {["Father", "Mother", "Guardian", "Other"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="guardianIs"
                      value={option}
                      checked={formData.guardianIs === option}
                      onChange={(e) => onChange("guardianIs", e.target.value)}
                      className="w-4 h-4 text-blue-600 dark:text-blue-500 midnight:text-cyan-500 purple:text-pink-500 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Guardian Photo */}
            <div className="lg:col-span-3">
              <FileUpload
                label="Guardian's Photo"
                accept="image/jpeg,image/png,image/svg+xml"
                maxSize={4}
                value={formData.guardianPhoto}
                onChange={(file) => onChange("guardianPhoto", file)}
                helpText="Upload image size 4MB, Format JPG, PNG, SVG"
                preview={true}
              />
            </div>

            {/* Guardian Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Guardian Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.guardianName || ""}
                onChange={(e) => onChange("guardianName", e.target.value)}
                placeholder="Enter guardian's full name"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
              />
            </div>

            {/* Guardian Relation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Guardian Relation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.guardianRelation || ""}
                onChange={(e) => onChange("guardianRelation", e.target.value)}
                placeholder="e.g., Uncle, Aunt, Sponsor"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
              />
            </div>

            {/* Guardian Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.guardianPhone || ""}
                onChange={(e) => onChange("guardianPhone", e.target.value)}
                placeholder="+234xxxxxxxxxx"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
              />
            </div>

            {/* Guardian Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.guardianEmail || ""}
                onChange={(e) => onChange("guardianEmail", e.target.value)}
                placeholder="guardian@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
              />
            </div>

            {/* Guardian Occupation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Occupation
              </label>
              <input
                type="text"
                value={formData.guardianOccupation || ""}
                onChange={(e) =>
                  onChange("guardianOccupation", e.target.value)
                }
                placeholder="Enter guardian's occupation"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
              />
            </div>

            {/* Guardian Address */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.guardianAddress || ""}
                onChange={(e) => onChange("guardianAddress", e.target.value)}
                placeholder="Enter guardian's full address"
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
