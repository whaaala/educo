"use client";

import { Home } from "lucide-react";

interface HostelSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export default function HostelSection({
  formData,
  onChange,
}: HostelSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-rose-500 to-red-500 dark:from-rose-600 dark:to-red-600 midnight:from-rose-700 midnight:to-red-700 purple:from-red-600 purple:to-rose-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Hostel Information</h2>
            <p className="text-sm text-white/80">
              Boarding facility and room details
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hostel Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Hostel Name
            </label>
            <select
              value={formData.hostelName || ""}
              onChange={(e) => onChange("hostelName", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
            >
              <option value="">Select Hostel</option>
              <optgroup label="Boys Hostels">
                <option value="Mandela House (Boys)">
                  Mandela House (Boys)
                </option>
                <option value="Nyerere Hall (Boys)">Nyerere Hall (Boys)</option>
                <option value="Azikiwe Block (Boys)">
                  Azikiwe Block (Boys)
                </option>
              </optgroup>
              <optgroup label="Girls Hostels">
                <option value="Queens Hall (Girls)">Queens Hall (Girls)</option>
                <option value="Princess House (Girls)">
                  Princess House (Girls)
                </option>
                <option value="Duchess Block (Girls)">
                  Duchess Block (Girls)
                </option>
              </optgroup>
              <optgroup label="Mixed/Junior Hostels">
                <option value="Junior Block A">Junior Block A</option>
                <option value="Junior Block B">Junior Block B</option>
              </optgroup>
            </select>
          </div>

          {/* Room Number/Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Room Number
            </label>
            <input
              type="text"
              value={formData.roomNumber || ""}
              onChange={(e) => onChange("roomNumber", e.target.value)}
              placeholder="e.g., 101, A-204"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border border-blue-200 dark:border-blue-800/30 midnight:border-cyan-800/30 purple:border-pink-800/30">
          <p className="text-sm text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
            <strong>Note:</strong> Hostel information is optional and only
            applicable for boarding students. Leave blank for day students.
          </p>
        </div>
      </div>
    </div>
  );
}
