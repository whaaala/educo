"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import DashboardPage from "@/components/shared/DashboardPage";
import ScheduleMeetingModal, {
  ScheduledMeetingData,
  MeetingChildReference,
  MeetingParticipant,
} from "@/components/shared/ScheduleMeetingModal";
import MeetingDetailsModal, { MeetingDetails, RescheduleMeetingData } from "@/components/shared/MeetingDetailsModal";
import { useMeetings, Meeting as ContextMeeting, MeetingPlatform as ContextPlatform } from "@/contexts/MeetingsContext";
import { useCall } from "@/hooks/useCall";
import {
  Video,
  Phone,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  Plus,
  Search,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  PhoneCall,
  VideoIcon,
  Eye,
  MessageSquare,
} from "lucide-react";

// Platform icons
const ZoomIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M4.585 7.6c-.4.3-.585.8-.585 1.4v6c0 .6.185 1.1.585 1.4.4.3.9.4 1.415.4h9c1.1 0 2-.9 2-2v-2l4 3v-8l-4 3V9c0-1.1-.9-2-2-2h-9c-.515 0-1.015.1-1.415.4z"/>
  </svg>
);

const GoogleMeetIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    <path d="M17 12l-3-2.5v5z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Educo Meet Icon (custom school platform with graduation cap)
const EducoMeetIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
  </svg>
);

// ============================================
// TYPES
// ============================================

type MeetingPlatform = "zoom" | "google-meet" | "whatsapp-video" | "whatsapp-voice" | "educo-meet";
type MeetingStatus = "scheduled" | "in-progress" | "completed" | "cancelled";

interface Meeting {
  id: string;
  title: string;
  description: string;
  platform: MeetingPlatform;
  hostName: string;
  hostRole: string;
  hostPhoto: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // in minutes
  status: MeetingStatus;
  meetingLink?: string;
  meetingId?: string;
  passcode?: string;
  childName?: string;
  participants?: number;
}

// ============================================
// MOCK DATA
// ============================================

// Mock parent data (simulating logged-in parent)
const MOCK_PARENT: MeetingParticipant = {
  id: "parent-001",
  name: "Mr. & Mrs. Okonkwo",
  type: "parent",
  role: "Parent",
  email: "okonkwo.family@email.com",
  photo: "https://i.pravatar.cc/150?u=parent-okonkwo",
};

// Mock children data
const MOCK_CHILDREN: MeetingChildReference[] = [
  { id: "std-001", name: "Adaeze Okonkwo", classLevel: "SS 2" },
  { id: "std-002", name: "Chukwuemeka Okonkwo", classLevel: "JSS 3" },
];

// Available teachers for meeting requests
const AVAILABLE_TEACHERS: MeetingParticipant[] = [
  { id: "tch-001", name: "Mrs. Nkechi Eze", type: "teacher", role: "Class Teacher", photo: "https://i.pravatar.cc/150?u=teacher-nkechi" },
  { id: "tch-002", name: "Mr. Chidi Okoro", type: "teacher", role: "Chemistry Teacher", photo: "https://i.pravatar.cc/150?u=teacher-chidi" },
  { id: "tch-003", name: "Mr. Tunde Adeyemi", type: "teacher", role: "Mathematics Teacher", photo: "https://i.pravatar.cc/150?u=teacher-tunde" },
  { id: "tch-004", name: "Coach Emeka", type: "teacher", role: "Physical Education", photo: "https://i.pravatar.cc/150?u=coach-emeka" },
  { id: "tch-005", name: "Dr. Amaka Obi", type: "teacher", role: "Principal", photo: "https://i.pravatar.cc/150?u=principal" },
  { id: "tch-006", name: "Mrs. Funke Adeleke", type: "teacher", role: "Academic Counselor", photo: "https://i.pravatar.cc/150?u=counselor-funke" },
  { id: "tch-007", name: "Mrs. Ada Nwosu", type: "teacher", role: "Science Teacher", photo: "https://i.pravatar.cc/150?u=teacher-ada" },
];

const MOCK_MEETINGS: Meeting[] = [
  {
    id: "meet-001",
    title: "Parent-Teacher Conference",
    description: "Discuss Adaeze's academic progress and areas for improvement",
    platform: "zoom",
    hostName: "Mrs. Nkechi Eze",
    hostRole: "Class Teacher",
    hostPhoto: "https://i.pravatar.cc/150?u=teacher-nkechi",
    scheduledDate: "2024-01-25",
    scheduledTime: "10:00 AM",
    duration: 30,
    status: "scheduled",
    meetingLink: "https://zoom.us/j/1234567890",
    meetingId: "123 456 7890",
    passcode: "abc123",
    childName: "Adaeze Okonkwo",
    participants: 2,
  },
  {
    id: "meet-002",
    title: "Chemistry Lab Discussion",
    description: "Review lab safety and upcoming experiments",
    platform: "google-meet",
    hostName: "Mr. Chidi Okoro",
    hostRole: "Chemistry Teacher",
    hostPhoto: "https://i.pravatar.cc/150?u=teacher-chidi",
    scheduledDate: "2024-01-26",
    scheduledTime: "2:00 PM",
    duration: 45,
    status: "scheduled",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    childName: "Chukwuemeka Okonkwo",
    participants: 3,
  },
  {
    id: "meet-003",
    title: "Quick Check-in Call",
    description: "Follow up on homework submission",
    platform: "whatsapp-voice",
    hostName: "Mr. Tunde Adeyemi",
    hostRole: "Mathematics Teacher",
    hostPhoto: "https://i.pravatar.cc/150?u=teacher-tunde",
    scheduledDate: "2024-01-24",
    scheduledTime: "4:30 PM",
    duration: 15,
    status: "completed",
    childName: "Adaeze Okonkwo",
  },
  {
    id: "meet-004",
    title: "Sports Day Planning",
    description: "Discuss student participation in upcoming sports day",
    platform: "whatsapp-video",
    hostName: "Coach Emeka",
    hostRole: "Physical Education",
    hostPhoto: "https://i.pravatar.cc/150?u=coach-emeka",
    scheduledDate: "2024-01-27",
    scheduledTime: "11:00 AM",
    duration: 20,
    status: "scheduled",
    childName: "Chukwuemeka Okonkwo",
  },
  {
    id: "meet-005",
    title: "Term Review Meeting",
    description: "End of term performance review with principal",
    platform: "zoom",
    hostName: "Dr. Amaka Obi",
    hostRole: "Principal",
    hostPhoto: "https://i.pravatar.cc/150?u=principal",
    scheduledDate: "2024-01-20",
    scheduledTime: "9:00 AM",
    duration: 60,
    status: "completed",
    meetingLink: "https://zoom.us/j/9876543210",
    meetingId: "987 654 3210",
    childName: "Adaeze Okonkwo",
    participants: 4,
  },
  {
    id: "meet-007",
    title: "Academic Counseling Session",
    description: "Discuss career guidance and subject selection for next term",
    platform: "educo-meet",
    hostName: "Mrs. Funke Adeleke",
    hostRole: "Academic Counselor",
    hostPhoto: "https://i.pravatar.cc/150?u=counselor-funke",
    scheduledDate: "2024-01-28",
    scheduledTime: "3:00 PM",
    duration: 40,
    status: "scheduled",
    meetingLink: "/meetings/room/educo-meet-abc123",
    childName: "Adaeze Okonkwo",
    participants: 2,
  },
  {
    id: "meet-006",
    title: "Cancelled - Science Fair Planning",
    description: "Was scheduled to discuss science fair project",
    platform: "google-meet",
    hostName: "Mrs. Ada Nwosu",
    hostRole: "Science Teacher",
    hostPhoto: "https://i.pravatar.cc/150?u=teacher-ada",
    scheduledDate: "2024-01-22",
    scheduledTime: "3:00 PM",
    duration: 30,
    status: "cancelled",
    childName: "Adaeze Okonkwo",
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

function getPlatformInfo(platform: MeetingPlatform) {
  switch (platform) {
    case "zoom":
      return {
        name: "Zoom",
        icon: <ZoomIcon />,
        color: "blue",
        bgClass: "bg-blue-50 dark:bg-blue-900/30",
        textClass: "text-blue-600 dark:text-blue-400",
        borderClass: "border-blue-200 dark:border-blue-700/30",
      };
    case "google-meet":
      return {
        name: "Google Meet",
        icon: <GoogleMeetIcon />,
        color: "green",
        bgClass: "bg-green-50 dark:bg-green-900/30",
        textClass: "text-green-600 dark:text-green-400",
        borderClass: "border-green-200 dark:border-green-700/30",
      };
    case "whatsapp-video":
      return {
        name: "WhatsApp Video",
        icon: <WhatsAppIcon />,
        color: "emerald",
        bgClass: "bg-emerald-50 dark:bg-emerald-900/30",
        textClass: "text-emerald-600 dark:text-emerald-400",
        borderClass: "border-emerald-200 dark:border-emerald-700/30",
      };
    case "whatsapp-voice":
      return {
        name: "WhatsApp Call",
        icon: <WhatsAppIcon />,
        color: "emerald",
        bgClass: "bg-emerald-50 dark:bg-emerald-900/30",
        textClass: "text-emerald-600 dark:text-emerald-400",
        borderClass: "border-emerald-200 dark:border-emerald-700/30",
      };
    case "educo-meet":
      return {
        name: "Educo Meet",
        icon: <EducoMeetIcon />,
        color: "indigo",
        bgClass: "bg-indigo-50 dark:bg-indigo-900/30",
        textClass: "text-indigo-600 dark:text-indigo-400",
        borderClass: "border-indigo-200 dark:border-indigo-700/30",
      };
  }
}

function getStatusInfo(status: MeetingStatus) {
  switch (status) {
    case "scheduled":
      return {
        label: "Scheduled",
        icon: <Clock className="w-3.5 h-3.5" />,
        bgClass: "bg-blue-100 dark:bg-blue-900/40",
        textClass: "text-blue-700 dark:text-blue-300",
      };
    case "in-progress":
      return {
        label: "In Progress",
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        bgClass: "bg-green-100 dark:bg-green-900/40",
        textClass: "text-green-700 dark:text-green-300",
      };
    case "completed":
      return {
        label: "Completed",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        bgClass: "bg-gray-100 dark:bg-gray-700/40",
        textClass: "text-gray-600 dark:text-gray-400",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        icon: <XCircle className="w-3.5 h-3.5" />,
        bgClass: "bg-red-100 dark:bg-red-900/40",
        textClass: "text-red-700 dark:text-red-300",
      };
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  }
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

// ============================================
// COMPONENT
// ============================================

export default function ParentMeetingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<MeetingPlatform | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<MeetingStatus | "all">("all");
  const [isRequestMeetingModalOpen, setIsRequestMeetingModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingDetails | null>(null);
  const [isMeetingDetailsModalOpen, setIsMeetingDetailsModalOpen] = useState(false);

  // Use the call hook for WebRTC calls
  const { startVideoCall, startVoiceCall, startChat, startCall } = useCall();

  // Use the meetings context
  const { meetings: contextMeetings, addMeeting, getMeetingsByParent, rescheduleMeeting, acceptMeeting } = useMeetings();

  // Get meetings for this parent (using MOCK_PARENT.id)
  const parentMeetings = useMemo(() => {
    return getMeetingsByParent(MOCK_PARENT.id);
  }, [contextMeetings, getMeetingsByParent]);

  // Convert context meetings to local Meeting format for display
  const meetings: Meeting[] = useMemo(() => {
    return parentMeetings.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description || "",
      platform: (m.platform === "in-person" ? "educo-meet" : m.platform) as MeetingPlatform,
      hostName: m.teacherName,
      hostRole: m.teacherRole || "Staff",
      hostPhoto: m.teacherPhoto || `https://i.pravatar.cc/150?u=${m.teacherId}`,
      scheduledDate: m.scheduledDate,
      scheduledTime: formatTime24to12(m.scheduledTime),
      duration: m.duration,
      status: (m.status === "pending_approval" ? "scheduled" : m.status) as MeetingStatus,
      meetingLink: m.meetingLink,
      meetingId: m.meetingId,
      passcode: m.passcode,
      childName: m.childName,
      participants: 2,
    }));
  }, [parentMeetings]);

  // Helper to format time from 24h to 12h
  function formatTime24to12(time24: string): string {
    if (!time24 || time24.includes("AM") || time24.includes("PM")) return time24;
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }

  // Handle scheduling a new meeting
  const handleScheduleMeeting = (meetingData: ScheduledMeetingData) => {
    // Find the teacher info
    const teacher = AVAILABLE_TEACHERS.find((t) => t.id === meetingData.teacherId);

    // Add meeting via context
    addMeeting({
      title: meetingData.subject,
      description: meetingData.notes,
      meetingType: meetingData.meetingType === "custom" ? "scheduled" : meetingData.meetingType,
      customMeetingType: meetingData.customMeetingType,
      meetingFormat: meetingData.meetingFormat,
      virtualType: meetingData.virtualType,
      scheduledDate: meetingData.date,
      scheduledTime: meetingData.time,
      duration: meetingData.duration,
      location: meetingData.location,
      meetingLink: meetingData.meetingLink,
      parentId: MOCK_PARENT.id,
      parentName: MOCK_PARENT.name,
      childId: meetingData.childId,
      childName: meetingData.childName,
      childClass: meetingData.childClass,
      teacherId: meetingData.teacherId || "",
      teacherName: teacher?.name || meetingData.teacherName || "Teacher",
      teacherRole: teacher?.role || meetingData.teacherRole,
      teacherPhoto: teacher?.photo,
      requestedBy: "parent",
      requestedByName: MOCK_PARENT.name,
      notes: meetingData.notes,
    });

    setIsRequestMeetingModalOpen(false);
  };

  // Filter meetings
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.childName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === "all" || meeting.platform === selectedPlatform;
    const matchesStatus = selectedStatus === "all" || meeting.status === selectedStatus;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  // Group meetings by status
  const upcomingMeetings = filteredMeetings.filter((m) => m.status === "scheduled" || m.status === "in-progress");
  const pastMeetings = filteredMeetings.filter((m) => m.status === "completed" || m.status === "cancelled");

  // Helper to start a WebRTC call for a meeting
  const handleStartMeetingCall = (meeting: Meeting, callType: "video" | "voice" | "chat") => {
    const teacherParticipant = {
      id: `teacher-${meeting.hostName.replace(/\s/g, "-").toLowerCase()}`,
      name: meeting.hostName,
      avatar: meeting.hostPhoto,
      role: meeting.hostRole,
    };

    const roomId = `meeting-${meeting.id}`;
    const callContext = `${meeting.title} - ${meeting.childName || "Meeting"}`;

    if (callType === "video") {
      startVideoCall(teacherParticipant, { roomId, callContext });
    } else if (callType === "voice") {
      startVoiceCall(teacherParticipant, { roomId, callContext });
    } else {
      startChat(teacherParticipant, { roomId, callContext });
    }
  };

  // Start a quick call with a teacher (not tied to specific meeting)
  const handleQuickCall = (callType: "video" | "voice" | "chat") => {
    // Default to first available teacher for quick calls
    const teacher = AVAILABLE_TEACHERS[0];
    if (!teacher) return;

    const teacherParticipant = {
      id: teacher.id,
      name: teacher.name,
      avatar: teacher.photo,
      role: teacher.role,
    };

    const roomId = `quick-call-${Date.now()}`;
    const callContext = `Quick ${callType === "video" ? "Video" : callType === "voice" ? "Voice" : "Chat"} with ${teacher.name}`;

    if (callType === "video") {
      startVideoCall(teacherParticipant, { roomId, callContext });
    } else if (callType === "voice") {
      startVoiceCall(teacherParticipant, { roomId, callContext });
    } else {
      startChat(teacherParticipant, { roomId, callContext });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Open meeting details modal
  const handleViewMeetingDetails = (meeting: Meeting) => {
    // Find the original meeting from context to get notes and outcome
    const originalMeeting = parentMeetings.find(m => m.id === meeting.id);

    const meetingDetails: MeetingDetails = {
      id: meeting.id,
      title: meeting.title,
      description: meeting.description,
      platform: meeting.platform,
      hostName: meeting.hostName,
      hostRole: meeting.hostRole,
      hostPhoto: meeting.hostPhoto,
      childName: meeting.childName,
      scheduledDate: meeting.scheduledDate,
      scheduledTime: meeting.scheduledTime,
      duration: meeting.duration,
      status: originalMeeting?.status === "pending_approval" ? "pending_approval" : meeting.status,
      meetingLink: meeting.meetingLink,
      meetingId: meeting.meetingId,
      passcode: meeting.passcode,
      notes: originalMeeting?.notes,
      outcome: originalMeeting?.outcome,
      cancellationReason: originalMeeting?.cancellationReason,
      cancelledBy: originalMeeting?.cancelledBy,
      cancelledByName: originalMeeting?.cancelledByName,
      cancelledAt: originalMeeting?.cancelledAt,
    };
    setSelectedMeeting(meetingDetails);
    setIsMeetingDetailsModalOpen(true);
  };

  // Handle reschedule request (parents can request reschedule)
  const handleRescheduleMeeting = (meetingId: string, data: RescheduleMeetingData) => {
    rescheduleMeeting(meetingId, {
      newDate: data.newDate,
      newTime: data.newTime,
      reason: data.reason,
      requestedBy: "parent",
      requestedByName: MOCK_PARENT.name,
    });
  };

  // Handle accept meeting
  const handleAcceptMeeting = (meetingId: string) => {
    acceptMeeting(meetingId);
  };

  return (
    <DashboardPage
      title="Video Calls & Meetings"
      description="Schedule and join video calls with teachers via Zoom, Google Meet, or WhatsApp"
      breadcrumbs={[
        { label: "Parent Portal", href: "/parents" },
        { label: "Meetings", isActive: true },
      ]}
      loadingText="Loading Meetings"
      afterStats={
        <div className="space-y-6 transition-opacity duration-500">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end gap-4">

          {/* Schedule Meeting Button */}
          <button
            onClick={() => setIsRequestMeetingModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Request Meeting
          </button>
        </div>

        {/* Quick Actions - Communication Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Educo Meet - Video Call */}
          <button
            onClick={() => handleQuickCall("video")}
            className="group flex items-center gap-4 p-4 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-800 rounded-2xl border border-indigo-100 dark:border-indigo-700/30 shadow-sm hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600/50 transition-all duration-200"
          >
            <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Video Call</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Start video meeting</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
          </button>

          {/* Voice Call */}
          <button
            onClick={() => handleQuickCall("voice")}
            className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-600/50 transition-all duration-200"
          >
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Voice Call</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Start audio call</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </button>

          {/* Chat */}
          <button
            onClick={() => handleQuickCall("chat")}
            className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600/50 transition-all duration-200"
          >
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Chat</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Send instant message</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
          </button>

          {/* WhatsApp (External) */}
          <button className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-600/50 transition-all duration-200">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <WhatsAppIcon />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">WhatsApp</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">External messaging</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search meetings, teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Platform Filter */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value as MeetingPlatform | "all")}
            className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Platforms</option>
            <option value="educo-meet">Educo Meet</option>
            <option value="zoom">Zoom</option>
            <option value="google-meet">Google Meet</option>
            <option value="whatsapp-video">WhatsApp Video</option>
            <option value="whatsapp-voice">WhatsApp Call</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as MeetingStatus | "all")}
            className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Upcoming Meetings */}
        {upcomingMeetings.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Upcoming Meetings
              <span className="text-xs font-semibold text-white bg-blue-600 px-2 py-0.5 rounded-full">
                {upcomingMeetings.length}
              </span>
            </h2>

            <div className="grid gap-4">
              {upcomingMeetings.map((meeting) => {
                const platformInfo = getPlatformInfo(meeting.platform);
                const statusInfo = getStatusInfo(meeting.status);

                return (
                  <div
                    key={meeting.id}
                    className={`group bg-white dark:bg-gray-800 rounded-2xl border ${platformInfo.borderClass} shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden`}
                  >
                    <div className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Host Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-white dark:ring-gray-700 shadow-md">
                              <Image
                                src={meeting.hostPhoto}
                                alt={meeting.hostName}
                                width={56}
                                height={56}
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-lg ${platformInfo.bgClass} ${platformInfo.textClass} shadow-sm`}>
                              {meeting.platform.includes("whatsapp") ? (
                                meeting.platform === "whatsapp-video" ? <Video className="w-3 h-3" /> : <Phone className="w-3 h-3" />
                              ) : (
                                platformInfo.icon
                              )}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900 dark:text-white truncate">{meeting.title}</h3>
                              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${statusInfo.bgClass} ${statusInfo.textClass}`}>
                                {statusInfo.icon}
                                {statusInfo.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{meeting.description}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                {meeting.hostName} • {meeting.hostRole}
                              </span>
                              {meeting.childName && (
                                <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 font-medium">
                                  {meeting.childName}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Meeting Time & Actions */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="text-left sm:text-right">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{formatDate(meeting.scheduledDate)}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {meeting.scheduledTime} • {meeting.duration} min
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Educo Meet - Use WebRTC */}
                            {meeting.platform === "educo-meet" && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleStartMeetingCall(meeting, "video")}
                                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25"
                                >
                                  <Video className="w-4 h-4" />
                                  Video
                                </button>
                                <button
                                  onClick={() => handleStartMeetingCall(meeting, "voice")}
                                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
                                >
                                  <Phone className="w-4 h-4" />
                                  Voice
                                </button>
                                <button
                                  onClick={() => handleStartMeetingCall(meeting, "chat")}
                                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-500/25"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                            {/* External platforms - Open link */}
                            {meeting.meetingLink && meeting.platform !== "educo-meet" && !meeting.platform.includes("whatsapp") && (
                              <a
                                href={meeting.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 ${
                                  meeting.platform === "zoom"
                                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25"
                                    : meeting.platform === "google-meet"
                                    ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/25"
                                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25"
                                }`}
                              >
                                <Video className="w-4 h-4" />
                                Join Now
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {/* WhatsApp - Use WebRTC for now */}
                            {meeting.platform.includes("whatsapp") && (
                              <button
                                onClick={() => handleStartMeetingCall(meeting, meeting.platform === "whatsapp-video" ? "video" : "voice")}
                                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:-translate-y-0.5"
                              >
                                {meeting.platform === "whatsapp-video" ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                                {meeting.platform === "whatsapp-video" ? "Video Call" : "Voice Call"}
                              </button>
                            )}
                            {/* View Details button for upcoming meetings */}
                            <button
                              onClick={() => handleViewMeetingDetails(meeting)}
                              className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              Details
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Meeting Details (Zoom/Meet ID & Passcode) */}
                      {(meeting.meetingId || meeting.passcode) && (
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex flex-wrap gap-4">
                            {meeting.meetingId && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Meeting ID:</span>
                                <span className="text-xs font-mono font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                  {meeting.meetingId}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(meeting.meetingId!.replace(/\s/g, ""))}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                >
                                  <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                                </button>
                              </div>
                            )}
                            {meeting.passcode && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Passcode:</span>
                                <span className="text-xs font-mono font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                  {meeting.passcode}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(meeting.passcode!)}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                >
                                  <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Past Meetings */}
        {pastMeetings.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              Past Meetings
              <span className="text-xs font-semibold text-gray-600 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                {pastMeetings.length}
              </span>
            </h2>

            <div className="grid gap-3">
              {pastMeetings.map((meeting) => {
                const platformInfo = getPlatformInfo(meeting.platform);
                const statusInfo = getStatusInfo(meeting.status);

                return (
                  <div
                    key={meeting.id}
                    className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 p-4 opacity-75 hover:opacity-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-lg overflow-hidden">
                          <Image
                            src={meeting.hostPhoto}
                            alt={meeting.hostName}
                            width={40}
                            height={40}
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 p-1 rounded ${platformInfo.bgClass} ${platformInfo.textClass}`}>
                          {meeting.platform.includes("whatsapp") ? (
                            <Phone className="w-2.5 h-2.5" />
                          ) : (
                            <Video className="w-2.5 h-2.5" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm truncate">{meeting.title}</h3>
                          <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${statusInfo.bgClass} ${statusInfo.textClass}`}>
                            {statusInfo.icon}
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {meeting.hostName} • {formatDate(meeting.scheduledDate)} at {meeting.scheduledTime}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-semibold ${platformInfo.bgClass} ${platformInfo.textClass}`}>
                          {platformInfo.name}
                        </span>
                        <button
                          onClick={() => handleViewMeetingDetails(meeting)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredMeetings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Video className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No meetings found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery || selectedPlatform !== "all" || selectedStatus !== "all"
                ? "Try adjusting your filters"
                : "You don't have any scheduled meetings yet"}
            </p>
            <button
              onClick={() => setIsRequestMeetingModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Request a Meeting
            </button>
          </div>
        )}

        {/* Request Meeting Modal */}
        <ScheduleMeetingModal
          isOpen={isRequestMeetingModalOpen}
          onClose={() => setIsRequestMeetingModalOpen(false)}
          onSchedule={handleScheduleMeeting}
          context="parent"
          primaryParticipant={MOCK_PARENT}
          children={MOCK_CHILDREN}
          availableTeachers={AVAILABLE_TEACHERS}
        />

        {/* Meeting Details Modal */}
        <MeetingDetailsModal
          isOpen={isMeetingDetailsModalOpen}
          onClose={() => {
            setIsMeetingDetailsModalOpen(false);
            setSelectedMeeting(null);
          }}
          meeting={selectedMeeting}
          viewContext="parent"
          currentUserName={MOCK_PARENT.name}
          onReschedule={handleRescheduleMeeting}
          onAccept={handleAcceptMeeting}
        />
        </div>
      }
    />
  );
}
