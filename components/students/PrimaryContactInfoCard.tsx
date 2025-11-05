"use client";

import { Phone, Mail } from "lucide-react";

interface PrimaryContactInfoCardProps {
  phoneNumber?: string;
  email?: string;
}

export default function PrimaryContactInfoCard({
  phoneNumber,
  email,
}: PrimaryContactInfoCardProps) {
  // Clean phone number for tel: link (remove spaces and special chars)
  const cleanPhoneNumber = phoneNumber?.replace(/\s+/g, "").replace(/[^\d+]/g, "") || "";

  return (
    <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-sm border border-gray-200/40 dark:border-gray-800/40 midnight:border-cyan-500/20 purple:border-pink-500/20 p-4 transition-all duration-200 hover:shadow-md hover:border-gray-300/60 dark:hover:border-gray-700/60 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30">
      {/* Header */}
      <h3 className="text-xs font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2.5 uppercase tracking-wide">
        Primary Contact Info
      </h3>

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-gray-800/50 midnight:bg-gray-800/30 purple:bg-gray-800/30 mb-2.5"></div>

      {/* Contact Information */}
      <div className="space-y-2">
        {phoneNumber && (
          <a
            href={`tel:${cleanPhoneNumber}`}
            className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg bg-gray-50/50 dark:bg-gray-800/30 midnight:bg-gray-900/30 purple:bg-gray-900/30 hover:bg-gray-100/70 dark:hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors">
              <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80 mb-0.5">
                Phone Number
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 midnight:group-hover:text-cyan-400 purple:group-hover:text-pink-400 transition-colors">
                {phoneNumber}
              </div>
            </div>
          </a>
        )}

        {email && (
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg bg-gray-50/50 dark:bg-gray-800/30 midnight:bg-gray-900/30 purple:bg-gray-900/30 hover:bg-gray-100/70 dark:hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors">
              <Mail className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80 mb-0.5">
                Email Address
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 midnight:group-hover:text-purple-400 purple:group-hover:text-pink-400 transition-colors">
                {email}
              </div>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}

