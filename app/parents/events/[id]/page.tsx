"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import Button from "@/components/shared/Button";
import { usePageLoad } from "@/hooks/usePageLoad";
import {
  Calendar,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Share2,
  Bell,
  BellRing,
  CheckCircle2,
  Info,
  Phone,
  User,
  Star,
  Trophy,
  GraduationCap,
  PartyPopper,
  Palmtree,
  FileText,
  ChevronRight,
  ExternalLink,
  Check,
  Lock,
} from "lucide-react";
import SetReminderModal from "@/components/shared/SetReminderModal";
import ShareEventModal from "@/components/shared/ShareEventModal";

// ============================================
// TYPES
// ============================================

type EventType = "academic" | "sports" | "cultural" | "meeting" | "holiday" | "examination";
type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
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
  organizer?: string;
  contactPerson?: string;
  contactPhone?: string;
  requirements?: string[];
  agenda?: { time: string; activity: string }[];
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_EVENTS: Record<string, SchoolEvent> = {
  "evt-001": {
    id: "evt-001",
    title: "Parents Teacher Meet",
    description: "Annual parent-teacher meeting to discuss student progress, academic performance, and areas for improvement.",
    fullDescription: "The Parents Teacher Meeting is an important opportunity for parents to meet with their children's teachers and discuss academic progress. During this meeting, teachers will share insights about your child's performance, strengths, and areas that need improvement. Parents are encouraged to ask questions and discuss any concerns they may have.\n\nPlease arrive 10 minutes before your scheduled slot. Each parent-teacher session will last approximately 15 minutes. If you need more time, please request an additional appointment through the school office.",
    date: "2024-02-10",
    time: "9:00 AM - 1:00 PM",
    duration: "Half Day",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&h=600&fit=crop",
    type: "meeting",
    status: "upcoming",
    location: "School Auditorium",
    isImportant: true,
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    classLevel: "JSS 2",
    organizer: "Academic Affairs Office",
    contactPerson: "Mrs. Nkechi Eze",
    contactPhone: "+234 803 123 4567",
    requirements: [
      "Bring your child's report card from last term",
      "Note any specific questions or concerns",
      "Arrive 10 minutes before your slot",
    ],
    agenda: [
      { time: "9:00 AM", activity: "Registration & Welcome" },
      { time: "9:30 AM", activity: "Individual Parent-Teacher Sessions Begin" },
      { time: "12:30 PM", activity: "Final Sessions" },
      { time: "1:00 PM", activity: "Close" },
    ],
  },
  "evt-002": {
    id: "evt-002",
    title: "Farewell Party",
    description: "Celebration for graduating students with performances, speeches, and refreshments.",
    fullDescription: "Join us for a memorable farewell celebration as we bid goodbye to our graduating SS 3 students. The event will feature cultural performances, heartfelt speeches, award presentations, and a special tribute to the graduating class.\n\nAll students and parents are welcome to attend. Refreshments will be served. Dress code is smart casual.",
    date: "2024-02-15",
    time: "10:00 AM - 4:00 PM",
    duration: "Full Day",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
    type: "cultural",
    status: "upcoming",
    location: "School Hall",
    organizer: "Student Affairs Committee",
    contactPerson: "Mr. Chidi Okoro",
    contactPhone: "+234 803 456 7890",
    agenda: [
      { time: "10:00 AM", activity: "Arrival & Registration" },
      { time: "10:30 AM", activity: "Opening Prayer & National Anthem" },
      { time: "11:00 AM", activity: "Cultural Performances" },
      { time: "12:30 PM", activity: "Lunch Break" },
      { time: "1:30 PM", activity: "Speeches & Tributes" },
      { time: "3:00 PM", activity: "Award Presentations" },
      { time: "3:30 PM", activity: "Vote of Thanks & Closing" },
    ],
  },
  "evt-003": {
    id: "evt-003",
    title: "Annual Day",
    description: "The biggest celebration of the year featuring cultural performances, award ceremonies, and special guest speakers.",
    fullDescription: "Annual Day is the most anticipated event of the school year. This grand celebration showcases the talents of our students through cultural performances, music, dance, and drama. The event also includes an award ceremony recognizing academic excellence, sports achievements, and extracurricular accomplishments.\n\nWe are honored to have distinguished guests and dignitaries join us for this special occasion. Parents and family members are warmly invited to attend and celebrate with us.",
    date: "2024-02-28",
    time: "8:00 AM - 5:00 PM",
    duration: "Full Day",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    type: "cultural",
    status: "upcoming",
    location: "School Grounds",
    isImportant: true,
    organizer: "Annual Day Committee",
    contactPerson: "Principal's Office",
    contactPhone: "+234 803 111 2222",
    requirements: [
      "Entry passes required (collected from class teachers)",
      "Arrive by 7:30 AM for seating",
      "Formal attire recommended",
    ],
    agenda: [
      { time: "8:00 AM", activity: "Arrival & Seating" },
      { time: "8:30 AM", activity: "Chief Guest Arrival" },
      { time: "9:00 AM", activity: "Opening Ceremony" },
      { time: "10:00 AM", activity: "Cultural Performances" },
      { time: "12:00 PM", activity: "Lunch Break" },
      { time: "1:30 PM", activity: "Award Ceremony" },
      { time: "3:30 PM", activity: "Special Performances" },
      { time: "4:30 PM", activity: "Vote of Thanks & Closing" },
    ],
  },
  "evt-004": {
    id: "evt-004",
    title: "Sports Day",
    description: "Inter-house sports competition with track and field events, team sports, and fun activities.",
    fullDescription: "Get ready for an action-packed day of sports and athletics! Our annual Sports Day brings together students from all classes to compete in various track and field events, team sports, and fun games.\n\nStudents will compete under their respective houses (Red, Blue, Green, Yellow) for the coveted Sports Day Trophy. Parents are encouraged to come and cheer for their children.",
    date: "2024-03-05",
    time: "7:30 AM - 4:00 PM",
    duration: "Full Day",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop",
    type: "sports",
    status: "upcoming",
    location: "School Sports Field",
    organizer: "Sports Department",
    contactPerson: "Coach Emeka",
    contactPhone: "+234 803 789 0123",
    requirements: [
      "Students must wear house colors",
      "Bring water bottles and sun protection",
      "Sports shoes mandatory for participants",
    ],
    agenda: [
      { time: "7:30 AM", activity: "Assembly & March Past" },
      { time: "8:30 AM", activity: "Track Events Begin" },
      { time: "10:30 AM", activity: "Field Events" },
      { time: "12:00 PM", activity: "Lunch Break" },
      { time: "1:00 PM", activity: "Team Sports (Football, Basketball)" },
      { time: "3:00 PM", activity: "Relay Races & Finals" },
      { time: "3:45 PM", activity: "Prize Distribution & Closing" },
    ],
  },
  "evt-005": {
    id: "evt-005",
    title: "Science Exhibition",
    description: "Students showcase their science projects and experiments.",
    fullDescription: "The annual Science Exhibition is a platform for our budding scientists to display their innovative projects and experiments. Students from all classes will present their work on various scientific topics.\n\nParents and visitors can interact with students, ask questions about their projects, and see demonstrations. This is a great opportunity to appreciate the scientific curiosity and creativity of our students.",
    date: "2024-03-15",
    time: "10:00 AM - 3:00 PM",
    duration: "Half Day",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop",
    type: "academic",
    status: "upcoming",
    location: "Science Labs",
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    classLevel: "SS 1",
    organizer: "Science Department",
    contactPerson: "Dr. Amina Bello",
    contactPhone: "+234 803 234 5678",
  },
  "evt-006": {
    id: "evt-006",
    title: "Mid-Term Examination",
    description: "Mid-term examinations for all classes.",
    fullDescription: "Mid-term examinations will be conducted for all classes. Students should prepare thoroughly and revise all topics covered during the term. Examination schedules have been shared with students.\n\nPlease ensure your child gets adequate rest and arrives on time with all necessary materials (pens, pencils, ruler, calculator where applicable).",
    date: "2024-03-20",
    endDate: "2024-03-25",
    duration: "Full Day",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
    type: "examination",
    status: "upcoming",
    location: "Respective Classrooms",
    isImportant: true,
    organizer: "Examination Office",
    contactPerson: "Examination Officer",
    contactPhone: "+234 803 345 6789",
    requirements: [
      "Arrive 15 minutes before exam time",
      "Bring required stationery",
      "Student ID card mandatory",
      "No mobile phones allowed",
    ],
  },
  "evt-007": {
    id: "evt-007",
    title: "Easter Holiday",
    description: "School closes for Easter break.",
    fullDescription: "School will be closed for the Easter holiday period. Students should complete all holiday assignments before resumption. Have a blessed Easter celebration with your families!",
    date: "2024-03-29",
    endDate: "2024-04-08",
    duration: "Full Day",
    image: "https://images.unsplash.com/photo-1457301547464-55675a0ffb8f?w=800&h=600&fit=crop",
    type: "holiday",
    status: "upcoming",
    organizer: "School Administration",
  },
  "evt-008": {
    id: "evt-008",
    title: "JSS 2 Class Assembly",
    description: "Special assembly presentation by JSS 2 students.",
    fullDescription: "JSS 2 students will conduct the school assembly with a special presentation on Environmental Conservation. Parents of JSS 2 students are warmly invited to attend and see their children showcase their talents.",
    date: "2024-03-12",
    time: "8:00 AM - 9:30 AM",
    duration: "Half Day",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
    type: "academic",
    status: "upcoming",
    location: "School Assembly Hall",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    classLevel: "JSS 2",
    organizer: "JSS 2 Class Teachers",
    contactPerson: "Mrs. Nkechi Eze",
    contactPhone: "+234 803 123 4567",
  },
  "evt-009": {
    id: "evt-009",
    title: "Inter-School Debate",
    description: "Debate competition between schools.",
    fullDescription: "Our school will participate in the regional inter-school debate competition. SS 1 students have been selected to represent our school. Parents are welcome to attend and support our team.",
    date: "2024-03-18",
    time: "10:00 AM - 2:00 PM",
    duration: "Half Day",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop",
    type: "academic",
    status: "upcoming",
    location: "Conference Hall",
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    classLevel: "SS 1",
    organizer: "English Department",
    contactPerson: "Mrs. Funke Adeleke",
    contactPhone: "+234 803 456 7890",
  },
  "evt-010": {
    id: "evt-010",
    title: "Republic Day Celebration",
    description: "National holiday celebration with cultural programs.",
    fullDescription: "The school celebrated Republic Day with flag hoisting, cultural programs, and patriotic activities. Students participated in various cultural performances showcasing the rich heritage of our nation.",
    date: "2024-01-26",
    time: "8:00 AM - 12:00 PM",
    duration: "Half Day",
    image: "https://images.unsplash.com/photo-1569974498991-d3c3a85a4072?w=800&h=600&fit=crop",
    type: "holiday",
    status: "completed",
    location: "School Grounds",
    organizer: "Cultural Committee",
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
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
        gradientFrom: "from-blue-500",
        gradientTo: "to-indigo-500",
      };
    case "sports":
      return {
        label: "Sports",
        icon: Trophy,
        bgClass: "bg-emerald-50 dark:bg-emerald-900/20",
        textClass: "text-emerald-600 dark:text-emerald-400",
        borderClass: "border-emerald-200 dark:border-emerald-700/30",
        gradientFrom: "from-emerald-500",
        gradientTo: "to-teal-500",
      };
    case "cultural":
      return {
        label: "Cultural",
        icon: PartyPopper,
        bgClass: "bg-purple-50 dark:bg-purple-900/20",
        textClass: "text-purple-600 dark:text-purple-400",
        borderClass: "border-purple-200 dark:border-purple-700/30",
        gradientFrom: "from-purple-500",
        gradientTo: "to-pink-500",
      };
    case "meeting":
      return {
        label: "Meeting",
        icon: Users,
        bgClass: "bg-amber-50 dark:bg-amber-900/20",
        textClass: "text-amber-600 dark:text-amber-400",
        borderClass: "border-amber-200 dark:border-amber-700/30",
        gradientFrom: "from-amber-500",
        gradientTo: "to-orange-500",
      };
    case "holiday":
      return {
        label: "Holiday",
        icon: Palmtree,
        bgClass: "bg-rose-50 dark:bg-rose-900/20",
        textClass: "text-rose-600 dark:text-rose-400",
        borderClass: "border-rose-200 dark:border-rose-700/30",
        gradientFrom: "from-rose-500",
        gradientTo: "to-pink-500",
      };
    case "examination":
      return {
        label: "Examination",
        icon: FileText,
        bgClass: "bg-red-50 dark:bg-red-900/20",
        textClass: "text-red-600 dark:text-red-400",
        borderClass: "border-red-200 dark:border-red-700/30",
        gradientFrom: "from-red-500",
        gradientTo: "to-orange-500",
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

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.id as string;
  const isPageLoading = usePageLoad(600);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [reminderSet, setReminderSet] = useState<string | null>(null);

  const handleSetReminder = (reminderType: string) => {
    setReminderSet(reminderType);
  };

  const getReminderLabel = (type: string) => {
    const labels: Record<string, string> = {
      "30min": "30 min before",
      "1hour": "1 hour before",
      "1day": "1 day before",
      "3days": "3 days before",
      "1week": "1 week before",
      "custom": "Custom time",
    };
    return labels[type] || type;
  };

  const event = MOCK_EVENTS[eventId];

  if (isPageLoading) {
    return <PageLoader isLoading={true} loadingText="Loading Event" />;
  }

  if (!event) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <PageHeader
            title="Event Not Found"
            breadcrumbs={[
              { label: "Parent Portal", href: "/parents" },
              { label: "Events", href: "/parents/events" },
              { label: "Not Found" },
            ]}
          />
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700/50 dark:to-gray-800 flex items-center justify-center mb-4">
                <CalendarDays className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Event Not Found</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                The event you&apos;re looking for doesn&apos;t exist or may have been removed.
              </p>
              <Link href="/parents/events">
                <Button variant="outline" className="gap-2">
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Back to Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const typeInfo = getEventTypeInfo(event.type);
  const statusInfo = getEventStatusInfo(event.status);
  const TypeIcon = typeInfo.icon;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header with Breadcrumbs */}
        <PageHeader
          title={event.title}
          breadcrumbs={[
            { label: "Parent Portal", href: "/parents" },
            { label: "Events", href: "/parents/events" },
            { label: event.title },
          ]}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image Card */}
            <div className={`relative bg-white dark:bg-gray-800 rounded-2xl border ${typeInfo.borderClass} shadow-sm overflow-hidden`}>
              {/* Subtle gradient background */}
              <div className={`absolute inset-0 opacity-[0.03] bg-gradient-to-br ${typeInfo.bgClass}`} />

              {/* Event Image */}
              <div className="relative h-56 sm:h-72 md:h-80 w-full">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${typeInfo.bgClass} ${typeInfo.textClass} backdrop-blur-sm shadow-sm`}>
                    <TypeIcon className="w-3.5 h-3.5" />
                    {typeInfo.label}
                  </span>
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${statusInfo.bgClass} ${statusInfo.textClass} backdrop-blur-sm shadow-sm`}>
                    {statusInfo.label}
                  </span>
                  {event.isImportant && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-500/90 text-white backdrop-blur-sm shadow-sm">
                      <Star className="w-3.5 h-3.5" />
                      Important
                    </span>
                  )}
                </div>

                {/* Duration Badge */}
                <span className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-sm shadow-sm ${
                  event.duration === "Half Day"
                    ? "bg-blue-500/90 text-white"
                    : "bg-purple-500/90 text-white"
                }`}>
                  {event.duration}
                </span>

                {/* Title & Description overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                    {event.title}
                  </h1>
                  <p className="text-white/80 text-sm md:text-base line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Quick Info Strip */}
              <div className="relative flex flex-wrap bg-gradient-to-r from-gray-50/80 to-white dark:from-gray-800/80 dark:to-gray-800 border-t border-gray-100 dark:border-gray-700/50">
                <div className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3 border-r border-b sm:border-b-0 border-gray-100 dark:border-gray-700/50">
                  <div className={`p-2 sm:p-2.5 rounded-xl ${typeInfo.bgClass} flex-shrink-0`}>
                    <Calendar className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${typeInfo.textClass}`} />
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">Date</p>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
                      {formatShortDate(event.date)}
                      {event.endDate && <span className="font-normal text-gray-500"> - {formatShortDate(event.endDate)}</span>}
                    </p>
                  </div>
                </div>

                {event.time && (
                  <div className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3 border-r border-b sm:border-b-0 border-gray-100 dark:border-gray-700/50">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex-shrink-0">
                      <Clock className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">Time</p>
                      <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">{event.time}</p>
                    </div>
                  </div>
                )}

                {event.location && (
                  <div className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3 border-r border-b sm:border-b-0 border-gray-100 dark:border-gray-700/50">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex-shrink-0">
                      <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">Location</p>
                      <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">{event.location}</p>
                    </div>
                  </div>
                )}

                {event.organizer && (
                  <div className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex-shrink-0">
                      <Users className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">Organizer</p>
                      <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">{event.organizer}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Child-Specific Badge */}
            {event.childName && (
              <div className={`relative bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 dark:from-indigo-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 p-5 overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-200/30 dark:from-indigo-500/10 to-transparent rounded-full -mr-10 -mt-10" />
                <div className="relative flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
                    <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">This event is for</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {event.childName}
                      <span className="ml-2 text-sm font-medium text-indigo-500 dark:text-indigo-400">({event.classLevel})</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* About This Event */}
            {event.fullDescription && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700/50">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    About This Event
                  </h3>
                </div>
                <div className="p-5">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {event.fullDescription.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Schedule/Agenda */}
            {event.agenda && event.agenda.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700/50">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                      <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    Event Schedule
                  </h3>
                </div>
                <div className="p-5">
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-[52px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-purple-200 via-purple-300 to-purple-200 dark:from-purple-800/50 dark:via-purple-700/50 dark:to-purple-800/50 rounded-full" />

                    <div className="space-y-3">
                      {event.agenda.map((item, idx) => (
                        <div
                          key={idx}
                          className="group relative flex items-center gap-4 p-3 pl-0 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                        >
                          {/* Time badge */}
                          <div className="relative z-10 flex-shrink-0 w-[88px]">
                            <span className={`inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r ${typeInfo.gradientFrom} ${typeInfo.gradientTo} text-white shadow-sm`}>
                              {item.time}
                            </span>
                          </div>

                          {/* Dot */}
                          <div className="relative z-10 w-3 h-3 rounded-full bg-white dark:bg-gray-800 border-2 border-purple-400 dark:border-purple-500 flex-shrink-0 group-hover:scale-125 transition-transform" />

                          {/* Activity */}
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                            {item.activity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
              <div className="space-y-3">
                {reminderSet ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-700/50">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md">
                        <BellRing className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Reminder Set</span>
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
                          {getReminderLabel(reminderSet)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowReminderModal(true)}
                      className="w-full text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors py-1"
                    >
                      Change reminder
                    </button>
                  </div>
                ) : (
                  <Button
                    className={`w-full gap-2 bg-gradient-to-r ${typeInfo.gradientFrom} ${typeInfo.gradientTo} hover:opacity-90 text-white shadow-sm`}
                    onClick={() => setShowReminderModal(true)}
                  >
                    <Bell className="w-4 h-4" />
                    Set Reminder
                  </Button>
                )}
                {/* Share button - only show for public events (no childId) */}
                {event.childId ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-600/30">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-600/50 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Personal Event</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">This event cannot be shared</p>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => setShowShareModal(true)}
                  >
                    <Share2 className="w-4 h-4" />
                    Share Event
                  </Button>
                )}
              </div>
            </div>

            {/* Requirements Card */}
            {event.requirements && event.requirements.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700/50 bg-gradient-to-r from-emerald-50/50 to-white dark:from-emerald-900/10 dark:to-gray-800">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Requirements
                  </h3>
                </div>
                <div className="p-4">
                  <ul className="space-y-3">
                    {event.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-3 group">
                        <div className="mt-0.5 p-1 rounded-md bg-emerald-50 dark:bg-emerald-900/20 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Contact Information Card */}
            {(event.contactPerson || event.contactPhone) && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-900/10 dark:to-gray-800">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-500" />
                    Contact Information
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {event.contactPerson && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">Contact Person</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{event.contactPerson}</p>
                      </div>
                    </div>
                  )}
                  {event.contactPhone && (
                    <a
                      href={`tel:${event.contactPhone}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                        <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">Phone</p>
                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">{event.contactPhone}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Help Section */}
            <div className="bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-blue-900/10 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                  <Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Need Help?</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    If you have any questions about this event, please contact the organizer or reach out to the school administration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Set Reminder Modal */}
      <SetReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        event={{
          title: event.title,
          date: event.date,
          time: event.time,
          location: event.location,
        }}
        onSetReminder={handleSetReminder}
      />

      {/* Share Event Modal */}
      <ShareEventModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        event={{
          title: event.title,
          description: event.description,
          date: event.date,
          endDate: event.endDate,
          time: event.time,
          location: event.location,
          image: event.image,
        }}
      />
    </MainLayout>
  );
}
