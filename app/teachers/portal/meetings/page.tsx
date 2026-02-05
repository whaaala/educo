"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { DashboardPage } from "@/components/pages";
import { useMeetings, Meeting as ContextMeeting } from "@/contexts/MeetingsContext";
import { useCall } from "@/hooks/useCall";
import ScheduleMeetingModal, {
  ScheduledMeetingData,
  MeetingChildReference,
  MeetingParticipant,
} from "@/components/shared/ScheduleMeetingModal";
import MeetingDetailsModal, { MeetingDetails, CancelMeetingData, RescheduleMeetingData, AdditionalParticipant } from "@/components/shared/MeetingDetailsModal";
import {
  Video,
  Phone,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  User,
  GraduationCap,
  Eye,
  MessageSquare,
} from "lucide-react";

// Platform icons
const ZoomIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M4.585 7.6c-.4.3-.585.8-.585 1.4v6c0 .6.185 1.1.585 1.4.4.3.9.4 1.415.4h9c1.1 0 2-.9 2-2v-2l4 3v-8l-4 3V9c0-1.1-.9-2-2-2h-9c-.515 0-1.015.1-1.415.4z" />
  </svg>
);

const GoogleMeetIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <path d="M17 12l-3-2.5v5z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const EducoMeetIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
  </svg>
);

// Types
type MeetingPlatform = "zoom" | "google-meet" | "whatsapp-video" | "whatsapp-voice" | "educo-meet" | "in-person";
type MeetingStatus = "scheduled" | "in-progress" | "completed" | "cancelled" | "pending_approval";

// Extended student type with parent reference (for internal use)
interface StudentWithParent extends MeetingChildReference {
  parentId: string;
}

interface DisplayMeeting {
  id: string;
  title: string;
  description: string;
  platform: MeetingPlatform;
  parentName: string;
  parentPhoto: string;
  childName?: string;
  childClass?: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  status: MeetingStatus;
  meetingLink?: string;
  meetingId?: string;
  passcode?: string;
  requestedBy: "parent" | "teacher" | "admin";
  location: string;
}

// Mock teacher data (simulating logged-in teacher)
const MOCK_TEACHER: MeetingParticipant = {
  id: "tch-001",
  name: "Mrs. Nkechi Eze",
  type: "teacher",
  role: "Class Teacher",
  email: "nkechi.eze@school.edu",
  photo: "https://i.pravatar.cc/150?u=teacher-nkechi",
};

// Available parents for meeting requests
const AVAILABLE_PARENTS: MeetingParticipant[] = [
  { id: "parent-001", name: "Mr. & Mrs. Okonkwo", type: "parent", role: "Parent", photo: "https://i.pravatar.cc/150?u=parent-okonkwo" },
  { id: "parent-002", name: "Mrs. Adaora Nnamdi", type: "parent", role: "Parent", photo: "https://i.pravatar.cc/150?u=parent-adaora" },
  { id: "parent-003", name: "Mr. Chinedu Eze", type: "parent", role: "Parent", photo: "https://i.pravatar.cc/150?u=parent-chinedu" },
];

// Mock children data (students in teacher's classes) - with parent reference for internal lookup
const MOCK_STUDENTS_WITH_PARENTS: StudentWithParent[] = [
  { id: "std-001", name: "Adaeze Okonkwo", classLevel: "SS 2", parentId: "parent-001" },
  { id: "std-002", name: "Chukwuemeka Okonkwo", classLevel: "JSS 3", parentId: "parent-001" },
  { id: "std-003", name: "Chidera Nnamdi", classLevel: "SS 1", parentId: "parent-002" },
  { id: "std-004", name: "Obinna Eze", classLevel: "SS 2", parentId: "parent-003" },
];

// Students for the modal (without parentId as it's not in the type)
const MOCK_STUDENTS: MeetingChildReference[] = MOCK_STUDENTS_WITH_PARENTS.map(({ id, name, classLevel }) => ({
  id,
  name,
  classLevel,
}));

// Available staff that can be invited to meetings
const AVAILABLE_STAFF: AdditionalParticipant[] = [
  { id: "tch-002", name: "Mr. Chidi Okoro", role: "Chemistry Teacher", type: "teacher", photo: "https://i.pravatar.cc/150?u=teacher-chidi" },
  { id: "tch-003", name: "Mr. Tunde Adeyemi", role: "Mathematics Teacher", type: "teacher", photo: "https://i.pravatar.cc/150?u=teacher-tunde" },
  { id: "tch-004", name: "Coach Emeka", role: "Physical Education", type: "teacher", photo: "https://i.pravatar.cc/150?u=coach-emeka" },
  { id: "tch-005", name: "Dr. Amaka Obi", role: "Principal", type: "admin", photo: "https://i.pravatar.cc/150?u=principal" },
  { id: "tch-006", name: "Mrs. Funke Adeleke", role: "Academic Counselor", type: "counselor", photo: "https://i.pravatar.cc/150?u=counselor-funke" },
  { id: "tch-007", name: "Mrs. Ada Nwosu", role: "Science Teacher", type: "teacher", photo: "https://i.pravatar.cc/150?u=teacher-ada" },
  { id: "admin-001", name: "Mr. James Okafor", role: "Vice Principal", type: "admin", photo: "https://i.pravatar.cc/150?u=admin-james" },
];

// Helper functions
function getPlatformInfo(platform: MeetingPlatform) {
  switch (platform) {
    case "zoom":
      return {
        name: "Zoom",
        icon: <ZoomIcon />,
        bgClass: "bg-blue-50 dark:bg-blue-900/30",
        textClass: "text-blue-600 dark:text-blue-400",
        borderClass: "border-blue-200 dark:border-blue-700/30",
      };
    case "google-meet":
      return {
        name: "Google Meet",
        icon: <GoogleMeetIcon />,
        bgClass: "bg-green-50 dark:bg-green-900/30",
        textClass: "text-green-600 dark:text-green-400",
        borderClass: "border-green-200 dark:border-green-700/30",
      };
    case "whatsapp-video":
      return {
        name: "WhatsApp Video",
        icon: <WhatsAppIcon />,
        bgClass: "bg-emerald-50 dark:bg-emerald-900/30",
        textClass: "text-emerald-600 dark:text-emerald-400",
        borderClass: "border-emerald-200 dark:border-emerald-700/30",
      };
    case "whatsapp-voice":
      return {
        name: "WhatsApp Call",
        icon: <WhatsAppIcon />,
        bgClass: "bg-emerald-50 dark:bg-emerald-900/30",
        textClass: "text-emerald-600 dark:text-emerald-400",
        borderClass: "border-emerald-200 dark:border-emerald-700/30",
      };
    case "educo-meet":
      return {
        name: "Educo Meet",
        icon: <EducoMeetIcon />,
        bgClass: "bg-indigo-50 dark:bg-indigo-900/30",
        textClass: "text-indigo-600 dark:text-indigo-400",
        borderClass: "border-indigo-200 dark:border-indigo-700/30",
      };
    case "in-person":
      return {
        name: "In Person",
        icon: <Users />,
        bgClass: "bg-gray-50 dark:bg-gray-900/30",
        textClass: "text-gray-600 dark:text-gray-400",
        borderClass: "border-gray-200 dark:border-gray-700/30",
      };
    default:
      return {
        name: "Meeting",
        icon: <Video />,
        bgClass: "bg-gray-50 dark:bg-gray-900/30",
        textClass: "text-gray-600 dark:text-gray-400",
        borderClass: "border-gray-200 dark:border-gray-700/30",
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
    case "pending_approval":
      return {
        label: "Pending",
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        bgClass: "bg-orange-100 dark:bg-orange-900/40",
        textClass: "text-orange-700 dark:text-orange-300",
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
    default:
      return {
        label: status,
        icon: <Clock className="w-3.5 h-3.5" />,
        bgClass: "bg-gray-100 dark:bg-gray-700/40",
        textClass: "text-gray-600 dark:text-gray-400",
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

function formatTime24to12(time24: string): string {
  if (!time24 || time24.includes("AM") || time24.includes("PM")) return time24;
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export default function TeacherMeetingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<MeetingPlatform | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<MeetingStatus | "all">("all");
  const [isScheduleMeetingModalOpen, setIsScheduleMeetingModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingDetails | null>(null);
  const [isMeetingDetailsModalOpen, setIsMeetingDetailsModalOpen] = useState(false);

  // Use the call hook for WebRTC calls
  const { startVideoCall, startVoiceCall, startChat } = useCall();

  // Use the meetings context
  const { meetings: contextMeetings, addMeeting, getMeetingsByTeacher, updateMeeting, cancelMeeting, rescheduleMeeting, acceptMeeting, inviteParticipant, removeParticipant } = useMeetings();

  // Get meetings for this teacher
  const teacherMeetings = useMemo(() => {
    return getMeetingsByTeacher(MOCK_TEACHER.id);
  }, [contextMeetings, getMeetingsByTeacher]);

  // Convert context meetings to display format
  const meetings: DisplayMeeting[] = useMemo(() => {
    return teacherMeetings.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description || "",
      platform: m.platform,
      parentName: m.parentName,
      parentPhoto: `https://i.pravatar.cc/150?u=${m.parentId}`,
      childName: m.childName,
      childClass: m.childClass,
      scheduledDate: m.scheduledDate,
      scheduledTime: formatTime24to12(m.scheduledTime),
      duration: m.duration,
      status: m.status,
      meetingLink: m.meetingLink,
      meetingId: m.meetingId,
      passcode: m.passcode,
      requestedBy: m.requestedBy,
      location: m.location,
    }));
  }, [teacherMeetings]);

  // Handle scheduling a new meeting
  const handleScheduleMeeting = (meetingData: ScheduledMeetingData) => {
    // Find the parent info based on selected child (use the extended type with parentId)
    const selectedChild = MOCK_STUDENTS_WITH_PARENTS.find((s) => s.id === meetingData.childId);
    const parent = AVAILABLE_PARENTS.find((p) => p.id === selectedChild?.parentId);

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
      parentId: parent?.id || selectedChild?.parentId || "",
      parentName: parent?.name || "Parent",
      childId: meetingData.childId,
      childName: meetingData.childName,
      childClass: meetingData.childClass,
      teacherId: MOCK_TEACHER.id,
      teacherName: MOCK_TEACHER.name,
      teacherRole: MOCK_TEACHER.role,
      teacherPhoto: MOCK_TEACHER.photo,
      requestedBy: "teacher",
      requestedByName: MOCK_TEACHER.name,
      notes: meetingData.notes,
    });

    setIsScheduleMeetingModalOpen(false);
  };

  // Filter meetings
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.childName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === "all" || meeting.platform === selectedPlatform;
    const matchesStatus = selectedStatus === "all" || meeting.status === selectedStatus;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  // Group meetings by status
  const upcomingMeetings = filteredMeetings.filter(
    (m) => m.status === "scheduled" || m.status === "in-progress" || m.status === "pending_approval"
  );
  const pastMeetings = filteredMeetings.filter((m) => m.status === "completed" || m.status === "cancelled");

  // Helper to start a WebRTC call for a meeting
  const handleStartMeetingCall = (meeting: DisplayMeeting, callType: "video" | "voice" | "chat") => {
    const parentParticipant = {
      id: `parent-${meeting.parentName.replace(/\s/g, "-").toLowerCase()}`,
      name: meeting.parentName,
      avatar: meeting.parentPhoto,
      role: "Parent",
    };

    const roomId = `meeting-${meeting.id}`;
    const callContext = `${meeting.title} - ${meeting.childName || "Meeting"}`;

    if (callType === "video") {
      startVideoCall(parentParticipant, { roomId, callContext });
    } else if (callType === "voice") {
      startVoiceCall(parentParticipant, { roomId, callContext });
    } else {
      startChat(parentParticipant, { roomId, callContext });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Open meeting details modal
  const handleViewMeetingDetails = (meeting: DisplayMeeting) => {
    // Find the original meeting to get notes and outcome
    const originalMeeting = teacherMeetings.find(m => m.id === meeting.id);

    const meetingDetails: MeetingDetails = {
      id: meeting.id,
      title: meeting.title,
      description: meeting.description,
      platform: meeting.platform,
      parentName: meeting.parentName,
      parentPhoto: meeting.parentPhoto,
      childName: meeting.childName,
      childClass: meeting.childClass,
      scheduledDate: meeting.scheduledDate,
      scheduledTime: meeting.scheduledTime,
      duration: meeting.duration,
      status: meeting.status,
      meetingLink: meeting.meetingLink,
      meetingId: meeting.meetingId,
      passcode: meeting.passcode,
      location: meeting.location,
      requestedBy: meeting.requestedBy,
      notes: originalMeeting?.notes,
      outcome: originalMeeting?.outcome,
      cancellationReason: originalMeeting?.cancellationReason,
      cancelledBy: originalMeeting?.cancelledBy,
      cancelledByName: originalMeeting?.cancelledByName,
      cancelledAt: originalMeeting?.cancelledAt,
      additionalParticipants: originalMeeting?.additionalParticipants,
    };
    setSelectedMeeting(meetingDetails);
    setIsMeetingDetailsModalOpen(true);
  };

  // Handle updating meeting notes/outcome
  const handleUpdateMeeting = (meetingId: string, updates: { notes?: string; outcome?: string }) => {
    updateMeeting(meetingId, updates);
    // Update the selected meeting to reflect changes immediately
    if (selectedMeeting && selectedMeeting.id === meetingId) {
      setSelectedMeeting({
        ...selectedMeeting,
        ...updates,
      });
    }
  };

  // Handle cancel meeting (teachers can cancel)
  const handleCancelMeeting = (meetingId: string, data: CancelMeetingData) => {
    cancelMeeting(meetingId, {
      reason: data.reason,
      cancelledBy: "teacher",
      cancelledByName: MOCK_TEACHER.name,
    });
  };

  // Handle reschedule meeting
  const handleRescheduleMeeting = (meetingId: string, data: RescheduleMeetingData) => {
    rescheduleMeeting(meetingId, {
      newDate: data.newDate,
      newTime: data.newTime,
      reason: data.reason,
      requestedBy: "teacher",
      requestedByName: MOCK_TEACHER.name,
    });
  };

  // Handle accept meeting
  const handleAcceptMeeting = (meetingId: string) => {
    acceptMeeting(meetingId);
  };

  // Handle invite participant
  const handleInviteParticipant = (meetingId: string, participant: AdditionalParticipant) => {
    inviteParticipant(meetingId, participant);
    // Update the selected meeting to reflect changes immediately
    if (selectedMeeting && selectedMeeting.id === meetingId) {
      setSelectedMeeting({
        ...selectedMeeting,
        additionalParticipants: [...(selectedMeeting.additionalParticipants || []), participant],
      });
    }
  };

  // Handle remove participant
  const handleRemoveParticipant = (meetingId: string, participantId: string) => {
    removeParticipant(meetingId, participantId);
    // Update the selected meeting to reflect changes immediately
    if (selectedMeeting && selectedMeeting.id === meetingId) {
      setSelectedMeeting({
        ...selectedMeeting,
        additionalParticipants: (selectedMeeting.additionalParticipants || []).filter(p => p.id !== participantId),
      });
    }
  };

  return (
    <DashboardPage
      title="Meetings"
      subtitle="Schedule and manage meetings with parents"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Teacher Portal", href: "/teachers/portal/dashboard" },
        { label: "Meetings", isActive: true },
      ]}
      loadingText="Loading Meetings"
      afterStats={
        <div className="mt-6 space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setIsScheduleMeetingModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Schedule Meeting
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingMeetings.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Upcoming</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-orange-50 dark:bg-orange-900/30">
                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {meetings.filter((m) => m.status === "pending_approval").length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pending Approval</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-900/30">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {meetings.filter((m) => m.status === "completed").length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-900/30">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{meetings.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Meetings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search meetings, parents, students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

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
            <option value="in-person">In Person</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as MeetingStatus | "all")}
            className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="pending_approval">Pending Approval</option>
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
                        {/* Parent Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-white dark:ring-gray-700 shadow-md">
                              <Image
                                src={meeting.parentPhoto}
                                alt={meeting.parentName}
                                width={56}
                                height={56}
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div
                              className={`absolute -bottom-1 -right-1 p-1.5 rounded-lg ${platformInfo.bgClass} ${platformInfo.textClass} shadow-sm`}
                            >
                              {meeting.platform.includes("whatsapp") ? (
                                meeting.platform === "whatsapp-video" ? (
                                  <Video className="w-3 h-3" />
                                ) : (
                                  <Phone className="w-3 h-3" />
                                )
                              ) : (
                                platformInfo.icon
                              )}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900 dark:text-white truncate">{meeting.title}</h3>
                              <span
                                className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${statusInfo.bgClass} ${statusInfo.textClass}`}
                              >
                                {statusInfo.icon}
                                {statusInfo.label}
                              </span>
                              {meeting.requestedBy === "parent" && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                                  Parent Request
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{meeting.description}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5" />
                                {meeting.parentName}
                              </span>
                              {meeting.childName && (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 font-medium">
                                  <GraduationCap className="w-3 h-3" />
                                  {meeting.childName} ({meeting.childClass})
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
                              {meeting.scheduledTime} - {meeting.duration} min
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
                            {meeting.meetingLink && meeting.platform !== "educo-meet" && (
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
                                Join
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {meeting.status === "pending_approval" && (
                              <button
                                onClick={() => handleAcceptMeeting(meeting.id)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-green-500/25 transition-all duration-200 hover:-translate-y-0.5"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Approve
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

                      {/* Meeting Details */}
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
                            src={meeting.parentPhoto}
                            alt={meeting.parentName}
                            width={40}
                            height={40}
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 p-1 rounded ${platformInfo.bgClass} ${platformInfo.textClass}`}>
                          {meeting.platform.includes("whatsapp") ? <Phone className="w-2.5 h-2.5" /> : <Video className="w-2.5 h-2.5" />}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm truncate">{meeting.title}</h3>
                          <span
                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${statusInfo.bgClass} ${statusInfo.textClass}`}
                          >
                            {statusInfo.icon}
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {meeting.parentName} - {meeting.childName} - {formatDate(meeting.scheduledDate)} at {meeting.scheduledTime}
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
                : "You don't have any meetings scheduled yet"}
            </p>
            <button
              onClick={() => setIsScheduleMeetingModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Schedule a Meeting
            </button>
          </div>
        )}

        {/* Schedule Meeting Modal */}
        <ScheduleMeetingModal
          isOpen={isScheduleMeetingModalOpen}
          onClose={() => setIsScheduleMeetingModalOpen(false)}
          onSchedule={handleScheduleMeeting}
          context="teacher"
          primaryParticipant={MOCK_TEACHER}
          children={MOCK_STUDENTS}
        />

        {/* Meeting Details Modal */}
        <MeetingDetailsModal
          isOpen={isMeetingDetailsModalOpen}
          onClose={() => {
            setIsMeetingDetailsModalOpen(false);
            setSelectedMeeting(null);
          }}
          meeting={selectedMeeting}
          viewContext="teacher"
          currentUserName={MOCK_TEACHER.name}
          onUpdate={handleUpdateMeeting}
          onCancel={handleCancelMeeting}
          onReschedule={handleRescheduleMeeting}
          onAccept={handleAcceptMeeting}
          onInviteParticipant={handleInviteParticipant}
          onRemoveParticipant={handleRemoveParticipant}
          availableParticipants={AVAILABLE_STAFF.filter(s => s.id !== MOCK_TEACHER.id)}
        />
      </div>
    }
  />
  );
}
