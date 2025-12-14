"use client";

import Link from "next/link";
import { ChevronRight, Bell, Calendar } from "lucide-react";

interface Notice {
  id: string;
  title: string;
  date: string;
  isNew?: boolean;
}

interface NoticeBoardSectionProps {
  notices: Notice[];
  viewAllLink?: string;
}

export default function NoticeBoardSection({
  notices,
  viewAllLink = "/parents/notices",
}: NoticeBoardSectionProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
            <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            Notice Board
          </h3>
        </div>
        <Link
          href={viewAllLink}
          className="text-sm text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline flex items-center gap-1 font-medium"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Notices List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
        {notices.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No notices available</p>
          </div>
        ) : (
          notices.map((notice) => (
            <Link
              key={notice.id}
              href={`/parents/notices/${notice.id}`}
              className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
            >
              <div className="flex items-start gap-3">
                {notice.isNew && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                )}
                <div className={`flex-1 min-w-0 ${!notice.isNew ? "pl-5" : ""}`}>
                  <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {notice.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Added on: {formatDate(notice.date)}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-0.5" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
