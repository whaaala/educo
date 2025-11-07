"use client";

import Image from "next/image";
import { Lock, Phone, Mail } from "lucide-react";

interface ParentCardProps {
  name: string;
  role: string;
  phone: string;
  email: string;
  photoUrl: string | null;
}

export default function ParentCard({
  name,
  role,
  phone,
  email,
  photoUrl,
}: ParentCardProps) {
  // Clean phone number for tel: link (remove spaces and special chars except +)
  const cleanPhoneNumber = phone?.replace(/\s+/g, "").replace(/[^\d+]/g, "") || "";

  return (
    <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/40 dark:border-gray-800/40 midnight:border-cyan-500/20 purple:border-pink-500/20 p-2.5 sm:p-5 transition-all duration-200 hover:shadow-md hover:border-gray-300/60 dark:hover:border-gray-700/60 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30">
      {/* Mobile/Tablet: Compact Layout */}
      <div className="flex flex-col gap-2 sm:gap-4 md:hidden">
        {/* Top Row: Avatar, Name, Role, Lock Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {photoUrl ? (
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden ring-1 ring-gray-200/50 dark:ring-gray-700/50 midnight:ring-cyan-500/20 purple:ring-pink-500/20 shadow-sm flex-shrink-0">
              <Image
                src={photoUrl}
                alt={name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 flex items-center justify-center ring-1 ring-gray-200/50 dark:ring-gray-700/50 midnight:ring-cyan-500/20 purple:ring-pink-500/20 shadow-sm flex-shrink-0">
              <span className="text-sm sm:text-lg font-bold text-white">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 leading-tight truncate">
              {name}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 leading-tight mt-0.5">
              {role}
            </span>
          </div>
          <button className="w-7 h-7 sm:w-9 sm:h-9 bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-blue-700 dark:hover:bg-blue-600 midnight:hover:bg-cyan-700 purple:hover:bg-pink-700 hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer">
            <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </button>
        </div>

        {/* Contact Information: Two Columns - Compact */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
          {/* Phone Column */}
          <a
            href={`tel:${cleanPhoneNumber}`}
            className="flex flex-col p-1.5 sm:p-2.5 rounded-lg bg-gray-50/50 dark:bg-gray-800/30 midnight:bg-gray-900/30 purple:bg-gray-900/30 hover:bg-gray-100/70 dark:hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors">
                <Phone className="w-2 h-2 sm:w-3 sm:h-3 text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400" />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80">
                Phone
              </span>
            </div>
            <span className="text-[10px] sm:text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 break-words leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 midnight:group-hover:text-cyan-400 purple:group-hover:text-pink-400 transition-colors">
              {phone}
            </span>
          </a>

          {/* Email Column */}
          <a
            href={`mailto:${email}`}
            className="flex flex-col p-1.5 sm:p-2.5 rounded-lg bg-gray-50/50 dark:bg-gray-800/30 midnight:bg-gray-900/30 purple:bg-gray-900/30 hover:bg-gray-100/70 dark:hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors">
                <Mail className="w-2 h-2 sm:w-3 sm:h-3 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400" />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80">
                Email
              </span>
            </div>
            <span className="text-[10px] sm:text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 break-words leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 midnight:group-hover:text-purple-400 purple:group-hover:text-pink-400 transition-colors">
              {email}
            </span>
          </a>
        </div>
      </div>

      {/* Desktop: Horizontal Layout with Responsive Sizing */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-4 lg:gap-6 xl:gap-8 items-start">
        {/* Left Section: Avatar, Name, Role */}
        <div className="flex items-start gap-2.5 lg:gap-3.5">
          {photoUrl ? (
            <div className="w-11 h-11 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl overflow-hidden ring-1 ring-gray-200/50 dark:ring-gray-700/50 midnight:ring-cyan-500/20 purple:ring-pink-500/20 shadow-sm flex-shrink-0">
              <Image
                src={photoUrl}
                alt={name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-11 h-11 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 flex items-center justify-center ring-1 ring-gray-200/50 dark:ring-gray-700/50 midnight:ring-cyan-500/20 purple:ring-pink-500/20 shadow-sm flex-shrink-0">
              <span className="text-base lg:text-lg font-bold text-white">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs lg:text-sm xl:text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 leading-tight truncate">
              {name}
            </span>
            <span className="text-[10px] lg:text-xs xl:text-sm font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 leading-tight mt-0.5">
              {role}
            </span>
          </div>
        </div>

        {/* Middle Section: Phone */}
        <div className="flex flex-col">
          <a
            href={`tel:${cleanPhoneNumber}`}
            className="flex flex-col p-2 lg:p-2.5 rounded-lg bg-gray-50/50 dark:bg-gray-800/30 midnight:bg-gray-900/30 purple:bg-gray-900/30 hover:bg-gray-100/70 dark:hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
              <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-md lg:rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors">
                <Phone className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400" />
              </div>
              <span className="text-[10px] lg:text-xs xl:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80">
                Phone
              </span>
            </div>
            <span className="text-xs lg:text-sm xl:text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 break-words leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 midnight:group-hover:text-cyan-400 purple:group-hover:text-pink-400 transition-colors">
              {phone}
            </span>
          </a>
        </div>

        {/* Right Section: Email & Lock Icon */}
        <div className="flex items-start gap-2 lg:gap-3">
          <a
            href={`mailto:${email}`}
            className="flex flex-col p-2 lg:p-2.5 rounded-lg bg-gray-50/50 dark:bg-gray-800/30 midnight:bg-gray-900/30 purple:bg-gray-900/30 hover:bg-gray-100/70 dark:hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer group flex-1 min-w-0"
          >
            <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
              <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-md lg:rounded-lg bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors">
                <Mail className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400" />
              </div>
              <span className="text-[10px] lg:text-xs xl:text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80">
                Email
              </span>
            </div>
            <span className="text-xs lg:text-sm xl:text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 break-words leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 midnight:group-hover:text-purple-400 purple:group-hover:text-pink-400 transition-colors">
              {email}
            </span>
          </a>
          <button className="w-7 h-7 lg:w-9 lg:h-9 bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-blue-700 dark:hover:bg-blue-600 midnight:hover:bg-cyan-700 purple:hover:bg-pink-700 hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer self-start mt-2 lg:mt-2.5">
            <Lock className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

