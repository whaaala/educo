"use client";

import { useState } from "react";
import {
  Bus,
  Route,
  Car,
  MapPin,
  ChevronUp,
  ChevronDown,
  Info
} from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import {
  getTransportRoutes,
  getTransportVehicles,
  getPickupPoints,
} from "@/lib/mockTransport";

interface TransportSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export default function TransportSection({
  formData,
  onChange,
}: TransportSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Get transport data from reusable mock data
  const routes = getTransportRoutes();
  const vehicles = getTransportVehicles();
  const pickupPoints = getPickupPoints();

  return (
    <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-indigo-50/50 dark:bg-indigo-900/10 midnight:bg-indigo-900/10 purple:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 midnight:hover:bg-indigo-900/20 purple:hover:bg-indigo-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30 flex items-center justify-center">
            <Bus className="w-4 h-4 text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Transport Information
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              School transport and route details
            </p>
          </div>
        </div>
        <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 cursor-pointer">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 lg:space-y-10 animate-in fade-in duration-200">
          {/* Transport Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 midnight:bg-indigo-900/20 purple:bg-indigo-900/20 flex items-center justify-center flex-shrink-0">
                <Bus className="w-4 h-4 text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Transport Details
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
              <FormDropdown
                label="Route Name"
                icon={<Route className="w-full h-full" />}
                iconBgColor="bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30"
                iconColor="text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400"
                value={formData.transportRoute || ""}
                onChange={(value) => onChange("transportRoute", value)}
                options={routes}
                placeholder="Select Route"
              />
              <FormDropdown
                label="Vehicle Number"
                icon={<Car className="w-full h-full" />}
                iconBgColor="bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30"
                iconColor="text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400"
                value={formData.vehicleNumber || ""}
                onChange={(value) => onChange("vehicleNumber", value)}
                options={vehicles}
                placeholder="Select Vehicle"
              />
              <FormDropdown
                label="Pickup Point"
                icon={<MapPin className="w-full h-full" />}
                iconBgColor="bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30"
                iconColor="text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400"
                value={formData.pickupPoint || ""}
                onChange={(value) => onChange("pickupPoint", value)}
                options={pickupPoints}
                placeholder="Select pickup point"
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="pl-2">
            <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 midnight:bg-indigo-900/20 purple:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/30 midnight:border-indigo-800/30 purple:border-indigo-800/30">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400" />
                </div>
                <p className="text-sm text-indigo-700 dark:text-indigo-300 midnight:text-indigo-300 purple:text-indigo-300">
                  <strong className="font-semibold">Note:</strong> Transport
                  information is optional. Leave blank if the student does not
                  use school transport services.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
