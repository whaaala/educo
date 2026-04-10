"use client";

import Image from "next/image";
import { Mail, CheckCircle2, Users, ChevronRight } from "lucide-react";

interface ParentProfileCardProps {
  parent: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    profilePhoto: string;
  };
  selectedChild: {
    id: string;
    fullName: string;
    classLevel: string;
    section: string;
    profilePhoto: string;
  };
  children: {
    id: string;
    fullName: string;
    classLevel: string;
    section: string;
    profilePhoto: string;
  }[];
  onChildSelect: (childId: string) => void;
}

export default function ParentProfileCard({
  parent,
  selectedChild,
  children,
  onChildSelect,
}: ParentProfileCardProps) {
  return (
    <div className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm overflow-hidden">
      {/* Header Banner with Gradient */}
      <div className="relative h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 dark:from-blue-600 dark:via-blue-700 dark:to-indigo-800">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* Decorative circles */}
        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-8 -left-4 w-32 h-32 rounded-full bg-indigo-400/20 blur-2xl" />
      </div>

      {/* Profile Section */}
      <div className="relative px-5 pb-5">
        {/* Avatar - Overlapping Banner */}
        <div className="relative -mt-12 mb-4 flex items-end gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-xl bg-white dark:bg-[#22262e]">
              <Image
                src={parent.profilePhoto}
                alt={parent.fullName}
                width={96}
                height={96}
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
            {/* Online Status */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-3 border-white dark:border-[#1a1d24] flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Parent ID Badge */}
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 px-2.5 py-1 rounded-lg shadow-sm">
              ID: {parent.id}
            </span>
          </div>
        </div>

        {/* Parent Info */}
        <div className="space-y-2 mb-5">
          <h3 className="font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-xl leading-tight">
            {parent.fullName}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="p-1 rounded-md bg-gray-100 dark:bg-[#22262e]/50">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <span className="truncate">{parent.email}</span>
          </div>
        </div>

        {/* Elegant Divider */}
        <div className="relative h-px mb-5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
        </div>

        {/* Children Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 shadow-sm">
                <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                My Children
              </span>
            </div>
            <span className="text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 px-2.5 py-1 rounded-full shadow-sm">
              {children.length} {children.length === 1 ? "Child" : "Children"}
            </span>
          </div>

          <div className="space-y-2.5">
            {children.map((child) => {
              const isSelected = selectedChild.id === child.id;
              return (
                <button
                  key={child.id}
                  onClick={() => onChildSelect(child.id)}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl transition-all duration-300 group ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-2 border-blue-400 dark:border-blue-500 shadow-md shadow-blue-500/10"
                      : "bg-gray-50/80 dark:bg-[#22262e]/20 border-2 border-transparent hover:bg-white dark:hover:bg-[#22262e]/40 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-md"
                  }`}
                >
                  {/* Child Avatar */}
                  <div className={`relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 transition-transform duration-300 ${
                    isSelected ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-800" : "group-hover:scale-105"
                  }`}>
                    <Image
                      src={child.profilePhoto}
                      alt={child.fullName}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>

                  {/* Child Info */}
                  <div className="flex-1 text-left min-w-0">
                    <p className={`font-semibold truncate transition-colors ${
                      isSelected
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    }`}>
                      {child.fullName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                        isSelected
                          ? "bg-blue-200/70 dark:bg-blue-800/50 text-blue-700 dark:text-blue-200"
                          : "bg-gray-200/80 dark:bg-[#2a2d35]/50 text-gray-600 dark:text-gray-300"
                      }`}>
                        {child.classLevel}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Section {child.section}
                      </span>
                    </div>
                  </div>

                  {/* Selection Indicator / Arrow */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30"
                      : "bg-gray-100 dark:bg-[#22262e] group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30"
                  }`}>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
