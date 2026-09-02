"use client";

import Image from "next/image";
import { Clock, Edit2, User } from "lucide-react";
import Tooltip from "@/components/shared/Tooltip";

interface TimetableCellProps {
  time: string;
  subject: string;
  teacher: string;
  teacherAvatar?: string;
  backgroundColor: string;
  textColor: string;
  onClick?: () => void;
  isEditable?: boolean;
  totalDays?: number; // Total days in the timetable (5, 6, or 7)
}

export default function TimetableCell({
  time,
  subject,
  teacher,
  teacherAvatar,
  backgroundColor,
  textColor,
  onClick,
  isEditable = false,
  totalDays = 5,
}: TimetableCellProps) {
  // Check if this is a 7-day week configuration
  const isSevenDayWeek = totalDays === 7;
  return (
    <div
      onClick={onClick}
      className={`${backgroundColor} rounded-xl md:rounded-lg relative overflow-hidden w-full group transition-all duration-300 ${
        isEditable ? "cursor-pointer hover:ring-2 hover:ring-blue-500 dark:hover:ring-blue-400 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1" : "hover:shadow-lg"
      } shadow-md border border-white/20 dark:border-gray-700/30`}
    >
      {/* Gradient Overlay for depth - Mobile only */}
      <div className="md:hidden absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/5 dark:from-white/5 dark:via-transparent dark:to-black/20 pointer-events-none" />

      {/* Edit Icon (only shown on hover if editable) */}
      {isEditable && (
        <div className="absolute top-2 right-2 md:top-1 md:right-1 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 transform group-hover:scale-110">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-1.5 md:p-1 shadow-lg">
            <Edit2 className="w-3.5 h-3.5 md:w-3 md:h-3" />
          </div>
        </div>
      )}

      {/* Mobile Layout - Enhanced Readability Design */}
      <div className="md:hidden relative flex flex-col h-full min-h-[135px]">
        {/* Top Section - Time & Subject */}
        <div className="p-2.5 pb-2 flex-1">
          {/* Time Badge - Enhanced */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-gradient-to-r from-white/70 to-white/50 dark:from-black/40 dark:to-black/30 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 shadow-sm">
              <Clock className="w-3 h-3 text-gray-600 dark:text-gray-400 flex-shrink-0" />
              <span className="text-[0.625rem] font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap tracking-wide">
                {time}
              </span>
            </div>
          </div>

          {/* Subject - Enhanced Display */}
          <div className="flex items-center justify-start">
            <h3 className={`text-base font-black ${textColor} leading-tight tracking-tight line-clamp-2`}>
              {subject}
            </h3>
          </div>
        </div>

        {/* Bottom Section - Teacher Info (Clickable) */}
        {teacher && (
          <div className="px-2.5 pb-2.5">
            <div className="relative">
              {/* Divider Line */}
              <div className="absolute -top-1.5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300/50 dark:via-gray-600/50 to-transparent"></div>

              <button
                onClick={onClick}
                className="w-full flex items-center gap-2.5 pt-2.5 px-2 py-1.5 -mx-2 -mb-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-black/20 active:bg-white/80 dark:active:bg-black/30 transition-all duration-200 group/teacher cursor-pointer"
              >
                {teacherAvatar ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/80 dark:ring-gray-600/60 shadow-md group-hover/teacher:ring-blue-500/50 dark:group-hover/teacher:ring-blue-400/50 group-hover/teacher:scale-105 transition-all duration-200">
                    <Image
                      src={teacherAvatar}
                      alt={teacher}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center flex-shrink-0 shadow-md group-hover/teacher:from-blue-400 group-hover/teacher:to-blue-500 dark:group-hover/teacher:from-blue-500 dark:group-hover/teacher:to-blue-600 group-hover/teacher:scale-105 transition-all duration-200">
                    <User className="w-4 h-4 text-white dark:text-gray-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate leading-tight group-hover/teacher:text-blue-600 dark:group-hover/teacher:text-blue-400 transition-colors duration-200">
                    {teacher}
                  </p>
                  <p className="text-[0.5625rem] font-medium text-gray-500 dark:text-gray-400 truncate leading-tight mt-0.5">
                    Instructor
                  </p>
                </div>
                {/* Arrow indicator */}
                <svg
                  className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover/teacher:text-blue-500 dark:group-hover/teacher:text-blue-400 group-hover/teacher:translate-x-0.5 transition-all duration-200 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop/Tablet Layout - Compact Design */}
      <div className={`hidden md:flex flex-col relative h-full ${
        isSevenDayWeek
          ? "gap-1 lg:gap-1.5 xl:gap-2 p-1.5 md:p-2 lg:p-2.5 xl:p-3 min-h-[95px] lg:min-h-[110px] xl:min-h-[125px]"
          : "gap-2 lg:gap-2.5 p-3 lg:p-3.5 min-h-[100px] lg:min-h-[115px]"
      }`}>
        {/* Time with icon */}
        <Tooltip content={time}>
          <div className={`flex items-center w-full min-w-0 ${isSevenDayWeek ? "gap-0.5 lg:gap-1" : "gap-1"}`}>
            <Clock className={`text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 flex-shrink-0 stroke-[2.5] ${
              isSevenDayWeek
                ? "w-[6px] h-[6px] lg:w-[7px] lg:h-[7px] xl:w-[8px] xl:h-[8px]"
                : "w-[6px] h-[6px] lg:w-[6px] lg:h-[6px] xl:w-[6px] xl:h-[6px]"
            }`} />
            <span className={`font-bold text-gray-800 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 leading-none whitespace-nowrap flex-1 min-w-0 ${
              isSevenDayWeek
                ? "text-[0.5625rem] lg:text-[0.625rem] xl:text-[0.6875rem] truncate"
                : "text-[0.5625rem] lg:text-[0.625rem] xl:text-[0.625rem] truncate"
            }`}>
              {time}
            </span>
          </div>
        </Tooltip>

        {/* Subject */}
        <div className="flex-1 flex flex-col justify-center min-h-0 overflow-hidden">
          <Tooltip content={subject}>
            <div className={`font-bold ${textColor} truncate leading-tight ${
              isSevenDayWeek
                ? "text-[0.6875rem] md:text-xs lg:text-[0.8125rem] xl:text-sm"
                : "text-sm lg:text-base xl:text-base"
            }`}>
              {subject}
            </div>
          </Tooltip>
        </div>

        {/* Teacher - Clickable */}
        {teacher && (
          <Tooltip content={teacher}>
            <div className={`flex items-center pt-0.5 cursor-pointer group/teacher hover:bg-white/40 dark:hover:bg-white/10 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 rounded-md px-1 py-0.5 -mx-1 -my-0.5 transition-all duration-200 min-w-0 overflow-hidden ${
              isSevenDayWeek ? "gap-1 lg:gap-1.5 xl:gap-2" : "gap-1.5 lg:gap-2"
            }`}>
              {teacherAvatar && (
                <div className={`relative rounded-md overflow-hidden flex-shrink-0 ring-2 ring-transparent group-hover/teacher:ring-blue-500/50 dark:group-hover/teacher:ring-blue-400/50 midnight:group-hover/teacher:ring-cyan-400/50 purple:group-hover/teacher:ring-pink-400/50 transition-all duration-200 ${
                  isSevenDayWeek
                    ? "w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5"
                    : "w-5 h-5 lg:w-6 lg:h-6 xl:w-6 xl:h-6"
                }`}>
                  <Image
                    src={teacherAvatar}
                    alt={teacher}
                    width={isSevenDayWeek ? 20 : 24}
                    height={isSevenDayWeek ? 20 : 24}
                    className="w-full h-full object-cover group-hover/teacher:scale-110 transition-transform duration-200"
                  />
                </div>
              )}
              <span className={`font-bold text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 truncate group-hover/teacher:text-blue-600 dark:group-hover/teacher:text-blue-400 midnight:group-hover/teacher:text-cyan-400 purple:group-hover/teacher:text-pink-400 transition-colors duration-200 leading-tight overflow-hidden text-ellipsis flex-1 min-w-0 ${
                isSevenDayWeek
                  ? "text-[0.5625rem] md:text-[0.625rem] lg:text-[0.6875rem] xl:text-xs"
                  : "text-xs lg:text-sm xl:text-sm"
              }`}>
                {teacher}
              </span>
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
