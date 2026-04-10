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
    <div className="group bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-800/50 midnight:from-gray-800 midnight:to-gray-900/50 purple:from-gray-800 purple:to-gray-900/50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 pt-2 px-3 sm:px-4 pb-2 sm:pb-3 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      {/* Header */}
      <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">
        Address
      </h3>

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 mb-2"></div>

      {/* Address Entries */}
      <div className="space-y-2">
        {/* Current Address */}
        <div className="flex items-start gap-2 p-2 rounded-xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-800/20 midnight:from-gray-900/40 midnight:to-gray-900/20 purple:from-gray-900/40 purple:to-gray-900/20 border border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/10 purple:border-pink-500/10 hover:from-blue-50 hover:to-blue-100/60 dark:hover:from-blue-900/30 dark:hover:to-blue-900/20 midnight:hover:from-cyan-900/30 midnight:hover:to-cyan-900/20 purple:hover:from-pink-900/30 purple:hover:to-pink-900/20 hover:border-blue-300/50 dark:hover:border-blue-600/50 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30 shadow-sm hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300 group/current">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-900/20 midnight:from-blue-900/40 midnight:to-blue-900/20 purple:from-blue-900/40 purple:to-blue-900/20 flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 group-hover/current:scale-110 group-hover/current:from-blue-200 group-hover/current:to-blue-300">
            <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400 transition-transform duration-300 group-hover/current:scale-110" />
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
        <div className="flex items-start gap-2 p-2 rounded-xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-800/20 midnight:from-gray-900/40 midnight:to-gray-900/20 purple:from-gray-900/40 purple:to-gray-900/20 border border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/10 purple:border-pink-500/10 hover:from-purple-50 hover:to-purple-100/60 dark:hover:from-purple-900/30 dark:hover:to-purple-900/20 midnight:hover:from-purple-900/30 midnight:hover:to-purple-900/20 purple:hover:from-pink-900/30 purple:hover:to-pink-900/20 hover:border-purple-300/50 dark:hover:border-purple-600/50 midnight:hover:border-purple-500/30 purple:hover:border-pink-500/30 shadow-sm hover:shadow-md hover:shadow-purple-500/10 transition-all duration-300 group/permanent">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-900/20 midnight:from-purple-900/40 midnight:to-purple-900/20 purple:from-purple-900/40 purple:to-purple-900/20 flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 group-hover/permanent:scale-110 group-hover/permanent:from-purple-200 group-hover/permanent:to-purple-300">
            <ExternalLink className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400 transition-transform duration-300 group-hover/permanent:scale-110" />
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

