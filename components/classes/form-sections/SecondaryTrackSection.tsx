"use client";

import { useState } from "react";
import {
  Award,
  ChevronUp,
  ChevronDown,
  Tag,
} from "lucide-react";
import FormDropdown from "@/components/shared/FormDropdown";
import FormInput from "@/components/shared/FormInput";

interface SecondaryTrackSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: any;
}

export default function SecondaryTrackSection({
  formData,
  onChange,
  errors = {},
}: SecondaryTrackSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Only show this section if education level is Secondary (SSS)
  if (formData.educationLevel !== "Secondary") {
    return null;
  }

  const academicTracks = [
    { value: "Science", label: "Science" },
    { value: "Arts", label: "Arts" },
    { value: "Commercial", label: "Commercial" },
    { value: "Technical", label: "Technical" },
  ];

  return (
    <section className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-purple-50/50 dark:bg-purple-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 hover:bg-purple-50 dark:hover:bg-purple-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            <Award className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <span className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            Academic Track
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
            <FormDropdown
              label="Track"
              value={formData.academicTrack}
              onChange={(value) => onChange("academicTrack", value)}
              options={academicTracks}
              icon={<Award className="w-2.5 h-2.5" />}
              placeholder="Select track"
              required
              error={errors.academicTrack}
            />

            <FormInput
              label="Stream (Optional)"
              value={formData.streamName}
              onChange={(value) => onChange("streamName", value)}
              icon={<Tag className="w-2.5 h-2.5" />}
              placeholder="e.g., Science A, Science B"
              error={errors.streamName}
            />
          </div>
        </div>
      )}
    </section>
  );
}
