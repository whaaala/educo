"use client";

import { useState } from "react";
import {
  Home,
  Building2,
  Hash,
  ChevronUp,
  ChevronDown,
  Info,
} from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import { getHostels } from "@/lib/mockHostel";
import { ValidationErrors } from "@/lib/validation";

interface HostelSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: ValidationErrors;
}

export default function HostelSection({
  formData,
  onChange,
  errors = {},
}: HostelSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Get hostel data from reusable mock data
  const hostels = getHostels();

  return (
    <section className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-rose-50/50 dark:bg-rose-900/10 midnight:bg-rose-900/10 purple:bg-rose-900/10 hover:bg-rose-50 dark:hover:bg-rose-900/20 midnight:hover:bg-rose-900/20 purple:hover:bg-rose-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 midnight:bg-rose-900/30 purple:bg-rose-900/30 flex items-center justify-center">
            <Home className="w-4 h-4 text-rose-600 dark:text-rose-400 midnight:text-rose-400 purple:text-rose-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Hostel Information
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Boarding facility and room details
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
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 lg:space-y-10">
          {/* Hostel Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/20 midnight:bg-rose-900/20 purple:bg-rose-900/20 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4 text-rose-600 dark:text-rose-400 midnight:text-rose-400 purple:text-rose-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Hostel Details
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
              <FormDropdown
                label="Hostel Name"
                icon={<Building2 className="w-full h-full" />}
                iconBgColor="bg-rose-100 dark:bg-rose-900/30 midnight:bg-rose-900/30 purple:bg-rose-900/30"
                iconColor="text-rose-600 dark:text-rose-400 midnight:text-rose-400 purple:text-rose-400"
                value={formData.hostelName || ""}
                onChange={(value) => onChange("hostelName", value)}
                options={hostels}
                placeholder="Select Hostel"
              />
              <FormInput
                label="Room Number"
                icon={<Hash className="w-full h-full" />}
                iconBgColor="bg-rose-100 dark:bg-rose-900/30 midnight:bg-rose-900/30 purple:bg-rose-900/30"
                iconColor="text-rose-600 dark:text-rose-400 midnight:text-rose-400 purple:text-rose-400"
                value={formData.roomNumber || ""}
                onChange={(value) => onChange("roomNumber", value)}
                placeholder="e.g., 101, A-204"
                type="text"
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="pl-2">
            <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-900/20 midnight:bg-rose-900/20 purple:bg-rose-900/20 border border-rose-200 dark:border-rose-800/30 midnight:border-rose-800/30 purple:border-rose-800/30">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded bg-rose-100 dark:bg-rose-900/30 midnight:bg-rose-900/30 purple:bg-rose-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 midnight:text-rose-400 purple:text-rose-400" />
                </div>
                <p className="text-sm text-rose-700 dark:text-rose-300 midnight:text-rose-300 purple:text-rose-300">
                  <strong className="font-semibold">Note:</strong> Hostel
                  information is optional and only applicable for boarding
                  students. Leave blank for day students.
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
