"use client";

import Image from "next/image";
import { Clock, Edit2, User } from "lucide-react";

interface TimetableCellProps {
  time: string;
  subject: string;
  teacher: string;
  teacherAvatar?: string;
  backgroundColor: string;
  textColor: string;
  onClick?: () => void;
  isEditable?: boolean;
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
}: TimetableCellProps) {
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

      {/* Mobile Layout - Modern Redesigned Card */}
      <div className="md:hidden relative flex flex-col h-full min-h-[130px]">
        {/* Top Section - Time & Subject */}
        <div className="p-3 pb-2.5 flex-1">
          {/* Time Badge - Top Left */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-white/70 to-white/50 dark:from-black/40 dark:to-black/30 backdrop-blur-sm border border-white/30 dark:border-gray-700/30">
              <Clock className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
              <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {time}
              </span>
            </div>
          </div>

          {/* Subject - Prominent Display */}
          <div className="flex items-center justify-start">
            <h3 className={`text-xl font-black ${textColor} leading-tight tracking-tight`}>
              {subject}
            </h3>
          </div>
        </div>

        {/* Bottom Section - Teacher Info */}
        {teacher && (
          <div className="px-3 pb-3">
            <div className="relative">
              {/* Divider Line */}
              <div className="absolute -top-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300/50 dark:via-gray-600/50 to-transparent"></div>

              <div className="flex items-center gap-2.5 pt-2">
                {teacherAvatar ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-offset-2 ring-white/60 dark:ring-gray-600/60 shadow-md">
                    <Image
                      src={teacherAvatar}
                      alt={teacher}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center flex-shrink-0 shadow-md">
                    <User className="w-4 h-4 text-white dark:text-gray-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate leading-tight">
                    {teacher}
                  </p>
                  <p className="text-[10px] font-medium text-gray-500 dark:text-gray-500 leading-tight">
                    Instructor
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop/Tablet Layout - Compact Design */}
      <div className="hidden md:flex flex-col gap-1 md:gap-1.5 lg:gap-2 p-2 md:p-2.5 lg:p-3 relative h-full min-h-[85px] md:min-h-[95px] lg:min-h-[105px]">
        {/* Time with icon */}
        <div className="flex items-start gap-0.5 w-full min-w-0">
          <Clock className="w-2 h-2 md:w-2 md:h-2 lg:w-2.5 lg:h-2.5 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 flex-shrink-0 stroke-[2] mt-0.5" />
          <span className="text-[5.5px] md:text-[6px] lg:text-[7px] xl:text-[8px] font-bold text-gray-800 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 leading-tight block flex-1 min-w-0 break-words">
            {time}
          </span>
        </div>

        {/* Subject */}
        <div className="flex-1 flex flex-col justify-center min-h-0 overflow-hidden">
          <div className={`text-[10px] md:text-[11px] lg:text-[12px] xl:text-[13px] font-bold ${textColor} line-clamp-2 leading-[1.3] break-words hyphens-auto`}>
            {subject}
          </div>
        </div>

        {/* Teacher - Clickable */}
        {teacher && (
          <div className="flex items-center gap-0.5 md:gap-1 pt-0.5 cursor-pointer group/teacher hover:bg-white/40 dark:hover:bg-white/10 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 rounded-md px-0.5 py-0.5 -mx-0.5 -my-0.5 transition-all duration-200 min-w-0 overflow-hidden">
            {teacherAvatar && (
              <div className="relative w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 rounded-sm md:rounded-md overflow-hidden flex-shrink-0 ring-1 md:ring-2 ring-transparent group-hover/teacher:ring-blue-500/50 dark:group-hover/teacher:ring-blue-400/50 midnight:group-hover/teacher:ring-cyan-400/50 purple:group-hover/teacher:ring-pink-400/50 transition-all duration-200">
                <Image
                  src={teacherAvatar}
                  alt={teacher}
                  width={20}
                  height={20}
                  className="w-full h-full object-cover group-hover/teacher:scale-110 transition-transform duration-200"
                />
              </div>
            )}
            <span className="text-[8px] md:text-[9px] lg:text-[10px] xl:text-[11px] font-bold text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 truncate group-hover/teacher:text-blue-600 dark:group-hover/teacher:text-blue-400 midnight:group-hover/teacher:text-cyan-400 purple:group-hover/teacher:text-pink-400 transition-colors duration-200 leading-tight overflow-hidden text-ellipsis flex-1 min-w-0">
              {teacher}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
