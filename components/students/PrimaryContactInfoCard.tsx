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
    <div className="group bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-800/50 midnight:from-gray-800 midnight:to-gray-900/50 purple:from-gray-800 purple:to-gray-900/50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 p-2.5 sm:p-4 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      {/* Header */}
      <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2 sm:mb-3 uppercase tracking-wider">
        Primary Contact Info
      </h3>

      {/* Contact Information */}
      <div className="space-y-1.5 sm:space-y-2">
        {phoneNumber && (
          <a
            href={`tel:${cleanPhoneNumber}`}
            className="flex items-center gap-2 sm:gap-2.5 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/20 midnight:from-blue-900/20 midnight:to-cyan-900/20 purple:from-blue-900/20 purple:to-purple-900/20 hover:from-blue-100 hover:to-indigo-100/40 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200 cursor-pointer group border border-blue-100/50 dark:border-blue-800/30 midnight:border-blue-800/30 purple:border-blue-800/30 hover:border-blue-200/70 dark:hover:border-blue-700/50"
          >
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-blue-100 dark:bg-blue-900/40 midnight:bg-blue-900/40 purple:bg-blue-900/40 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 group-hover:scale-110 transition-all duration-200 shadow-sm">
              <Phone className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-0.5 uppercase tracking-wide">
                Phone Number
              </div>
              <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 midnight:group-hover:text-cyan-400 purple:group-hover:text-pink-400 transition-colors">
                {phoneNumber}
              </div>
            </div>
          </a>
        )}

        {email && (
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 sm:gap-2.5 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-50 to-violet-50/30 dark:from-purple-900/20 dark:to-violet-900/20 midnight:from-purple-900/20 midnight:to-pink-900/20 purple:from-purple-900/20 purple:to-pink-900/20 hover:from-purple-100 hover:to-violet-100/40 dark:hover:from-purple-900/30 dark:hover:to-violet-900/30 transition-all duration-200 cursor-pointer group border border-purple-100/50 dark:border-purple-800/30 midnight:border-purple-800/30 purple:border-purple-800/30 hover:border-purple-200/70 dark:hover:border-purple-700/50"
          >
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-purple-100 dark:bg-purple-900/40 midnight:bg-purple-900/40 purple:bg-purple-900/40 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 group-hover:scale-110 transition-all duration-200 shadow-sm">
              <Mail className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-0.5 uppercase tracking-wide">
                Email Address
              </div>
              <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 midnight:group-hover:text-purple-400 purple:group-hover:text-pink-400 transition-colors">
                {email}
              </div>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}

