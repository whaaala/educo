"use client";

import { Bus } from "lucide-react";

interface TransportSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export default function TransportSection({
  formData,
  onChange,
}: TransportSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-600 dark:to-amber-600 midnight:from-orange-700 midnight:to-amber-700 purple:from-amber-600 purple:to-orange-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Bus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Transport Information
            </h2>
            <p className="text-sm text-white/80">
              School transport and route details
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Route Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Route Name
            </label>
            <select
              value={formData.transportRoute || ""}
              onChange={(e) => onChange("transportRoute", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
            >
              <option value="">Select Route</option>
              <option value="Route 1 - Ikeja">Route 1 - Ikeja</option>
              <option value="Route 2 - Victoria Island">
                Route 2 - Victoria Island
              </option>
              <option value="Route 3 - Lekki">Route 3 - Lekki</option>
              <option value="Route 4 - Surulere">Route 4 - Surulere</option>
              <option value="Route 5 - Ikoyi">Route 5 - Ikoyi</option>
              <option value="Route 6 - Ajah">Route 6 - Ajah</option>
              <option value="Route 7 - Yaba">Route 7 - Yaba</option>
              <option value="Route 8 - Gbagada">Route 8 - Gbagada</option>
            </select>
          </div>

          {/* Vehicle Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Vehicle Number
            </label>
            <select
              value={formData.vehicleNumber || ""}
              onChange={(e) => onChange("vehicleNumber", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
            >
              <option value="">Select Vehicle</option>
              <option value="BUS-001">BUS-001</option>
              <option value="BUS-002">BUS-002</option>
              <option value="BUS-003">BUS-003</option>
              <option value="BUS-004">BUS-004</option>
              <option value="BUS-005">BUS-005</option>
              <option value="BUS-006">BUS-006</option>
              <option value="VAN-001">VAN-001</option>
              <option value="VAN-002">VAN-002</option>
            </select>
          </div>

          {/* Pickup Point */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Pickup Point
            </label>
            <input
              type="text"
              value={formData.pickupPoint || ""}
              onChange={(e) => onChange("pickupPoint", e.target.value)}
              placeholder="Enter pickup location"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border border-blue-200 dark:border-blue-800/30 midnight:border-cyan-800/30 purple:border-pink-800/30">
          <p className="text-sm text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
            <strong>Note:</strong> Transport information is optional. Leave blank
            if the student does not use school transport services.
          </p>
        </div>
      </div>
    </div>
  );
}
