"use client";

import { useState } from "react";
import {
  Settings,
  ChevronUp,
  ChevronDown,
  Users,
  Bus,
  Home,
  DollarSign,
  Shield,
} from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";

interface FeaturesSettingsSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: any;
}

export default function FeaturesSettingsSection({
  formData,
  onChange,
  errors = {},
}: FeaturesSettingsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const isTertiary = formData.educationLevel === "Tertiary";
  const isNursery = formData.educationLevel === "Nursery" || formData.educationLevel === "Kindergarten";
  const isPrimary = formData.educationLevel === "Primary";
  const isSecondary = formData.educationLevel === "Secondary" || formData.educationLevel === "Junior Secondary";

  // Feature availability based on education level
  const availableFeatures = {
    lms: !isNursery, // Basic LMS for Nursery
    digitalDiary: true, // All levels
    transport: true, // All levels (optional for nursery)
    hostel: isTertiary || isSecondary, // Only secondary and tertiary
    rfid: !isNursery, // Not for nursery
    onlineClasses: isTertiary || isSecondary, // Secondary and above
    library: !isNursery, // Primary and above
    gradebook: !isNursery, // Not for nursery (activity-based)
  };

  // Mock data - should come from API
  const transportZones = [
    { value: "Zone A", label: "Zone A - City Center" },
    { value: "Zone B", label: "Zone B - Suburbs" },
    { value: "Zone C", label: "Zone C - Rural Areas" },
  ];

  const behaviorPolicies = [
    { value: "Standard", label: "Standard Policy" },
    { value: "Strict", label: "Strict Policy" },
    { value: "Lenient", label: "Lenient Policy" },
  ];

  const feeTemplates = [
    { value: "Template A", label: "Template A - Basic Package" },
    { value: "Template B", label: "Template B - Standard Package" },
    { value: "Template C", label: "Template C - Premium Package" },
  ];

  const branches = [
    { value: "Main Campus", label: "Main Campus" },
    { value: "Branch 1", label: "Branch 1 - Ikeja" },
    { value: "Branch 2", label: "Branch 2 - Lekki" },
  ];

  const handleFeatureToggle = (feature: string) => {
    const currentFeatures = formData.enabledFeatures || {};
    onChange("enabledFeatures", {
      ...currentFeatures,
      [feature]: !currentFeatures[feature],
    });
  };

  return (
    <section className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-pink-50/50 dark:bg-pink-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 hover:bg-pink-50 dark:hover:bg-pink-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            <Settings className="w-4 h-4 text-pink-600 dark:text-pink-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <span className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            Features & Settings
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Branch & Basic Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormDropdown
              label="Branch"
              value={formData.branch}
              onChange={(value) => onChange("branch", value)}
              options={branches}
              icon={<Home className="w-2.5 h-2.5" />}
              placeholder="Select branch"
              required
              error={errors.branch}
            />

            <FormInput
              label="Maximum Students"
              value={formData.maxStudents}
              onChange={(value) => onChange("maxStudents", value)}
              icon={<Users className="w-2.5 h-2.5" />}
              placeholder="e.g., 50"
              type="number"
              required
              error={errors.maxStudents}
            />
          </div>

          {/* Feature Flags */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Enabled Features
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: "lms", label: "Learning Management System (LMS)" },
                { key: "digitalDiary", label: "Digital Diary" },
                { key: "transport", label: "Transport Management" },
                { key: "hostel", label: "Hostel Management" },
                { key: "rfid", label: "RFID Attendance" },
                { key: "onlineClasses", label: "Online Classes" },
                { key: "library", label: "Library Access" },
                { key: "gradebook", label: "Digital Gradebook" },
              ]
                .filter((feature) => availableFeatures[feature.key as keyof typeof availableFeatures])
                .map((feature) => (
                <label
                  key={feature.key}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#22262e]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/10 purple:border-pink-500/10 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#22262e] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.enabledFeatures?.[feature.key] || false}
                    onChange={() => handleFeatureToggle(feature.key)}
                    className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-[#22262e] dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {feature.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Transport Settings (if enabled) */}
          {formData.enabledFeatures?.transport && (
            <div className="grid grid-cols-1 gap-6">
              <FormDropdown
                label="Transport Zone"
                value={formData.transportZone}
                onChange={(value) => onChange("transportZone", value)}
                options={transportZones}
                icon={<Bus className="w-2.5 h-2.5" />}
                placeholder="Select transport zone"
                error={errors.transportZone}
              />
            </div>
          )}

          {/* Hostel Settings (if enabled) */}
          {formData.enabledFeatures?.hostel && (
            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 rounded-lg border border-blue-200 dark:border-blue-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <input
                type="checkbox"
                checked={formData.hostelEligibility || false}
                onChange={(e) => onChange("hostelEligibility", e.target.checked)}
                className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-[#22262e] dark:border-gray-600"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">
                {isTertiary
                  ? "Students in this class are eligible for hostel accommodation"
                  : "Students in this class are eligible for boarding"}
              </label>
            </div>
          )}

          {/* Behavior & Fee Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormDropdown
              label="Behavior Policy"
              value={formData.behaviorPolicy}
              onChange={(value) => onChange("behaviorPolicy", value)}
              options={behaviorPolicies}
              icon={<Shield className="w-2.5 h-2.5" />}
              placeholder="Select behavior policy"
              error={errors.behaviorPolicy}
            />

            <FormDropdown
              label="Fee Template"
              value={formData.feeTemplate}
              onChange={(value) => onChange("feeTemplate", value)}
              options={feeTemplates}
              icon={<DollarSign className="w-2.5 h-2.5" />}
              placeholder="Select fee template"
              error={errors.feeTemplate}
            />
          </div>
        </div>
      )}
    </section>
  );
}
