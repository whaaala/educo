"use client";

import { MapPin } from "lucide-react";

interface AddressSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export default function AddressSection({
  formData,
  onChange,
}: AddressSectionProps) {
  const handleSameAsCurrentChange = (checked: boolean) => {
    onChange("sameAsCurrentAddress", checked);
    if (checked) {
      // Copy current address to permanent address
      onChange("permanentAddress", formData.currentAddress || "");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 midnight:from-emerald-700 midnight:to-teal-700 purple:from-teal-600 purple:to-emerald-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Address</h2>
            <p className="text-sm text-white/80">
              Current and permanent address details
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-6">
        {/* Current Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
            Current Address <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={formData.currentAddress || ""}
            onChange={(e) => {
              onChange("currentAddress", e.target.value);
              // If "Same as Current Address" is checked, update permanent address too
              if (formData.sameAsCurrentAddress) {
                onChange("permanentAddress", e.target.value);
              }
            }}
            placeholder="Enter current residential address"
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all resize-none"
          />
        </div>

        {/* Same as Current Address Checkbox */}
        <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30">
          <input
            type="checkbox"
            id="sameAsCurrentAddress"
            checked={formData.sameAsCurrentAddress || false}
            onChange={(e) => handleSameAsCurrentChange(e.target.checked)}
            className="w-5 h-5 text-blue-600 dark:text-blue-500 midnight:text-cyan-500 purple:text-pink-500 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 focus:ring-2"
          />
          <label
            htmlFor="sameAsCurrentAddress"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 cursor-pointer"
          >
            Same as Current Address
          </label>
        </div>

        {/* Permanent Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
            Permanent Address <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={formData.permanentAddress || ""}
            onChange={(e) => onChange("permanentAddress", e.target.value)}
            placeholder="Enter permanent residential address"
            rows={4}
            disabled={formData.sameAsCurrentAddress}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}
