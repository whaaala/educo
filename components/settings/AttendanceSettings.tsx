"use client";

import { useState, useEffect } from "react";
import { UserCheck, Calendar, Info } from "lucide-react";

export type AttendanceMode = "by-class" | "by-day";

interface AttendanceSettingsProps {
  onModeChange?: (mode: AttendanceMode) => void;
}

export default function AttendanceSettings({ onModeChange }: AttendanceSettingsProps) {
  const [attendanceMode, setAttendanceMode] = useState<AttendanceMode>("by-day");

  // Load saved setting from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem("attendanceMode") as AttendanceMode | null;
    if (savedMode && (savedMode === "by-class" || savedMode === "by-day")) {
      setAttendanceMode(savedMode);
    }
  }, []);

  const handleModeChange = (mode: AttendanceMode) => {
    setAttendanceMode(mode);
    localStorage.setItem("attendanceMode", mode);
    onModeChange?.(mode);
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 midnight:bg-blue-900/20 purple:bg-blue-900/20 border border-blue-200 dark:border-blue-700 midnight:border-blue-700 purple:border-blue-700 rounded-lg">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 midnight:text-blue-300 purple:text-blue-300">
            Attendance Tracking Mode
          </p>
          <p className="text-xs text-blue-800 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400 mt-1">
            Choose how attendance is tracked and displayed throughout the system. This setting affects all attendance-related features.
          </p>
        </div>
      </div>

      {/* Attendance Mode Options */}
      <div className="space-y-4">
        {/* By School Day Option */}
        <div
          onClick={() => handleModeChange("by-day")}
          className={`
            relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
            ${
              attendanceMode === "by-day"
                ? "border-blue-500 dark:border-blue-400 midnight:border-cyan-400 purple:border-pink-400 bg-blue-50/50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20"
                : "border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30"
            }
          `}
        >
          {/* Selection Indicator */}
          {attendanceMode === "by-day" && (
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-400 midnight:bg-cyan-400 purple:bg-pink-400 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}

          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`
              w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
              ${
                attendanceMode === "by-day"
                  ? "bg-blue-100 dark:bg-blue-900/40 midnight:bg-cyan-900/40 purple:bg-pink-900/40"
                  : "bg-gray-100 dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800"
              }
            `}>
              <Calendar className={`
                w-6 h-6
                ${
                  attendanceMode === "by-day"
                    ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                    : "text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70"
                }
              `} />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className={`
                text-base font-semibold mb-1
                ${
                  attendanceMode === "by-day"
                    ? "text-blue-900 dark:text-blue-200 midnight:text-cyan-200 purple:text-pink-200"
                    : "text-gray-900 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200"
                }
              `}>
                By School Day
              </h3>
              <p className={`
                text-sm leading-relaxed
                ${
                  attendanceMode === "by-day"
                    ? "text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300"
                    : "text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70"
                }
              `}>
                Track attendance once per school day. Students are marked as present, absent, late, or half-day for the entire day. Best for primary schools or institutions with homeroom-based systems.
              </p>

              {/* Features */}
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${attendanceMode === "by-day" ? "bg-blue-500" : "bg-gray-400"}`}></div>
                  <span className={`text-xs ${attendanceMode === "by-day" ? "text-blue-700 dark:text-blue-300" : "text-gray-500"}`}>
                    One attendance record per day per student
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${attendanceMode === "by-day" ? "bg-blue-500" : "bg-gray-400"}`}></div>
                  <span className={`text-xs ${attendanceMode === "by-day" ? "text-blue-700 dark:text-blue-300" : "text-gray-500"}`}>
                    Simpler attendance taking process
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${attendanceMode === "by-day" ? "bg-blue-500" : "bg-gray-400"}`}></div>
                  <span className={`text-xs ${attendanceMode === "by-day" ? "text-blue-700 dark:text-blue-300" : "text-gray-500"}`}>
                    Daily attendance calendar view
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* By Class Option */}
        <div
          onClick={() => handleModeChange("by-class")}
          className={`
            relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
            ${
              attendanceMode === "by-class"
                ? "border-blue-500 dark:border-blue-400 midnight:border-cyan-400 purple:border-pink-400 bg-blue-50/50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20"
                : "border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30"
            }
          `}
        >
          {/* Selection Indicator */}
          {attendanceMode === "by-class" && (
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-400 midnight:bg-cyan-400 purple:bg-pink-400 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}

          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`
              w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
              ${
                attendanceMode === "by-class"
                  ? "bg-blue-100 dark:bg-blue-900/40 midnight:bg-cyan-900/40 purple:bg-pink-900/40"
                  : "bg-gray-100 dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800"
              }
            `}>
              <UserCheck className={`
                w-6 h-6
                ${
                  attendanceMode === "by-class"
                    ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                    : "text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70"
                }
              `} />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className={`
                text-base font-semibold mb-1
                ${
                  attendanceMode === "by-class"
                    ? "text-blue-900 dark:text-blue-200 midnight:text-cyan-200 purple:text-pink-200"
                    : "text-gray-900 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200"
                }
              `}>
                By Class/Period
              </h3>
              <p className={`
                text-sm leading-relaxed
                ${
                  attendanceMode === "by-class"
                    ? "text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300"
                    : "text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70"
                }
              `}>
                Track attendance for each individual class or period throughout the day. Students are marked separately for every class they attend. Best for secondary schools, colleges, or institutions with multiple classes per day.
              </p>

              {/* Features */}
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${attendanceMode === "by-class" ? "bg-blue-500" : "bg-gray-400"}`}></div>
                  <span className={`text-xs ${attendanceMode === "by-class" ? "text-blue-700 dark:text-blue-300" : "text-gray-500"}`}>
                    Separate attendance for each class/period
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${attendanceMode === "by-class" ? "bg-blue-500" : "bg-gray-400"}`}></div>
                  <span className={`text-xs ${attendanceMode === "by-class" ? "text-blue-700 dark:text-blue-300" : "text-gray-500"}`}>
                    Detailed per-class attendance reports
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${attendanceMode === "by-class" ? "bg-blue-500" : "bg-gray-400"}`}></div>
                  <span className={`text-xs ${attendanceMode === "by-class" ? "text-blue-700 dark:text-blue-300" : "text-gray-500"}`}>
                    Track attendance trends by subject
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Information */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
        <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
          <span className="font-semibold">Note:</span> Your attendance mode preference is automatically saved and will be applied across all attendance features in the system.
        </p>
      </div>
    </div>
  );
}

// Helper function to get current attendance mode
export function getAttendanceMode(): AttendanceMode {
  if (typeof window !== "undefined") {
    const savedMode = localStorage.getItem("attendanceMode") as AttendanceMode | null;
    return savedMode && (savedMode === "by-class" || savedMode === "by-day") ? savedMode : "by-day";
  }
  return "by-day";
}
