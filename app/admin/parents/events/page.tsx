"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DataManagementPage } from "@/components/pages";
import BulkDeleteModal, { BulkDeleteItem } from "@/components/shared/BulkDeleteModal";
import Tooltip from "@/components/shared/Tooltip";
import { getAllParents } from "@/lib/mockParents";
import type { ColumnConfig, GridCardProps } from "@/types/components";
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
  Eye,
  Edit,
  Trash2,
  Send,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  type AdminEvent,
  type EventType,
  type EventStatus,
  type ParentRSVP,
  adminParentEventFilterFields,
  adminParentEventSortOptions,
  adminParentEventStats,
  filterAdminParentEvents,
  sortAdminParentEvents,
  searchAdminParentEvents,
} from "./config";

// Generate mock events for admin view
const generateAdminEvents = (): AdminEvent[] => {
  const parents = getAllParents();
  const events: AdminEvent[] = [];
  // Use fixed base date to avoid hydration mismatch
  const BASE_DATE = new Date("2026-01-25T12:00:00");

  const eventData = [
    { title: "Parents Teacher Meet", type: "meeting" as EventType, image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=300&fit=crop", location: "School Auditorium", important: true },
    { title: "Annual Day Celebration", type: "cultural" as EventType, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop", location: "School Grounds", important: true },
    { title: "Sports Day", type: "sports" as EventType, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop", location: "Sports Field", important: false },
    { title: "Science Exhibition", type: "academic" as EventType, image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop", location: "Science Labs", important: false },
    { title: "Mid-Term Examination", type: "examination" as EventType, image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop", location: "Classrooms", important: true },
    { title: "Easter Holiday", type: "holiday" as EventType, image: "https://images.unsplash.com/photo-1457301547464-55675a0ffb8f?w=400&h=300&fit=crop", location: "", important: false },
    { title: "Cultural Day", type: "cultural" as EventType, image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop", location: "School Hall", important: false },
    { title: "Inter-School Debate", type: "academic" as EventType, image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop", location: "Conference Hall", important: false },
    { title: "End of Year Party", type: "cultural" as EventType, image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop", location: "School Hall", important: true },
    { title: "Swimming Competition", type: "sports" as EventType, image: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400&h=300&fit=crop", location: "Swimming Pool", important: false },
  ];

  const audiences: AdminEvent["targetAudience"][] = ["All", "Primary", "Secondary", "Specific Classes"];
  const statuses: EventStatus[] = ["upcoming", "upcoming", "upcoming", "ongoing", "completed"];

  eventData.forEach((data, idx) => {
    const daysOffset = idx * 7 - 14;
    const eventDate = new Date(BASE_DATE);
    eventDate.setDate(eventDate.getDate() + daysOffset);

    const status = daysOffset < -7 ? "completed" : daysOffset < 0 ? "ongoing" : "upcoming";
    const audience = audiences[idx % audiences.length];

    // Generate RSVPs - use deterministic values based on idx
    const rsvps: ParentRSVP[] = [];
    const numRsvps = 3 + (idx % Math.min(parents.length, 10));
    const selectedParents = parents.slice(0, numRsvps);

    selectedParents.forEach((parent, pIdx) => {
      const rsvpStatusOptions: ParentRSVP["status"][] = ["confirmed", "confirmed", "declined", "pending"];
      const rsvpStatus = rsvpStatusOptions[(idx + pIdx) % rsvpStatusOptions.length];
      const daysAgoResponded = ((idx + pIdx) % 7) + 1;
      rsvps.push({
        parentId: parent.id,
        parentName: `${parent.firstName} ${parent.lastName}`,
        parentAvatar: parent.profilePhoto,
        status: rsvpStatus,
        childrenAttending: rsvpStatus === "confirmed" ? parent.children.map((c) => c.fullName) : [],
        respondedAt: rsvpStatus !== "pending" ? new Date(BASE_DATE.getTime() - daysAgoResponded * 24 * 60 * 60 * 1000).toISOString() : undefined,
      });
    });

    const confirmed = rsvps.filter((r) => r.status === "confirmed").length;
    const declined = rsvps.filter((r) => r.status === "declined").length;
    const pending = rsvps.filter((r) => r.status === "pending").length;

    const rsvpDeadline = new Date(eventDate);
    rsvpDeadline.setDate(rsvpDeadline.getDate() - 3);

    const startHour = 8 + (idx % 3);
    const endHour = 2 + (idx % 3);

    events.push({
      id: `evt-${String(idx + 1).padStart(3, "0")}`,
      title: data.title,
      description: `Join us for ${data.title.toLowerCase()}. This is an important event for all students and parents. Please confirm your attendance by the deadline.`,
      date: eventDate.toISOString().split("T")[0],
      endDate: data.type === "examination" || data.type === "holiday" ? new Date(eventDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] : undefined,
      time: data.type !== "holiday" ? `${startHour}:00 AM - ${endHour}:00 PM` : undefined,
      duration: idx % 2 === 0 ? "Full Day" : "Half Day",
      image: data.image,
      type: data.type,
      status,
      location: data.location,
      isImportant: data.important,
      targetAudience: audience,
      targetClasses: audience === "Specific Classes" ? ["JSS 1", "JSS 2", "SS 1"] : undefined,
      invitedParents: parents.length,
      confirmedParents: confirmed,
      declinedParents: declined,
      pendingParents: pending,
      rsvpDeadline: rsvpDeadline.toISOString().split("T")[0],
      createdAt: new Date(eventDate.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: "Admin",
      rsvps,
    });
  });

  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const MOCK_EVENTS = generateAdminEvents();

// Helper functions
const getEventTypeInfo = (type: EventType) => {
  const config: Record<EventType, { label: string; icon: typeof Calendar; bgClass: string; textClass: string }> = {
    academic: { label: "Academic", icon: GraduationCap, bgClass: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30", textClass: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" },
    sports: { label: "Sports", icon: Trophy, bgClass: "bg-emerald-100 dark:bg-emerald-900/30", textClass: "text-emerald-600 dark:text-emerald-400" },
    cultural: { label: "Cultural", icon: PartyPopper, bgClass: "bg-purple-100 dark:bg-purple-900/30", textClass: "text-purple-600 dark:text-purple-400" },
    meeting: { label: "Meeting", icon: Users, bgClass: "bg-amber-100 dark:bg-amber-900/30", textClass: "text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" },
    holiday: { label: "Holiday", icon: Palmtree, bgClass: "bg-rose-100 dark:bg-rose-900/30", textClass: "text-rose-600 dark:text-rose-400" },
    examination: { label: "Exam", icon: FileText, bgClass: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30", textClass: "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" },
  };
  return config[type];
};

const getStatusBadge = (status: EventStatus) => {
  const config: Record<EventStatus, { label: string; bgClass: string; textClass: string; icon: typeof CheckCircle2 }> = {
    upcoming: { label: "Upcoming", bgClass: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30", textClass: "text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400", icon: Clock },
    ongoing: { label: "Ongoing", bgClass: "bg-green-100 dark:bg-green-900/30", textClass: "text-green-700 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400", icon: CheckCircle2 },
    completed: { label: "Completed", bgClass: "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50", textClass: "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300", icon: CheckCircle2 },
    cancelled: { label: "Cancelled", bgClass: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30", textClass: "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400", icon: XCircle },
  };
  const c = config[status];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${c.bgClass} ${c.textClass}`}>
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  );
};

export default function AdminParentEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<AdminEvent[]>(MOCK_EVENTS);

  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<BulkDeleteItem[]>([]);

  const handleBulkDelete = (selectedIds: Set<string>) => {
    if (selectedIds.size === 0) return;
    const selectedEvents = events.filter((evt) => selectedIds.has(evt.id));
    const items: BulkDeleteItem[] = selectedEvents.map((evt) => ({
      id: evt.id,
      name: evt.title,
      subtitle: `${new Date(evt.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} | ${evt.confirmedParents} confirmed`,
    }));
    setItemsToDelete(items);
    setIsBulkDeleteModalOpen(true);
  };

  const columns: ColumnConfig<AdminEvent>[] = useMemo(
    () => [
      {
        key: "event",
        label: "Event",
        sortable: true,
        render: (evt) => {
          const typeInfo = getEventTypeInfo(evt.type);
          const TypeIcon = typeInfo.icon;
          return (
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={evt.image} alt={evt.title} fill className="object-cover" unoptimized />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {evt.isImportant && (
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
                  )}
                  <p className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm truncate">
                    {evt.title}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${typeInfo.bgClass} ${typeInfo.textClass}`}
                  >
                    <TypeIcon className="w-3 h-3" />
                    {typeInfo.label}
                  </span>
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
        render: (evt) => (
          <div>
            <p className="font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm">
              {new Date(evt.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
            {evt.time && <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">{evt.time}</p>}
          </div>
        ),
      },
      {
        key: "location",
        label: "Location",
        render: (evt) =>
          evt.location ? (
            <span className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              {evt.location}
            </span>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          ),
      },
      {
        key: "audience",
        label: "Audience",
        render: (evt) => (
          <span className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
            {evt.targetAudience}
            {evt.targetClasses && (
              <span className="text-gray-400"> ({evt.targetClasses.length} classes)</span>
            )}
          </span>
        ),
      },
      {
        key: "rsvp",
        label: "RSVPs",
        sortable: true,
        render: (evt) => (
          <div className="flex items-center gap-3">
            <Tooltip content="Confirmed">
              <span className="flex items-center gap-0.5 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{evt.confirmedParents}</span>
              </span>
            </Tooltip>
            <Tooltip content="Pending">
              <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{evt.pendingParents}</span>
              </span>
            </Tooltip>
            <Tooltip content="Declined">
              <span className="flex items-center gap-0.5 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">
                <XCircle className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{evt.declinedParents}</span>
              </span>
            </Tooltip>
          </div>
        ),
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
        render: (evt) => getStatusBadge(evt.status),
      },
      {
        key: "actions",
        label: "Actions",
        className: "text-center",
        sortable: false,
        searchable: false,
        render: (evt) => (
          <div className="flex items-center justify-center gap-1">
            <Tooltip content="View Details">
              <button
                type="button"
                onClick={() => console.log("View", evt.id)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
              </button>
            </Tooltip>
            <Tooltip content="Edit Event">
              <button
                type="button"
                onClick={() => router.push(`/admin/parents/events/${evt.id}/edit`)}
                className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
              >
                <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              </button>
            </Tooltip>
            <Tooltip content="Send Reminder">
              <button
                type="button"
                onClick={() => console.log("Send reminder", evt.id)}
                className="p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </button>
            </Tooltip>
          </div>
        ),
      },
    ],
    [router]
  );

  const EventGridCard = useMemo(() => {
    return function EventGridCardInner({
      item,
      isSelected,
      onSelectionChange,
    }: GridCardProps<AdminEvent>) {
      return (
        <div className="relative">
          <div className="absolute bottom-3 left-3 z-10">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelectionChange(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer bg-white/90"
              aria-label={`Select ${item.title}`}
            />
          </div>
          <EventCard event={item} getEventTypeInfo={getEventTypeInfo} getStatusBadge={getStatusBadge} />
        </div>
      );
    };
  }, []);

  return (
    <DataManagementPage<AdminEvent>
      title="Parent Events"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Admin" },
        { label: "Parents", href: "/admin/parents" },
        { label: "Events", isActive: true },
      ]}
      data={events}
      getRowKey={(evt) => evt.id}
      columns={columns}
      stats={adminParentEventStats}
      filterFields={adminParentEventFilterFields}
      filterFn={filterAdminParentEvents}
      sortOptions={adminParentEventSortOptions}
      sortFn={sortAdminParentEvents}
      defaultSort="date_desc"
      searchFn={searchAdminParentEvents}
      searchPlaceholder="Search events..."
      enableDateRange
      getDateForRange={(evt) => evt.date}
      enableViewToggle
      gridCardComponent={EventGridCard}
      gridColumns={{ sm: 1, md: 2, lg: 3, xl: 3 }}
      enableSelection
      bulkActions={[
        {
          id: "delete",
          label: "Delete Events",
          icon: Trash2,
          variant: "danger",
          onClick: handleBulkDelete,
        },
      ]}
      addButtonConfig={{
        label: "Create Event",
        href: "/admin/parents/events/add",
      }}
      enableExport
      exportConfig={{ filename: "parent-events" }}
      itemLabel="event"
      itemLabelPlural="events"
      emptyStateConfig={{
        title: "No events found",
        description: "Try adjusting your filters, or create a new event.",
      }}
    >
      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={(itemIds) => {
          setEvents((prev) => prev.filter((e) => !itemIds.includes(e.id)));
          setIsBulkDeleteModalOpen(false);
          setItemsToDelete([]);
        }}
        items={itemsToDelete}
        onRemoveItem={(itemId) => setItemsToDelete((prev) => prev.filter((i) => i.id !== itemId))}
        onRestoreItem={(item) => setItemsToDelete((prev) => [...prev, item])}
        onRestoreAll={(items) => setItemsToDelete((prev) => [...prev, ...items])}
        title="Delete Events"
        warningMessage="This will permanently remove these events and all associated RSVPs. This action cannot be undone."
        confirmButtonText="Delete Events"
      />
    </DataManagementPage>
  );
}

// Event Card Component
interface EventCardProps {
  event: AdminEvent;
  getEventTypeInfo: (type: EventType) => { label: string; icon: typeof Calendar; bgClass: string; textClass: string };
  getStatusBadge: (status: EventStatus) => ReactNode;
}

function EventCard({ event, getEventTypeInfo, getStatusBadge }: EventCardProps) {
  const typeInfo = getEventTypeInfo(event.type);
  const TypeIcon = typeInfo.icon;

  return (
    <div className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      {/* Image */}
      <div className="relative h-36 w-full overflow-hidden">
        <Image src={event.image} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${typeInfo.bgClass} ${typeInfo.textClass} backdrop-blur-sm`}>
            <TypeIcon className="w-3 h-3" />
            {typeInfo.label}
          </span>
          {event.isImportant && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-500/90 text-white backdrop-blur-sm">
              <Star className="w-3 h-3" />
              Important
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">{getStatusBadge(event.status)}</div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-base leading-tight mb-1 line-clamp-1">{event.title}</h3>
          <div className="flex items-center gap-1.5 text-white/80 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {new Date(event.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-3">
          {event.time && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {event.time}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {event.location}
            </span>
          )}
        </div>

        {/* RSVP Stats */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50 mb-3">
          <div className="text-center">
            <p className="text-lg font-bold text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400">{event.confirmedParents}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Confirmed</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400">{event.pendingParents}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">{event.declinedParents}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Declined</p>
          </div>
        </div>

        {/* Audience */}
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Target Audience</span>
          <span className="font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">{event.targetAudience}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-1 pt-3 border-t border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <Tooltip content="Send Reminder">
            <button className="p-2 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors cursor-pointer">
              <Send className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </button>
          </Tooltip>
          <Tooltip content="Edit">
            <button className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer">
              <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
            </button>
          </Tooltip>
          <Tooltip content="View Details">
            <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer">
              <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
