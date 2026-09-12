"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Calendar } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  duration: "Full Day" | "Half Day";
  image: string;
}

interface EventsSectionProps {
  events: Event[];
  viewAllLink?: string;
}

export default function EventsSection({
  events,
  viewAllLink = "/parents/events",
}: EventsSectionProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-surface rounded-xl border border-line shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30">
            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <h3 className="font-semibold text-ink">
            Upcoming Events
          </h3>
        </div>
        <Link
          href={viewAllLink}
          className="text-sm text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline flex items-center gap-1 font-medium"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Events Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="group cursor-pointer"
            >
              <div className="relative h-28 rounded-xl overflow-hidden mb-3 shadow-md">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/95 dark:bg-[#0f1115]/95 text-gray-800 dark:text-white shadow-sm">
                  {event.duration}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-ink line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {event.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatDate(event.date)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
