"use client";

import { useState } from "react";
import {
  MapPin,
  Hash,
  Globe,
  Phone,
  ChevronUp
} from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import { getAvailableCountries } from "@/config/countries";
import type { FormSectionProps } from "@/components/shared/form-section-types";
import type { StudentFormData } from "./types";
/** The seven address fields that copy across when "same as current" is ticked, and their counterparts. */
type CurrentAddressField =
  | "currentAddressLine1" | "currentAddressLine2" | "currentCity" | "currentState"
  | "currentPostalCode" | "currentCountry" | "currentAddressPhone";
type PermanentAddressField =
  | "permanentAddressLine1" | "permanentAddressLine2" | "permanentCity" | "permanentState"
  | "permanentPostalCode" | "permanentCountry" | "permanentAddressPhone";

type AddressSectionProps = FormSectionProps<StudentFormData>;

export default function AddressSection({
  formData,
  onChange,
  errors: _errors = {},
}: AddressSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const countries = getAvailableCountries();

  const handleSameAsCurrentChange = (checked: boolean) => {
    onChange("sameAsCurrentAddress", checked);
    if (checked) {
      // Copy all current address fields to permanent address fields
      onChange("permanentAddressLine1", formData.currentAddressLine1 || "");
      onChange("permanentAddressLine2", formData.currentAddressLine2 || "");
      onChange("permanentCity", formData.currentCity || "");
      onChange("permanentState", formData.currentState || "");
      onChange("permanentPostalCode", formData.currentPostalCode || "");
      onChange("permanentCountry", formData.currentCountry || "Nigeria");
      onChange("permanentAddressPhone", formData.currentAddressPhone || "");
    }
  };

  // Update permanent address when current address changes if checkbox is checked.
  // The map is typed both ways round, so a field renamed on one side of it stops compiling rather than
  // quietly copying nothing.
  const PERMANENT_FIELD: Record<CurrentAddressField, PermanentAddressField> = {
    currentAddressLine1: "permanentAddressLine1",
    currentAddressLine2: "permanentAddressLine2",
    currentCity: "permanentCity",
    currentState: "permanentState",
    currentPostalCode: "permanentPostalCode",
    currentCountry: "permanentCountry",
    currentAddressPhone: "permanentAddressPhone",
  };

  const handleCurrentAddressChange = (field: CurrentAddressField, value: string) => {
    onChange(field, value);
    if (formData.sameAsCurrentAddress) {
      onChange(PERMANENT_FIELD[field], value);
    }
  };

  return (
    <section className="bg-surface rounded-xl border border-line shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-orange-50/50 dark:bg-orange-900/10 midnight:bg-amber-900/10 purple:bg-amber-900/10 hover:bg-orange-50 dark:hover:bg-orange-900/20 midnight:hover:bg-amber-900/20 purple:hover:bg-amber-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-line"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400 midnight:text-amber-400 purple:text-amber-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-ink">
              Address
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Current and permanent address details
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
          {/* Current Address Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-900/20 midnight:bg-amber-900/20 purple:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400 midnight:text-amber-400 purple:text-amber-400" />
              </div>
              <h3 className="text-sm font-semibold text-ink">
                Current Address <span className="text-red-500">*</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
              <FormInput
                label="Primary Address Line 1"
                icon={<MapPin className="w-full h-full" />}
                value={formData.currentAddressLine1 || ""}
                onChange={(value) => handleCurrentAddressChange("currentAddressLine1", value)}
                placeholder="Street address and house number"
                type="text"
              />
              <FormInput
                label="Primary Address Line 2"
                icon={<MapPin className="w-full h-full" />}
                value={formData.currentAddressLine2 || ""}
                onChange={(value) => handleCurrentAddressChange("currentAddressLine2", value)}
                placeholder="Apartment, suite, unit, or P.O. Box"
                type="text"
              />
              <FormInput
                label="City/Town"
                icon={<MapPin className="w-full h-full" />}
                value={formData.currentCity || ""}
                onChange={(value) => handleCurrentAddressChange("currentCity", value)}
                placeholder="Enter city or town"
                type="text"
              />
              <FormInput
                label="State"
                icon={<MapPin className="w-full h-full" />}
                value={formData.currentState || ""}
                onChange={(value) => handleCurrentAddressChange("currentState", value)}
                placeholder="State or FCT"
                type="text"
              />
              <FormInput
                label="Postal Code"
                icon={<Hash className="w-full h-full" />}
                value={formData.currentPostalCode || ""}
                onChange={(value) => handleCurrentAddressChange("currentPostalCode", value)}
                placeholder="6-digit postal code"
                type="text"
              />
              <FormDropdown
                label="Country"
                icon={<Globe className="w-full h-full" />}
                value={formData.currentCountry || "NG"}
                onChange={(value) => handleCurrentAddressChange("currentCountry", value)}
                options={countries}
                placeholder="Select country"
              />
              <FormInput
                label="Address Phone Number"
                icon={<Phone className="w-full h-full" />}
                value={formData.currentAddressPhone || ""}
                onChange={(value) => handleCurrentAddressChange("currentAddressPhone", value)}
                placeholder="+234xxxxxxxxxx (for courier)"
                type="text"
              />
            </div>
          </div>

          {/* Same as Current Address Checkbox */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30">
            <input
              type="checkbox"
              id="sameAsCurrentAddress"
              checked={formData.sameAsCurrentAddress || false}
              onChange={(e) => handleSameAsCurrentChange(e.target.checked)}
              className="w-5 h-5 text-emerald-600 dark:text-emerald-500 midnight:text-emerald-400 purple:text-emerald-400 rounded border-gray-300 dark:border-gray-600 focus:ring-emerald-500 dark:focus:ring-emerald-400 midnight:focus:ring-emerald-400 purple:focus:ring-emerald-400 focus:ring-2 cursor-pointer"
            />
            <label
              htmlFor="sameAsCurrentAddress"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 cursor-pointer"
            >
              Same as Current Address
            </label>
          </div>

          {/* Permanent Address Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-900/20 midnight:bg-amber-900/20 purple:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400 midnight:text-amber-400 purple:text-amber-400" />
              </div>
              <h3 className="text-sm font-semibold text-ink">
                Permanent Address <span className="text-red-500">*</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
              <FormInput
                label="Primary Address Line 1"
                icon={<MapPin className="w-full h-full" />}
                value={formData.permanentAddressLine1 || ""}
                onChange={(value) => onChange("permanentAddressLine1", value)}
                placeholder="Street address and house number"
                type="text"
                disabled={formData.sameAsCurrentAddress}
              />
              <FormInput
                label="Primary Address Line 2"
                icon={<MapPin className="w-full h-full" />}
                value={formData.permanentAddressLine2 || ""}
                onChange={(value) => onChange("permanentAddressLine2", value)}
                placeholder="Apartment, suite, unit, or P.O. Box"
                type="text"
                disabled={formData.sameAsCurrentAddress}
              />
              <FormInput
                label="City/Town"
                icon={<MapPin className="w-full h-full" />}
                value={formData.permanentCity || ""}
                onChange={(value) => onChange("permanentCity", value)}
                placeholder="Enter city or town"
                type="text"
                disabled={formData.sameAsCurrentAddress}
              />
              <FormInput
                label="State"
                icon={<MapPin className="w-full h-full" />}
                value={formData.permanentState || ""}
                onChange={(value) => onChange("permanentState", value)}
                placeholder="State or FCT"
                type="text"
                disabled={formData.sameAsCurrentAddress}
              />
              <FormInput
                label="Postal Code"
                icon={<Hash className="w-full h-full" />}
                value={formData.permanentPostalCode || ""}
                onChange={(value) => onChange("permanentPostalCode", value)}
                placeholder="6-digit postal code"
                type="text"
                disabled={formData.sameAsCurrentAddress}
              />
              <FormDropdown
                label="Country"
                icon={<Globe className="w-full h-full" />}
                value={formData.permanentCountry || "NG"}
                onChange={(value) => onChange("permanentCountry", value)}
                options={countries}
                placeholder="Select country"
                disabled={formData.sameAsCurrentAddress}
              />
              <FormInput
                label="Address Phone Number"
                icon={<Phone className="w-full h-full" />}
                value={formData.permanentAddressPhone || ""}
                onChange={(value) => onChange("permanentAddressPhone", value)}
                placeholder="+234xxxxxxxxxx (for courier)"
                type="text"
                disabled={formData.sameAsCurrentAddress}
              />
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
