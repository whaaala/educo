"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { DataManagementPage } from "@/components/pages";
import type { ColumnConfig, GridCardProps } from "@/types/components";
import {
  type SchoolEvent,
  type EventType,
  type EventStatus,
  getEventFilterFields,
  eventSortOptions,
  filterEvents,
  sortEvents,
  searchEvents,
  getEventStats,
} from "./config";
import {
  Calendar,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Star,
  PartyPopper,
  Trophy,
  GraduationCap,
  Palmtree,
  FileText,
} from "lucide-react";

// ============================================
// MOCK DATA
// ============================================

const MOCK_EVENTS: SchoolEvent[] = [
  {
    id: "evt-001",
    title: "Parents Teacher Meet",
    description: "Annual parent-teacher meeting to discuss student progress, academic performance, and areas for improvement. All parents are encouraged to attend.",
    date: "2024-02-10",
    time: "9:00 AM - 1:00 PM",
    duration: "Half Day",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=300&fit=crop",
    type: "meeting",
    status: "upcoming",
    location: "School Auditorium",
    isImportant: true,
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    classLevel: "JSS 2",
  },
  {
    id: "evt-002",
    title: "Farewell Party",
    description: "Celebration for graduating students. Join us for performances, speeches, and refreshments as we bid farewell to our SS 3 students.",
    date: "2024-02-15",
    time: "10:00 AM - 4:00 PM",
    duration: "Full Day",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop",
    type: "cultural",
    status: "upcoming",
    location: "School Hall",
  },
  {
    id: "evt-003",
    title: "Annual Day",
    description: "The biggest celebration of the year featuring cultural performances, award ceremonies, and special guest speakers.",
    date: "2024-02-28",
    time: "8:00 AM - 5:00 PM",
    duration: "Full Day",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    type: "cultural",
    status: "upcoming",
    location: "School Grounds",
    isImportant: true,
  },
  {
    id: "evt-004",
    title: "Sports Day",
    description: "Inter-house sports competition with track and field events, team sports, and fun activities for all students.",
    date: "2024-03-05",
    time: "7:30 AM - 4:00 PM",
    duration: "Full Day",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
    type: "sports",
    status: "upcoming",
    location: "School Sports Field",
  },
  {
    id: "evt-005",
    title: "Science Exhibition",
    description: "Students showcase their science projects and experiments. Parents are welcome to view the exhibits and interact with students.",
    date: "2024-03-15",
    time: "10:00 AM - 3:00 PM",
    duration: "Half Day",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop",
    type: "academic",
    status: "upcoming",
    location: "Science Labs",
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    classLevel: "SS 1",
  },
  {
    id: "evt-006",
    title: "Mid-Term Examination",
    description: "Mid-term examinations for all classes. Students should prepare well and come with all necessary materials.",
    date: "2024-03-20",
    endDate: "2024-03-25",
    duration: "Full Day",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
    type: "examination",
    status: "upcoming",
    location: "Respective Classrooms",
    isImportant: true,
  },
  {
    id: "evt-007",
    title: "Easter Holiday",
    description: "School closes for Easter break. Students should complete holiday assignments before resumption.",
    date: "2024-03-29",
    endDate: "2024-04-08",
    duration: "Full Day",
    image: "https://images.unsplash.com/photo-1457301547464-55675a0ffb8f?w=400&h=300&fit=crop",
    type: "holiday",
    status: "upcoming",
  },
  {
    id: "evt-008",
    title: "JSS 2 Class Assembly",
    description: "Special assembly presentation by JSS 2 students. Parents of JSS 2 students are invited to attend.",
    date: "2024-03-12",
    time: "8:00 AM - 9:30 AM",
    duration: "Half Day",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop",
    type: "academic",
    status: "upcoming",
    location: "School Assembly Hall",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    classLevel: "JSS 2",
  },
  {
    id: "evt-009",
    title: "Inter-School Debate",
    description: "Debate competition between schools. SS 1 students will represent our school in the regional competition.",
    date: "2024-03-18",
    time: "10:00 AM - 2:00 PM",
    duration: "Half Day",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop",
    type: "academic",
    status: "upcoming",
    location: "Conference Hall",
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    classLevel: "SS 1",
  },
  {
    id: "evt-010",
    title: "Republic Day Celebration",
    description: "National holiday celebration with flag hoisting, cultural programs, and patriotic activities.",
    date: "2024-01-26",
    time: "8:00 AM - 12:00 PM",
    duration: "Half Day",
    image: "https://images.unsplash.com/photo-1569974498991-d3c3a85a4072?w=400&h=300&fit=crop",
    type: "holiday",
    status: "completed",
    location: "School Grounds",
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function getEventTypeInfo(type: EventType) {
  switch (type) {
    case "academic":
      return {
        label: "Academic",
        icon: GraduationCap,
        bgClass: "bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20",
        textClass: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
        borderClass: "border-blue-200 dark:border-blue-700 midnight:border-cyan-500 purple:border-pink-500/30",
      };
    case "sports":
      return {
        label: "Sports",
        icon: Trophy,
        bgClass: "bg-emerald-50 dark:bg-emerald-900/20",
        textClass: "text-emerald-600 dark:text-emerald-400",
        borderClass: "border-emerald-200 dark:border-emerald-700/30",
      };
    case "cultural":
      return {
        label: "Cultural",
        icon: PartyPopper,
        bgClass: "bg-purple-50 dark:bg-purple-900/20",
        textClass: "text-purple-600 dark:text-purple-400",
        borderClass: "border-purple-200 dark:border-purple-700/30",
      };
    case "meeting":
      return {
        label: "Meeting",
        icon: Users,
        bgClass: "bg-amber-50 dark:bg-amber-900/20",
        textClass: "text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
        borderClass: "border-amber-200 dark:border-amber-700/30",
      };
    case "holiday":
      return {
        label: "Holiday",
        icon: Palmtree,
        bgClass: "bg-rose-50 dark:bg-rose-900/20",
        textClass: "text-rose-600 dark:text-rose-400",
        borderClass: "border-rose-200 dark:border-rose-700/30",
      };
    case "examination":
      return {
        label: "Examination",
        icon: FileText,
        bgClass: "bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20",
        textClass: "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
        borderClass: "border-red-200 dark:border-red-700/30",
      };
  }
}

function getEventStatusInfo(status: EventStatus) {
  switch (status) {
    case "upcoming":
      return { label: "Upcoming", bgClass: "bg-blue-100 dark:bg-blue-900/40", textClass: "text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300" };
    case "ongoing":
      return { label: "Ongoing", bgClass: "bg-green-100 dark:bg-green-900/40", textClass: "text-green-700 dark:text-green-300" };
    case "completed":
      return { label: "Completed", bgClass: "bg-surface-2/40", textClass: "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" };
    case "cancelled":
      return { label: "Cancelled", bgClass: "bg-red-100 dark:bg-red-900/40", textClass: "text-red-700 dark:text-red-300" };
  }
}

// ============================================
// COMPONENT
// ============================================

function EventGridCard({ item }: GridCardProps<SchoolEvent>) {
  const event = item;
  const typeInfo = getEventTypeInfo(event.type);
  const statusInfo = getEventStatusInfo(event.status);
  const TypeIcon = typeInfo.icon;

  return (
    <Link
      href={`/parents/events/${event.id}`}
      className={`group relative bg-surface rounded-2xl border ${typeInfo.borderClass} shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden`}
    >
      <div className={`absolute inset-0 opacity-[0.03] bg-gradient-to-br ${typeInfo.bgClass}`} />

      <div className="relative h-36 w-full overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[0.625rem] font-bold ${typeInfo.bgClass} ${typeInfo.textClass} backdrop-blur-sm`}
          >
            <TypeIcon className="w-3 h-3" />
            {typeInfo.label}
          </span>
          {event.isImportant && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[0.625rem] font-bold bg-red-500/90 text-white backdrop-blur-sm">
              <Star className="w-3 h-3" />
              Important
            </span>
          )}
        </div>

        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[0.625rem] font-bold backdrop-blur-sm ${
            event.duration === "Half Day" ? "bg-blue-500/90 text-white" : "bg-purple-500/90 text-white"
          }`}
        >
          {event.duration}
        </span>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-base leading-tight mb-1 group-hover:text-blue-200 transition-colors line-clamp-1">
            {event.title}
          </h3>
          <div className="flex items-center gap-1.5 text-white/80 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatShortDate(event.date)}</span>
            {event.endDate && <span>- {formatShortDate(event.endDate)}</span>}
          </div>
        </div>
      </div>

      <div className="relative p-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 line-clamp-2 mb-3 leading-relaxed">
          {event.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
          {event.time && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {event.time}
            </span>
          )}
          {event.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {event.location}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          {event.childName && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-medium">
              <Users className="w-3.5 h-3.5" />
              {event.childName}
              {event.classLevel ? (
                <>
                  <span className="text-indigo-400 dark:text-indigo-500">•</span>
                  {event.classLevel}
                </>
              ) : null}
            </span>
          )}

          <span
            className={`shrink-0 px-2 py-1 rounded-lg text-[0.625rem] font-bold ${statusInfo.bgClass} ${statusInfo.textClass}`}
          >
            {statusInfo.label}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ParentEventsPage() {
  const data = MOCK_EVENTS;
  const filterFields = useMemo(() => getEventFilterFields(data), [data]);

  const columns: ColumnConfig<SchoolEvent>[] = useMemo(
    () => [
      {
        key: "title",
        label: "Event",
        sortable: true,
        sortValue: (e) => e.title,
        render: (event) => {
          const typeInfo = getEventTypeInfo(event.type);
          const TypeIcon = typeInfo.icon;
          return (
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-surface-2">
                <Image src={event.image} alt={event.title} fill className="object-cover" unoptimized />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink truncate">
                    {event.title}
                  </span>
                  {event.isImportant && <Star className="w-4 h-4 text-red-500" />}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
                  <span className={`inline-flex items-center gap-1 ${typeInfo.textClass}`}>
                    <TypeIcon className="w-3.5 h-3.5" />
                    {typeInfo.label}
                  </span>
                  {event.childName ? (
                    <>
                      <span>•</span>
                      <span className="truncate">{event.childName}</span>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        key: "date",
        label: "Date",
        sortable: true,
        sortValue: (e) => new Date(e.date).getTime(),
        render: (event) => (
          <div className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
            <div className="font-medium">{formatDate(event.date)}</div>
            {event.endDate ? (
              <div className="text-xs text-muted">to {formatDate(event.endDate)}</div>
            ) : null}
          </div>
        ),
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
        sortValue: (e) => e.status,
        render: (event) => {
          const statusInfo = getEventStatusInfo(event.status);
          return (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.bgClass} ${statusInfo.textClass}`}
            >
              {statusInfo.label}
            </span>
          );
        },
      },
      {
        key: "actions",
        label: "Action",
        className: "text-right",
        searchable: false,
        sortable: false,
        render: (event) => (
          <Link
            href={`/parents/events/${event.id}`}
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 text-xs font-semibold"
          >
            View
          </Link>
        ),
      },
    ],
    []
  );

  return (
    <DataManagementPage
      title="School Events"
      subtitle="Stay updated with school activities and important dates"
      breadcrumbs={[
        { label: "Parent Portal", href: "/parents" },
        { label: "Events", isActive: true },
      ]}
      data={data}
      getRowKey={(e) => e.id}
      columns={columns}
      stats={getEventStats()}
      filterFields={filterFields}
      sortOptions={eventSortOptions}
      defaultSort="date_soon"
      filterFn={filterEvents}
      sortFn={sortEvents}
      searchFn={searchEvents}
      searchPlaceholder="Search events..."
      itemLabel="event"
      itemLabelPlural="events"
      enableSelection={false}
      enableExport={false}
      enableViewToggle={true}
      defaultViewMode="grid"
      gridCardComponent={EventGridCard}
      gridColumns={{ sm: 1, md: 2, lg: 3, xl: 3 }}
      emptyStateConfig={{
        title: "No events found",
        description: "Try adjusting your search or filters to find events.",
        icon: CalendarDays,
      }}
    />
  );
}
