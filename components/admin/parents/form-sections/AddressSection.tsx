"use client";

import { useState } from "react";
import { MapPin, Building, ChevronUp, Globe } from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import { ValidationErrors } from "@/lib/validation";

interface AddressSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: ValidationErrors;
}

// Nigerian states
const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
].map(state => ({ value: state, label: state }));

export default function AddressSection({
  formData,
  onChange,
  errors = {},
}: AddressSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const countries = [
    { value: "Nigeria", label: "Nigeria" },
    { value: "Ghana", label: "Ghana" },
    { value: "Kenya", label: "Kenya" },
    { value: "South Africa", label: "South Africa" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "United States", label: "United States" },
    { value: "Canada", label: "Canada" },
    { value: "Other", label: "Other" },
  ];

  return (
    <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-orange-50/50 dark:bg-orange-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 hover:bg-orange-50 dark:hover:bg-orange-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Address Information
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Residential address details
            </p>
          </div>
        </div>
        <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
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
            {/* Street Address Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <Building className="w-4 h-4 text-orange-600 dark:text-orange-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Street Address
                </h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormInput
                  label="Address Line 1"
                  icon={<MapPin className="w-full h-full" />}
                  value={formData.addressLine1 || ""}
                  onChange={(value) => onChange("addressLine1", value)}
                  placeholder="House/Flat No., Street Name"
                  type="text"
                  required
                  error={errors.addressLine1}
                />
                <FormInput
                  label="Address Line 2"
                  icon={<MapPin className="w-full h-full" />}
                  value={formData.addressLine2 || ""}
                  onChange={(value) => onChange("addressLine2", value)}
                  placeholder="Landmark, Area (optional)"
                  type="text"
                  error={errors.addressLine2}
                />
              </div>
            </div>

            {/* City, State, Postal Code Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  City & Region
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormInput
                  label="City"
                  icon={<Building className="w-full h-full" />}
                  value={formData.city || ""}
                  onChange={(value) => onChange("city", value)}
                  placeholder="Enter city"
                  type="text"
                  required
                  error={errors.city}
                />
                <FormDropdown
                  label="State / Region"
                  icon={<MapPin className="w-full h-full" />}
                  value={formData.state || ""}
                  onChange={(value) => onChange("state", value)}
                  options={NIGERIAN_STATES}
                  placeholder="Select state"
                  required
                  error={errors.state}
                />
                <FormInput
                  label="Postal Code"
                  icon={<MapPin className="w-full h-full" />}
                  value={formData.postalCode || ""}
                  onChange={(value) => onChange("postalCode", value)}
                  placeholder="Enter postal code"
                  type="text"
                  error={errors.postalCode}
                />
                <FormDropdown
                  label="Country"
                  icon={<Globe className="w-full h-full" />}
                  value={formData.country || "Nigeria"}
                  onChange={(value) => onChange("country", value)}
                  options={countries}
                  placeholder="Select country"
                  error={errors.country}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
