"use client";

import Image from "next/image";
import { Clock } from "lucide-react";

interface TimetableCellProps {
  time: string;
  subject: string;
  teacher: string;
  teacherAvatar?: string;
  backgroundColor: string;
  textColor: string;
}

export default function TimetableCell({
  time,
  subject,
  teacher,
  teacherAvatar,
  backgroundColor,
  textColor,
}: TimetableCellProps) {
  return (
    <div
      className={`${backgroundColor} rounded-xl p-3 relative overflow-hidden min-h-[95px] w-full`}
    >
      <div className="flex flex-col gap-2 h-full">
        {/* Time with icon */}
        <div className="flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 text-gray-500 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 flex-shrink-0" />
          <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/90 purple:text-pink-300/90 whitespace-nowrap">
            {time}
          </span>
        </div>

        {/* Subject */}
        <div className="flex-1 flex flex-col justify-center">
          <div className={`text-sm font-bold ${textColor} line-clamp-2 leading-tight`}>
            {subject}
          </div>
        </div>

        {/* Teacher - Clickable */}
        <div className="flex items-center gap-2 pt-1.5 cursor-pointer group/teacher hover:bg-white/40 dark:hover:bg-white/10 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 rounded-lg px-2 py-1 -mx-2 -my-1 transition-all duration-200">
          {teacherAvatar && (
            <div className="relative w-6 h-6 rounded-md overflow-hidden flex-shrink-0 ring-2 ring-transparent group-hover/teacher:ring-blue-500/50 dark:group-hover/teacher:ring-blue-400/50 midnight:group-hover/teacher:ring-cyan-400/50 purple:group-hover/teacher:ring-pink-400/50 transition-all duration-200">
              <Image
                src={teacherAvatar}
                alt={teacher}
                width={24}
                height={24}
                className="w-full h-full object-cover group-hover/teacher:scale-110 transition-transform duration-200"
              />
            </div>
          )}
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 truncate group-hover/teacher:text-blue-600 dark:group-hover/teacher:text-blue-400 midnight:group-hover/teacher:text-cyan-400 purple:group-hover/teacher:text-pink-400 transition-colors duration-200">
            {teacher}
          </span>
        </div>
      </div>
    </div>
  );
}
