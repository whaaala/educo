"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import StatCard from "@/components/shared/StatCard";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import { usePageLoad } from "@/hooks/usePageLoad";
import {
  Calendar,
  CalendarDays,
  ChevronRight,
  Clock,
  MapPin,
  Tag,
  Users,
  Star,
  PartyPopper,
  Trophy,
  GraduationCap,
  Palmtree,
  FileText,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

type EventType = "academic" | "sports" | "cultural" | "meeting" | "holiday" | "examination";
type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  time?: string;
  duration: "Half Day" | "Full Day";
  image: string;
  type: EventType;
  status: EventStatus;
  location?: string;
  isImportant?: boolean;
  childId?: string;
  childName?: string;
  classLevel?: string;
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_CHILDREN = [
  { id: "child-001", name: "Adaeze Okonkwo", classLevel: "JSS 2", section: "A" },
  { id: "child-002", name: "Chukwuemeka Okonkwo", classLevel: "SS 1", section: "B" },
];

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

// Filter Options
const CHILD_OPTIONS = [
  { value: "all", label: "All Children" },
  ...MOCK_CHILDREN.map((child) => ({ value: child.id, label: child.name })),
];

const TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "academic", label: "Academic" },
  { value: "sports", label: "Sports" },
  { value: "cultural", label: "Cultural" },
  { value: "meeting", label: "Meeting" },
  { value: "holiday", label: "Holiday" },
  { value: "examination", label: "Examination" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
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
        bgClass: "bg-blue-50 dark:bg-blue-900/20",
        textClass: "text-blue-600 dark:text-blue-400",
        borderClass: "border-blue-200 dark:border-blue-700/30",
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
        textClass: "text-amber-600 dark:text-amber-400",
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
        bgClass: "bg-red-50 dark:bg-red-900/20",
        textClass: "text-red-600 dark:text-red-400",
        borderClass: "border-red-200 dark:border-red-700/30",
      };
  }
}

function getEventStatusInfo(status: EventStatus) {
  switch (status) {
    case "upcoming":
      return { label: "Upcoming", bgClass: "bg-blue-100 dark:bg-blue-900/40", textClass: "text-blue-700 dark:text-blue-300" };
    case "ongoing":
      return { label: "Ongoing", bgClass: "bg-green-100 dark:bg-green-900/40", textClass: "text-green-700 dark:text-green-300" };
    case "completed":
      return { label: "Completed", bgClass: "bg-gray-100 dark:bg-gray-700/40", textClass: "text-gray-600 dark:text-gray-400" };
    case "cancelled":
      return { label: "Cancelled", bgClass: "bg-red-100 dark:bg-red-900/40", textClass: "text-red-700 dark:text-red-300" };
  }
}

// ============================================
// COMPONENT
// ============================================

export default function ParentEventsPage() {
  const isPageLoading = usePageLoad(600);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Filter events
  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesChild =
        selectedChild === "all" ||
        !event.childId ||
        event.childId === selectedChild;

      const matchesType = selectedType === "all" || event.type === selectedType;
      const matchesStatus = selectedStatus === "all" || event.status === selectedStatus;

      return matchesSearch && matchesChild && matchesType && matchesStatus;
    });
  }, [searchQuery, selectedChild, selectedType, selectedStatus]);

  // Group events by status
  const upcomingEvents = filteredEvents.filter((e) => e.status === "upcoming" || e.status === "ongoing");
  const pastEvents = filteredEvents.filter((e) => e.status === "completed" || e.status === "cancelled");

  // Stats
  const stats = useMemo(() => {
    const total = MOCK_EVENTS.length;
    const upcoming = MOCK_EVENTS.filter((e) => e.status === "upcoming").length;
    const important = MOCK_EVENTS.filter((e) => e.isImportant).length;
    const thisMonth = MOCK_EVENTS.filter((e) => {
      const eventDate = new Date(e.date);
      const now = new Date();
      return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
    }).length;
    return { total, upcoming, important, thisMonth };
  }, []);

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Events" />

      <div className={`space-y-6 transition-opacity duration-500 ${isPageLoading ? "opacity-0" : "opacity-100"}`}>
        {/* Page Header with Breadcrumb */}
        <PageHeader
          title="School Events"
          breadcrumbs={[
            { label: "Parent Portal", href: "/parents" },
            { label: "Events" },
          ]}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={CalendarDays}
            label="Total Events"
            value={stats.total.toString()}
            color="blue"
          />
          <StatCard
            icon={Clock}
            label="Upcoming"
            value={stats.upcoming.toString()}
            color="green"
          />
          <StatCard
            icon={Star}
            label="Important"
            value={stats.important.toString()}
            color="amber"
          />
          <StatCard
            icon={Calendar}
            label="This Month"
            value={stats.thisMonth.toString()}
            color="purple"
          />
        </div>

        {/* Search and Filters */}
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search events..."
          filters={[
            {
              label: "Child",
              value: selectedChild,
              onChange: (val) => setSelectedChild(String(val)),
              options: CHILD_OPTIONS,
            },
            {
              label: "Type",
              value: selectedType,
              onChange: (val) => setSelectedType(String(val)),
              options: TYPE_OPTIONS,
            },
            {
              label: "Status",
              value: selectedStatus,
              onChange: (val) => setSelectedStatus(String(val)),
              options: STATUS_OPTIONS,
            },
          ]}
        />

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Events</h2>
              <span className="px-2.5 py-1 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-sm">
                {upcomingEvents.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.map((event) => {
                const typeInfo = getEventTypeInfo(event.type);
                const TypeIcon = typeInfo.icon;

                return (
                  <Link
                    key={event.id}
                    href={`/parents/events/${event.id}`}
                    className={`group relative bg-white dark:bg-gray-800 rounded-2xl border ${typeInfo.borderClass} shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden`}
                  >
                    {/* Subtle gradient background */}
                    <div className={`absolute inset-0 opacity-[0.03] bg-gradient-to-br ${typeInfo.bgClass}`} />

                    {/* Event Image */}
                    <div className="relative h-36 w-full overflow-hidden">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                      {/* Top badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${typeInfo.bgClass} ${typeInfo.textClass} backdrop-blur-sm`}>
                          <TypeIcon className="w-3 h-3" />
                          {typeInfo.label}
                        </span>
                        {event.isImportant && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-red-500/90 text-white backdrop-blur-sm">
                            <Star className="w-3 h-3" />
                            Important
                          </span>
                        )}
                      </div>

                      {/* Duration Badge */}
                      <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur-sm ${
                        event.duration === "Half Day"
                          ? "bg-blue-500/90 text-white"
                          : "bg-purple-500/90 text-white"
                      }`}>
                        {event.duration}
                      </span>

                      {/* Title & Date overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold text-base leading-tight mb-1 group-hover:text-blue-200 transition-colors line-clamp-1">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-white/80 text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatShortDate(event.date)}</span>
                          {event.endDate && (
                            <span>- {formatShortDate(event.endDate)}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Event Content */}
                    <div className="relative p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3 leading-relaxed">
                        {event.description}
                      </p>

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
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

                      {/* Child specific badge */}
                      {event.childName && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-medium">
                            <Users className="w-3.5 h-3.5" />
                            {event.childName}
                            <span className="text-indigo-400 dark:text-indigo-500">•</span>
                            {event.classLevel}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Hover indicator */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={`p-2 rounded-full ${typeInfo.bgClass}`}>
                        <ChevronRight className={`w-4 h-4 ${typeInfo.textClass}`} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700/50">
                <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Past Events</h2>
              <span className="px-2.5 py-1 text-xs font-bold text-gray-600 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-full">
                {pastEvents.length}
              </span>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {pastEvents.map((event) => {
                  const typeInfo = getEventTypeInfo(event.type);
                  const statusInfo = getEventStatusInfo(event.status);
                  const TypeIcon = typeInfo.icon;

                  return (
                    <Link
                      key={event.id}
                      href={`/parents/events/${event.id}`}
                      className="group flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          unoptimized
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {event.title}
                          </h3>
                          <span className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold ${statusInfo.bgClass} ${statusInfo.textClass}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {formatDate(event.date)}
                          <span>•</span>
                          {event.duration}
                        </p>
                      </div>

                      <div className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${typeInfo.bgClass}`}>
                        <TypeIcon className={`w-3.5 h-3.5 ${typeInfo.textClass}`} />
                        <span className={`text-[10px] font-semibold ${typeInfo.textClass}`}>{typeInfo.label}</span>
                      </div>

                      <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700/50 dark:to-gray-800 flex items-center justify-center">
                <CalendarDays className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No events found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                {searchQuery || selectedChild !== "all" || selectedType !== "all" || selectedStatus !== "all"
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "There are no events scheduled at the moment. Check back later!"}
              </p>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
              <CalendarDays className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Stay Updated</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                School events include academic activities, sports competitions, cultural celebrations, parent-teacher meetings,
                holidays, and examinations. Click on any event to view detailed information including schedule, location, and requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
