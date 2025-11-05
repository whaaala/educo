"use client";

import { MapPin, ExternalLink } from "lucide-react";

interface AddressCardProps {
  currentAddress: string;
  permanentAddress: string;
}

export default function AddressCard({
  currentAddress,
  permanentAddress,
}: AddressCardProps) {
  return (
    <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-sm border border-gray-200/40 dark:border-gray-800/40 midnight:border-cyan-500/20 purple:border-pink-500/20 pt-2 px-3 sm:px-4 pb-2 sm:pb-3 transition-all duration-200 hover:shadow-md hover:border-gray-300/60 dark:hover:border-gray-700/60 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30">
      {/* Header */}
      <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">
        Address
      </h3>

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-gray-800/50 midnight:bg-gray-800/30 purple:bg-gray-800/30 mb-2"></div>

      {/* Address Entries */}
      <div className="space-y-2">
        {/* Current Address */}
        <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-50/50 dark:bg-gray-800/30 midnight:bg-gray-900/30 purple:bg-gray-900/30 hover:bg-gray-100/70 dark:hover:bg-gray-800/50 transition-colors duration-200">
          <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-0.5">
              Current Address
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 leading-snug">
              {currentAddress || "-"}
            </p>
          </div>
        </div>

        {/* Permanent Address */}
        <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-50/50 dark:bg-gray-800/30 midnight:bg-gray-900/30 purple:bg-gray-900/30 hover:bg-gray-100/70 dark:hover:bg-gray-800/50 transition-colors duration-200">
          <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
            <ExternalLink className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-0.5">
              Permanent Address
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 leading-snug">
              {permanentAddress || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

