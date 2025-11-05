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
    <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-sm border border-gray-200/40 dark:border-gray-800/40 midnight:border-cyan-500/20 purple:border-pink-500/20 p-3 transition-all duration-200 hover:shadow-md hover:border-gray-300/60 dark:hover:border-gray-700/60 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30">
      {/* Tabs */}
      <div className="flex gap-1 mb-2 pb-1.5 border-b border-gray-100 dark:border-gray-800/50 midnight:border-gray-800/30 purple:border-gray-800/30">
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
          <div className="space-y-2">
            {(hostelName || roomNumber) ? (
              <>
                {hostelName && (
                  <div className="flex items-center gap-2 py-1 px-2 rounded-lg bg-gray-50/50 dark:bg-gray-800/30 midnight:bg-gray-900/30 purple:bg-gray-900/30">
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
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
                  <div className="flex items-center gap-2 py-1 px-2 rounded-lg bg-gray-50/50 dark:bg-gray-800/30 midnight:bg-gray-900/30 purple:bg-gray-900/30">
                    <div className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-900/30 midnight:bg-orange-900/30 purple:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
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
          <div className="space-y-2">
            {(transportRoute || vehicleNumber) ? (
              <>
                {transportRoute && (
                  <div className="flex items-center gap-2 py-1 px-2 rounded-lg bg-gray-50/50 dark:bg-gray-800/30 midnight:bg-gray-900/30 purple:bg-gray-900/30">
                    <div className="w-6 h-6 rounded-lg bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30 flex items-center justify-center flex-shrink-0">
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
                  <div className="flex items-center gap-2 py-1 px-2 rounded-lg bg-gray-50/50 dark:bg-gray-800/30 midnight:bg-gray-900/30 purple:bg-gray-900/30">
                    <div className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-900/30 midnight:bg-teal-900/30 purple:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
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

