"use client";

import { useState } from "react";
import { Phone, Mail, MessageCircle, ChevronUp } from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import { ValidationErrors } from "@/lib/validation";

interface ContactInformationSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: ValidationErrors;
}

export default function ContactInformationSection({
  formData,
  onChange,
  errors = {},
}: ContactInformationSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const contactMethods = [
    { value: "Phone", label: "Phone Call" },
    { value: "SMS", label: "SMS/Text Message" },
    { value: "Email", label: "Email" },
    { value: "WhatsApp", label: "WhatsApp" },
  ];

  return (
    <section className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-green-50/50 dark:bg-green-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 hover:bg-green-50 dark:hover:bg-green-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            <Phone className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Contact Information
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Phone numbers and email details
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
        <div className={isExpanded ? "overflow-visible" : "overflow-hidden"}>
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Phone Numbers Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Phone Numbers
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormInput
                  label="Primary Phone"
                  icon={<Phone className="w-full h-full" />}
                  value={formData.primaryPhone || ""}
                  onChange={(value) => onChange("primaryPhone", value)}
                  placeholder="+234xxxxxxxxxx"
                  type="tel"
                  required
                  error={errors.primaryPhone}
                />
                <FormInput
                  label="Secondary Phone"
                  icon={<Phone className="w-full h-full" />}
                  value={formData.secondaryPhone || ""}
                  onChange={(value) => onChange("secondaryPhone", value)}
                  placeholder="+234xxxxxxxxxx"
                  type="tel"
                  error={errors.secondaryPhone}
                />
              </div>
            </div>

            {/* Email Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Email Address
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormInput
                  label="Email Address"
                  icon={<Mail className="w-full h-full" />}
                  value={formData.email || ""}
                  onChange={(value) => onChange("email", value)}
                  placeholder="parent@example.com"
                  type="email"
                  required
                  error={errors.email}
                />
              </div>
            </div>

            {/* Communication Preferences Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Communication Preferences
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormDropdown
                  label="Preferred Contact Method"
                  icon={<MessageCircle className="w-full h-full" />}
                  value={formData.preferredContactMethod || "Phone"}
                  onChange={(value) => onChange("preferredContactMethod", value)}
                  options={contactMethods}
                  placeholder="Select contact method"
                  error={errors.preferredContactMethod}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
