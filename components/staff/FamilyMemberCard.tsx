"use client";

import Image from "next/image";
import { Lock, Phone, Mail } from "lucide-react";
import Tooltip from "@/components/shared/Tooltip";

interface FamilyMemberCardProps {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  photoUrl: string | null;
}

export default function FamilyMemberCard({
  name,
  relationship,
  phone,
  email,
  photoUrl,
}: FamilyMemberCardProps) {
  // Clean phone number for tel: link (remove spaces and special chars except +)
  const cleanPhoneNumber = phone?.replace(/\s+/g, "").replace(/[^\d+]/g, "") || "";

  return (
    <div className="group bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-800/50 midnight:from-gray-800 midnight:to-gray-900/50 purple:from-gray-800 purple:to-gray-900/50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 p-3 sm:p-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      {/* Mobile/Tablet: Compact Layout */}
      <div className="flex flex-col gap-2 sm:gap-4 md:hidden">
        {/* Top Row: Avatar, Name, Relationship, Lock Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {photoUrl ? (
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl overflow-hidden ring-2 ring-blue-200/60 dark:ring-blue-700/60 midnight:ring-cyan-500/40 purple:ring-pink-500/40 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/30 flex-shrink-0 transition-all duration-300 group-hover:ring-blue-400/80 dark:group-hover:ring-blue-600/80 midnight:group-hover:ring-cyan-400/60 purple:group-hover:ring-pink-400/60 group-hover:shadow-xl group-hover:shadow-blue-500/30 dark:group-hover:shadow-blue-500/40">
              <Image
                src={photoUrl}
                alt={name}
                width={56}
                height={56}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          ) : (
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-blue-500 dark:to-indigo-500 midnight:from-cyan-500 midnight:via-cyan-600 midnight:to-blue-600 purple:from-pink-500 purple:via-pink-600 purple:to-purple-600 flex items-center justify-center ring-2 ring-blue-200/60 dark:ring-blue-700/60 midnight:ring-cyan-500/40 purple:ring-pink-500/40 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/30 flex-shrink-0 transition-all duration-300 group-hover:ring-blue-400/80 dark:group-hover:ring-blue-600/80 midnight:group-hover:ring-cyan-400/60 purple:group-hover:ring-pink-400/60 group-hover:shadow-xl group-hover:shadow-blue-500/30 dark:group-hover:shadow-blue-500/40 group-hover:scale-105">
              <span className="text-sm sm:text-lg font-bold text-white drop-shadow-md">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 leading-tight truncate">
              {name}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 leading-tight mt-0.5">
              {relationship}
            </span>
          </div>
          <button className="w-7 h-7 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 midnight:from-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:to-pink-700 rounded-xl flex items-center justify-center flex-shrink-0 hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 midnight:hover:from-cyan-700 midnight:hover:to-cyan-800 purple:hover:from-pink-700 purple:hover:to-pink-800 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 dark:shadow-blue-500/40 dark:hover:shadow-blue-500/60 midnight:shadow-cyan-500/30 midnight:hover:shadow-cyan-500/50 purple:shadow-pink-500/30 purple:hover:shadow-pink-500/50 active:scale-95 transition-all duration-300 cursor-pointer group/lock">
            <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-white transition-transform duration-300 group-hover/lock:scale-110" />
          </button>
        </div>

        {/* Contact Information: Two Columns - Compact */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
          {/* Phone Column */}
          <a
            href={`tel:${cleanPhoneNumber}`}
            className="flex flex-col p-1.5 sm:p-2.5 rounded-xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-800/20 midnight:from-gray-900/40 midnight:to-gray-900/20 purple:from-gray-900/40 purple:to-gray-900/20 border border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/10 purple:border-pink-500/10 hover:from-blue-50 hover:to-blue-100/60 dark:hover:from-blue-900/30 dark:hover:to-blue-900/20 midnight:hover:from-cyan-900/30 midnight:hover:to-cyan-900/20 purple:hover:from-pink-900/30 purple:hover:to-pink-900/20 hover:border-blue-300/50 dark:hover:border-blue-600/50 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30 shadow-sm hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer group/phone hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-900/20 midnight:from-blue-900/40 midnight:to-blue-900/20 purple:from-blue-900/40 purple:to-blue-900/20 flex items-center justify-center flex-shrink-0 group-hover/phone:from-blue-200 group-hover/phone:to-blue-300 dark:group-hover/phone:from-blue-900/60 dark:group-hover/phone:to-blue-900/40 transition-all duration-300 group-hover/phone:scale-110 shadow-sm">
                <Phone className="w-2 h-2 sm:w-3 sm:h-3 text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400 transition-transform duration-300 group-hover/phone:scale-110" />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80">
                Phone
              </span>
            </div>
            <span className="text-[10px] sm:text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 break-words leading-tight group-hover/phone:text-blue-600 dark:group-hover/phone:text-blue-400 midnight:group-hover/phone:text-cyan-400 purple:group-hover/phone:text-pink-400 transition-colors duration-300">
              {phone}
            </span>
          </a>

          {/* Email Column */}
          <a
            href={`mailto:${email}`}
            className="flex flex-col p-1.5 sm:p-2.5 rounded-xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-800/20 midnight:from-gray-900/40 midnight:to-gray-900/20 purple:from-gray-900/40 purple:to-gray-900/20 border border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/10 purple:border-pink-500/10 hover:from-purple-50 hover:to-purple-100/60 dark:hover:from-purple-900/30 dark:hover:to-purple-900/20 midnight:hover:from-purple-900/30 midnight:hover:to-purple-900/20 purple:hover:from-pink-900/30 purple:hover:to-pink-900/20 hover:border-purple-300/50 dark:hover:border-purple-600/50 midnight:hover:border-purple-500/30 purple:hover:border-pink-500/30 shadow-sm hover:shadow-md hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer group/email min-w-0 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-900/20 midnight:from-purple-900/40 midnight:to-purple-900/20 purple:from-purple-900/40 purple:to-purple-900/20 flex items-center justify-center flex-shrink-0 group-hover/email:from-purple-200 group-hover/email:to-purple-300 dark:group-hover/email:from-purple-900/60 dark:group-hover/email:to-purple-900/40 transition-all duration-300 group-hover/email:scale-110 shadow-sm">
                <Mail className="w-2 h-2 sm:w-3 sm:h-3 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400 transition-transform duration-300 group-hover/email:scale-110" />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80">
                Email
              </span>
            </div>
            <Tooltip content={email}>
              <span className="text-[10px] sm:text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate leading-tight group-hover/email:text-purple-600 dark:group-hover/email:text-purple-400 midnight:group-hover/email:text-purple-400 purple:group-hover/email:text-pink-400 transition-colors duration-300 block">
                {email}
              </span>
            </Tooltip>
          </a>
        </div>
      </div>

      {/* Desktop: Horizontal Layout with Responsive Sizing */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-4 lg:gap-6 xl:gap-8 items-start">
        {/* Left Section: Avatar, Name, Relationship */}
        <div className="flex items-start gap-2.5 lg:gap-3.5">
          {photoUrl ? (
            <div className="w-11 h-11 lg:w-14 lg:h-14 rounded-xl overflow-hidden ring-2 ring-blue-200/60 dark:ring-blue-700/60 midnight:ring-cyan-500/40 purple:ring-pink-500/40 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/30 flex-shrink-0 transition-all duration-300 group-hover:ring-blue-400/80 dark:group-hover:ring-blue-600/80 midnight:group-hover:ring-cyan-400/60 purple:group-hover:ring-pink-400/60 group-hover:shadow-xl group-hover:shadow-blue-500/30 dark:group-hover:shadow-blue-500/40">
              <Image
                src={photoUrl}
                alt={name}
                width={56}
                height={56}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          ) : (
            <div className="w-11 h-11 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-blue-500 dark:to-indigo-500 midnight:from-cyan-500 midnight:via-cyan-600 midnight:to-blue-600 purple:from-pink-500 purple:via-pink-600 purple:to-purple-600 flex items-center justify-center ring-2 ring-blue-200/60 dark:ring-blue-700/60 midnight:ring-cyan-500/40 purple:ring-pink-500/40 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/30 flex-shrink-0 transition-all duration-300 group-hover:ring-blue-400/80 dark:group-hover:ring-blue-600/80 midnight:group-hover:ring-cyan-400/60 purple:group-hover:ring-pink-400/60 group-hover:shadow-xl group-hover:shadow-blue-500/30 dark:group-hover:shadow-blue-500/40 group-hover:scale-105">
              <span className="text-base lg:text-lg font-bold text-white drop-shadow-md">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs lg:text-sm xl:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 leading-tight truncate">
              {name}
            </span>
            <span className="text-[10px] lg:text-xs xl:text-xs font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 leading-tight mt-0.5">
              {relationship}
            </span>
          </div>
        </div>

        {/* Middle Section: Phone */}
        <div className="flex flex-col">
          <a
            href={`tel:${cleanPhoneNumber}`}
            className="flex flex-col p-2 lg:p-2.5 rounded-xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-800/20 midnight:from-gray-900/40 midnight:to-gray-900/20 purple:from-gray-900/40 purple:to-gray-900/20 border border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/10 purple:border-pink-500/10 hover:from-blue-50 hover:to-blue-100/60 dark:hover:from-blue-900/30 dark:hover:to-blue-900/20 midnight:hover:from-cyan-900/30 midnight:hover:to-cyan-900/20 purple:hover:from-pink-900/30 purple:hover:to-pink-900/20 hover:border-blue-300/50 dark:hover:border-blue-600/50 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30 shadow-sm hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer group/phone hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
              <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-900/20 midnight:from-blue-900/40 midnight:to-blue-900/20 purple:from-blue-900/40 purple:to-blue-900/20 flex items-center justify-center flex-shrink-0 group-hover/phone:from-blue-200 group-hover/phone:to-blue-300 dark:group-hover/phone:from-blue-900/60 dark:group-hover/phone:to-blue-900/40 transition-all duration-300 group-hover/phone:scale-110 shadow-sm">
                <Phone className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400 transition-transform duration-300 group-hover/phone:scale-110" />
              </div>
              <span className="text-[10px] lg:text-xs xl:text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80">
                Phone
              </span>
            </div>
            <span className="text-xs lg:text-sm xl:text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 break-words leading-tight group-hover/phone:text-blue-600 dark:group-hover/phone:text-blue-400 midnight:group-hover/phone:text-cyan-400 purple:group-hover/phone:text-pink-400 transition-colors duration-300">
              {phone}
            </span>
          </a>
        </div>

        {/* Right Section: Email & Lock Icon */}
        <div className="flex items-start gap-2 lg:gap-3">
          <a
            href={`mailto:${email}`}
            className="flex flex-col p-2 lg:p-2.5 rounded-xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-800/20 midnight:from-gray-900/40 midnight:to-gray-900/20 purple:from-gray-900/40 purple:to-gray-900/20 border border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/10 purple:border-pink-500/10 hover:from-purple-50 hover:to-purple-100/60 dark:hover:from-purple-900/30 dark:hover:to-purple-900/20 midnight:hover:from-purple-900/30 midnight:hover:to-purple-900/20 purple:hover:from-pink-900/30 purple:hover:to-pink-900/20 hover:border-purple-300/50 dark:hover:border-purple-600/50 midnight:hover:border-purple-500/30 purple:hover:border-pink-500/30 shadow-sm hover:shadow-md hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer group/email flex-1 min-w-0 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
              <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-900/20 midnight:from-purple-900/40 midnight:to-purple-900/20 purple:from-purple-900/40 purple:to-purple-900/20 flex items-center justify-center flex-shrink-0 group-hover/email:from-purple-200 group-hover/email:to-purple-300 dark:group-hover/email:from-purple-900/60 dark:group-hover/email:to-purple-900/40 transition-all duration-300 group-hover/email:scale-110 shadow-sm">
                <Mail className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400 transition-transform duration-300 group-hover/email:scale-110" />
              </div>
              <span className="text-[10px] lg:text-xs xl:text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80">
                Email
              </span>
            </div>
            <Tooltip content={email}>
              <span className="text-xs lg:text-sm xl:text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate leading-tight group-hover/email:text-purple-600 dark:group-hover/email:text-purple-400 midnight:group-hover/email:text-purple-400 purple:group-hover/email:text-pink-400 transition-colors duration-300 block">
                {email}
              </span>
            </Tooltip>
          </a>
          <button className="w-7 h-7 lg:w-9 lg:h-9 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 midnight:from-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:to-pink-700 rounded-xl flex items-center justify-center flex-shrink-0 hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 midnight:hover:from-cyan-700 midnight:hover:to-cyan-800 purple:hover:from-pink-700 purple:hover:to-pink-800 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 dark:shadow-blue-500/40 dark:hover:shadow-blue-500/60 midnight:shadow-cyan-500/30 midnight:hover:shadow-cyan-500/50 purple:shadow-pink-500/30 purple:hover:shadow-pink-500/50 active:scale-95 transition-all duration-300 cursor-pointer self-start mt-2 lg:mt-2.5 group/lock">
            <Lock className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white transition-transform duration-300 group-hover/lock:scale-110" />
          </button>
        </div>
      </div>
    </div>
  );
}
