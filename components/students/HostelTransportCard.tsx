"use client";

import { useState } from "react";
import { Building2, Bus } from "lucide-react";

interface HostelTransportCardProps {
  useHostel?: boolean;
  useTransport?: boolean;
  hostelName?: string;
  roomNumber?: string;
  transportRoute?: string;
  vehicleNumber?: string;
}

export default function HostelTransportCard({
  useHostel,
  useTransport,
  hostelName,
  roomNumber,
  transportRoute,
  vehicleNumber,
}: HostelTransportCardProps) {
  // Determine initial tab based on available data
  const getInitialTab = (): "hostel" | "transport" => {
    if (useHostel) return "hostel";
    if (useTransport) return "transport";
    return "hostel"; // fallback
  };

  const [activeTab, setActiveTab] = useState<"hostel" | "transport">(getInitialTab());

  // Don't render if neither hostel nor transport is used
  if (!useHostel && !useTransport) {
    return null;
  }

  return (
    <div className="group bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-800/50 midnight:from-gray-800 midnight:to-gray-900/50 purple:from-gray-800 purple:to-gray-900/50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      {/* Tabs */}
      <div className="flex gap-1 mb-1.5 sm:mb-2 pb-1 sm:pb-1.5 border-b border-gray-100 dark:border-gray-800/50 midnight:border-gray-800/30 purple:border-gray-800/30">
        <button
          onClick={() => setActiveTab("hostel")}
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 ${
            activeTab === "hostel"
              ? "bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 hover:text-gray-900 dark:hover:text-gray-300 midnight:hover:text-cyan-200 purple:hover:text-pink-200 hover:bg-gray-100 dark:hover:bg-gray-800/50"
          } cursor-pointer`}
        >
          Hostel
        </button>
        <button
          onClick={() => setActiveTab("transport")}
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 ${
            activeTab === "transport"
              ? "bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 hover:text-gray-900 dark:hover:text-gray-300 midnight:hover:text-cyan-200 purple:hover:text-pink-200 hover:bg-gray-100 dark:hover:bg-gray-800/50"
          } cursor-pointer`}
        >
          Transportation
        </button>
      </div>

      {/* Content */}
      <div className="pt-0.5">
        {activeTab === "hostel" && (
          <div className="space-y-1.5 sm:space-y-2">
            {(hostelName || roomNumber) ? (
              <>
                {hostelName && (
                  <div className="flex items-center gap-2 py-1 px-2 rounded-xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-800/20 midnight:from-gray-900/40 midnight:to-gray-900/20 purple:from-gray-900/40 purple:to-gray-900/20 border border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-900/20 midnight:from-indigo-900/40 midnight:to-indigo-900/20 purple:from-indigo-900/40 purple:to-indigo-900/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Building2 className="w-3 h-3 text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80 mb-0.5">
                        Hostel
                      </div>
                      <div className="text-xs font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
                        {hostelName}
                      </div>
                    </div>
                  </div>
                )}
                {roomNumber && (
                  <div className="flex items-center gap-2 py-1 px-2 rounded-xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-800/20 midnight:from-gray-900/40 midnight:to-gray-900/20 purple:from-gray-900/40 purple:to-gray-900/20 border border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-900/20 midnight:from-orange-900/40 midnight:to-orange-900/20 purple:from-orange-900/40 purple:to-orange-900/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Building2 className="w-3 h-3 text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80 mb-0.5">
                        Room Number
                      </div>
                      <div className="text-xs font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
                        {roomNumber}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 py-1.5">
                No hostel information available
              </div>
            )}
          </div>
        )}

        {activeTab === "transport" && (
          <div className="space-y-1.5 sm:space-y-2">
            {(transportRoute || vehicleNumber) ? (
              <>
                {transportRoute && (
                  <div className="flex items-center gap-2 py-1 px-2 rounded-xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-800/20 midnight:from-gray-900/40 midnight:to-gray-900/20 purple:from-gray-900/40 purple:to-gray-900/20 border border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-900/20 midnight:from-green-900/40 midnight:to-green-900/20 purple:from-green-900/40 purple:to-green-900/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bus className="w-3 h-3 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80 mb-0.5">
                        Route
                      </div>
                      <div className="text-xs font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
                        {transportRoute}
                      </div>
                    </div>
                  </div>
                )}
                {vehicleNumber && (
                  <div className="flex items-center gap-2 py-1 px-2 rounded-xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-800/20 midnight:from-gray-900/40 midnight:to-gray-900/20 purple:from-gray-900/40 purple:to-gray-900/20 border border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/40 dark:to-teal-900/20 midnight:from-teal-900/40 midnight:to-teal-900/20 purple:from-teal-900/40 purple:to-teal-900/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bus className="w-3 h-3 text-teal-600 dark:text-teal-400 midnight:text-teal-400 purple:text-teal-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80 mb-0.5">
                        Vehicle Number
                      </div>
                      <div className="text-xs font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
                        {vehicleNumber}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 py-1.5">
                No transportation information available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

