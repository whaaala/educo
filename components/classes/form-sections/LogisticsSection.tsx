"use client";

import { useState } from "react";
import {
  MapPin,
  ChevronUp,
  ChevronDown,
  Users,
} from "lucide-react";
import FormInput from "@/components/shared/FormInput";

interface LogisticsSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: any;
}

export default function LogisticsSection({
  formData,
  onChange,
  errors = {},
}: LogisticsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const isTertiary = formData.educationLevel === "Tertiary";

  return (
    <section className="bg-surface rounded-xl border border-line shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-orange-50/50 dark:bg-orange-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 hover:bg-orange-50 dark:hover:bg-orange-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-line cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <span className="text-base font-semibold text-ink">
            Logistics & Capacity
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label={isTertiary ? "Hall/Lab" : "Room"}
              value={formData.room}
              onChange={(value) => onChange("room", value)}
              icon={<MapPin className="w-2.5 h-2.5" />}
              placeholder={isTertiary ? "e.g., LT 101, Lab 3" : "e.g., Room 101"}
              required
              error={errors.room}
            />

            <FormInput
              label={isTertiary ? "Expected Enrollment" : "Capacity"}
              value={formData.capacity}
              onChange={(value) => onChange("capacity", value)}
              icon={<Users className="w-2.5 h-2.5" />}
              placeholder="e.g., 50"
              type="number"
              required
              error={errors.capacity}
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <FormInput
              label="Schedule (Optional)"
              value={formData.schedule}
              onChange={(value) => onChange("schedule", value)}
              icon={<MapPin className="w-2.5 h-2.5" />}
              placeholder="e.g., Mon-Fri, 8:00 AM - 2:00 PM"
              error={errors.schedule}
            />
          </div>
        </div>
      )}
    </section>
  );
}
