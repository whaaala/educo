"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Modal from "@/components/shared/Modal";
import FormDropdown from "@/components/shared/FormDropdown";
import FormInput from "@/components/shared/FormInput";
import FormTextarea from "@/components/shared/FormTextarea";
import {
  Video,
  Phone,
  Calendar,
  Clock,
  Users,
  MapPin,
  FileText,
  User,
  GraduationCap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Edit,
  Save,
  X,
  CalendarClock,
  Ban,
  Check,
  UserPlus,
  Trash2,
  Sparkles,
  MessageSquare,
  Headphones,
} from "lucide-react";

// Platform icons
const ZoomIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M4.585 7.6c-.4.3-.585.8-.585 1.4v6c0 .6.185 1.1.585 1.4.4.3.9.4 1.415.4h9c1.1 0 2-.9 2-2v-2l4 3v-8l-4 3V9c0-1.1-.9-2-2-2h-9c-.515 0-1.015.1-1.415.4z" />
  </svg>
);

const GoogleMeetIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <path d="M17 12l-3-2.5v5z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const EducoMeetIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
  </svg>
);

const InPersonIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

export type MeetingPlatform = "zoom" | "google-meet" | "whatsapp-video" | "whatsapp-voice" | "educo-meet" | "in-person";
export type MeetingStatus = "scheduled" | "in-progress" | "completed" | "cancelled" | "pending_approval";

export interface MeetingDetails {
  id: string;
  title: string;
  description?: string;
  platform: MeetingPlatform;
  // Host info (for parent view - teacher is host)
  hostName?: string;
  hostRole?: string;
  hostPhoto?: string;
  // Parent info (for teacher/admin view)
  parentName?: string;
  parentPhoto?: string;
  // Child info
  childName?: string;
  childClass?: string;
  // Schedule
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  // Status
  status: MeetingStatus;
  // Meeting details
  meetingLink?: string;
  meetingId?: string;
  passcode?: string;
  location?: string;
  // Additional info
  requestedBy?: "parent" | "teacher" | "admin";
  notes?: string;
  meetingType?: string;
  outcome?: string; // What happened in the meeting (for completed meetings)
  // Cancellation info
  cancellationReason?: string;
  cancelledBy?: "parent" | "teacher" | "admin";
  cancelledByName?: string;
  cancelledAt?: string;
  // Reschedule request info
  rescheduleRequest?: {
    newDate: string;
    newTime: string;
    reason?: string;
    requestedBy: "parent" | "teacher" | "admin";
    requestedByName: string;
    requestedAt: string;
  };
  // Additional participants
  additionalParticipants?: AdditionalParticipant[];
}

export interface MeetingUpdateData {
  notes?: string;
  outcome?: string;
}

export interface CancelMeetingData {
  reason: string;
  cancelledBy: "teacher" | "admin";
  cancelledByName: string;
}

export interface RescheduleMeetingData {
  newDate: string;
  newTime: string;
  reason?: string;
  requestedBy: "parent" | "teacher" | "admin";
  requestedByName: string;
}

export interface AdditionalParticipant {
  id: string;
  name: string;
  role: string;
  type: "teacher" | "admin" | "counselor" | "other";
  email?: string;
  photo?: string;
}

interface MeetingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: MeetingDetails | null;
  viewContext: "parent" | "teacher" | "admin";
  currentUserName?: string; // Name of the current user for cancel/reschedule attribution
  currentUserId?: string; // ID of the current user for calls
  currentUserAvatar?: string; // Avatar of the current user for calls
  initialAction?: "view" | "cancel" | "reschedule" | "invite"; // Initial action to show when modal opens
  onUpdate?: (meetingId: string, updates: MeetingUpdateData) => void;
  onCancel?: (meetingId: string, data: CancelMeetingData) => void;
  onReschedule?: (meetingId: string, data: RescheduleMeetingData) => void;
  onAccept?: (meetingId: string) => void;
  onInviteParticipant?: (meetingId: string, participant: AdditionalParticipant) => void;
  onRemoveParticipant?: (meetingId: string, participantId: string) => void;
  availableParticipants?: AdditionalParticipant[]; // List of people that can be invited
  // In-app communication callbacks
  onStartVideoCall?: (meetingId: string, roomId: string) => void;
  onStartVoiceCall?: (meetingId: string, roomId: string) => void;
  onStartChat?: (meetingId: string, roomId: string) => void;
}

function getPlatformInfo(platform: MeetingPlatform) {
  switch (platform) {
    case "zoom":
      return {
        name: "Zoom",
        icon: <ZoomIcon />,
        gradient: "from-blue-500/10 to-blue-600/5",
        textClass: "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
        iconBg: "bg-blue-500/10",
      };
    case "google-meet":
      return {
        name: "Google Meet",
        icon: <GoogleMeetIcon />,
        gradient: "from-green-500/10 to-green-600/5",
        textClass: "text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400",
        iconBg: "bg-green-500/10",
      };
    case "whatsapp-video":
      return {
        name: "WhatsApp Video",
        icon: <WhatsAppIcon />,
        gradient: "from-emerald-500/10 to-emerald-600/5",
        textClass: "text-emerald-600 dark:text-emerald-400",
        iconBg: "bg-emerald-500/10",
      };
    case "whatsapp-voice":
      return {
        name: "WhatsApp Call",
        icon: <WhatsAppIcon />,
        gradient: "from-emerald-500/10 to-emerald-600/5",
        textClass: "text-emerald-600 dark:text-emerald-400",
        iconBg: "bg-emerald-500/10",
      };
    case "educo-meet":
      return {
        name: "Educo Meet",
        icon: <EducoMeetIcon />,
        gradient: "from-indigo-500/10 to-indigo-600/5",
        textClass: "text-indigo-600 dark:text-indigo-400",
        iconBg: "bg-indigo-500/10",
      };
    case "in-person":
      return {
        name: "In-Person",
        icon: <InPersonIcon />,
        gradient: "from-violet-500/10 to-violet-600/5",
        textClass: "text-violet-600 dark:text-violet-400",
        iconBg: "bg-violet-500/10",
      };
    default:
      return {
        name: "Meeting",
        icon: <Video className="w-4 h-4" />,
        gradient: "from-gray-500/10 to-gray-600/5",
        textClass: "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300",
        iconBg: "bg-gray-500/10",
      };
  }
}

function getStatusInfo(status: MeetingStatus) {
  switch (status) {
    case "scheduled":
      return {
        label: "Scheduled",
        icon: <Clock className="w-3.5 h-3.5" />,
        gradient: "from-blue-500 to-blue-600",
        textClass: "text-white",
      };
    case "in-progress":
      return {
        label: "In Progress",
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        gradient: "from-emerald-500 to-emerald-600",
        textClass: "text-white",
      };
    case "completed":
      return {
        label: "Completed",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        gradient: "from-gray-400 to-gray-500",
        textClass: "text-white",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        icon: <XCircle className="w-3.5 h-3.5" />,
        gradient: "from-red-500 to-red-600",
        textClass: "text-white",
      };
    case "pending_approval":
      return {
        label: "Pending",
        icon: <Clock className="w-3.5 h-3.5" />,
        gradient: "from-amber-500 to-orange-500",
        textClass: "text-white",
      };
    default:
      return {
        label: status,
        icon: <Clock className="w-3.5 h-3.5" />,
        gradient: "from-gray-400 to-gray-500",
        textClass: "text-white",
      };
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function formatShortDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function MeetingDetailsModal({
  isOpen,
  onClose,
  meeting,
  viewContext,
  currentUserName = "User",
  currentUserId,
  currentUserAvatar,
  initialAction = "view",
  onUpdate,
  onCancel,
  onReschedule,
  onAccept,
  onInviteParticipant,
  onRemoveParticipant,
  availableParticipants = [],
  onStartVideoCall,
  onStartVoiceCall,
  onStartChat,
}: MeetingDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editNotes, setEditNotes] = useState("");
  const [editOutcome, setEditOutcome] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Cancel meeting state
  const [showCancelForm, setShowCancelForm] = useState(initialAction === "cancel");
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  // Reschedule meeting state
  const [showRescheduleForm, setShowRescheduleForm] = useState(initialAction === "reschedule");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Accept meeting state
  const [isAccepting, setIsAccepting] = useState(false);

  // Invite participant state
  const [showInviteForm, setShowInviteForm] = useState(initialAction === "invite");
  const [selectedParticipantId, setSelectedParticipantId] = useState("");

  // Copy feedback
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Reset form states when modal opens/closes or initialAction changes
  useEffect(() => {
    if (isOpen) {
      setShowCancelForm(initialAction === "cancel");
      setShowRescheduleForm(initialAction === "reschedule");
      setShowInviteForm(initialAction === "invite");
      setIsEditing(false);
      setCancelReason("");
      setRescheduleDate("");
      setRescheduleTime("");
      setRescheduleReason("");
      setSelectedParticipantId("");
    }
  }, [isOpen, initialAction]);

  if (!meeting) return null;

  const platformInfo = getPlatformInfo(meeting.platform);
  const statusInfo = getStatusInfo(meeting.status);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleStartEditing = () => {
    setEditNotes(meeting.notes || "");
    setEditOutcome(meeting.outcome || "");
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditNotes("");
    setEditOutcome("");
  };

  const handleSaveChanges = async () => {
    if (!onUpdate) return;

    setIsSaving(true);
    try {
      await onUpdate(meeting.id, {
        notes: editNotes,
        outcome: editOutcome,
      });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel meeting handler (only for teacher and admin)
  const handleCancelMeeting = async () => {
    if (!onCancel || !cancelReason.trim()) return;
    if (viewContext === "parent") return; // Parents cannot cancel

    setIsCancelling(true);
    try {
      await onCancel(meeting.id, {
        reason: cancelReason,
        cancelledBy: viewContext as "teacher" | "admin",
        cancelledByName: currentUserName,
      });
      setShowCancelForm(false);
      setCancelReason("");
      onClose();
    } finally {
      setIsCancelling(false);
    }
  };

  // Reschedule meeting handler
  const handleRescheduleMeeting = async () => {
    if (!onReschedule || !rescheduleDate || !rescheduleTime) return;

    setIsRescheduling(true);
    try {
      await onReschedule(meeting.id, {
        newDate: rescheduleDate,
        newTime: rescheduleTime,
        reason: rescheduleReason || undefined,
        requestedBy: viewContext,
        requestedByName: currentUserName,
      });
      setShowRescheduleForm(false);
      setRescheduleDate("");
      setRescheduleTime("");
      setRescheduleReason("");
      onClose();
    } finally {
      setIsRescheduling(false);
    }
  };

  // Accept meeting handler
  const handleAcceptMeeting = async () => {
    if (!onAccept) return;

    setIsAccepting(true);
    try {
      await onAccept(meeting.id);
      onClose();
    } finally {
      setIsAccepting(false);
    }
  };

  // Invite participant handler
  const handleInviteParticipant = () => {
    if (!onInviteParticipant || !selectedParticipantId) return;

    const participant = availableParticipants.find(p => p.id === selectedParticipantId);
    if (participant) {
      onInviteParticipant(meeting.id, participant);
      setSelectedParticipantId("");
      setShowInviteForm(false);
    }
  };

  // Remove participant handler
  const handleRemoveParticipant = (participantId: string) => {
    if (!onRemoveParticipant) return;
    onRemoveParticipant(meeting.id, participantId);
  };

  // Determine the other participant (teacher for parent view, parent for teacher/admin view)
  const otherParticipantName = viewContext === "parent" ? meeting.hostName : meeting.parentName;
  const otherParticipantRole = viewContext === "parent" ? meeting.hostRole : "Parent";
  const otherParticipantPhoto = viewContext === "parent" ? meeting.hostPhoto : meeting.parentPhoto;
  const otherParticipantLabel = viewContext === "parent" ? "Teacher" : "Parent";

  // Only allow editing for teacher and admin views (not parents)
  const canEdit = onUpdate && (viewContext === "teacher" || viewContext === "admin");

  // Can cancel - only teachers and admins can cancel meetings
  const canCancel = onCancel && (viewContext === "teacher" || viewContext === "admin") &&
    (meeting.status === "scheduled" || meeting.status === "pending_approval");

  // Can reschedule - everyone can request reschedule for scheduled/pending meetings
  const canReschedule = onReschedule &&
    (meeting.status === "scheduled" || meeting.status === "pending_approval");

  // Can accept - for pending_approval meetings
  const canAccept = onAccept && meeting.status === "pending_approval";

  // Can invite participants - only teachers and admins can invite for upcoming meetings
  const canInviteParticipants = onInviteParticipant && (viewContext === "teacher" || viewContext === "admin") &&
    (meeting.status === "scheduled" || meeting.status === "pending_approval") &&
    availableParticipants.length > 0;

  // Filter out already invited participants from available list
  const invitedParticipantIds = meeting.additionalParticipants?.map(p => p.id) || [];
  const uninvitedParticipants = availableParticipants.filter(p => !invitedParticipantIds.includes(p.id));

  // Is the meeting still upcoming and actionable
  const isUpcoming = meeting.status === "scheduled" || meeting.status === "pending_approval" || meeting.status === "in-progress";

  // Show actions section
  const showActions = isUpcoming && !showCancelForm && !showRescheduleForm && !isEditing && (canAccept || canReschedule || canCancel || (canInviteParticipants && uninvitedParticipants.length > 0));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Meeting Details"
      subtitle={meeting.title}
      icon={<Video className="w-5 h-5" />}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Status & Platform Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${statusInfo.gradient} ${statusInfo.textClass} shadow-sm`}>
            {statusInfo.icon}
            {statusInfo.label}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${platformInfo.iconBg} ${platformInfo.textClass}`}>
            {platformInfo.icon}
            {platformInfo.name}
          </span>
        </div>

        {/* Main Info Cards - Modern Glass Effect */}
        <div className="grid grid-cols-2 gap-3">
          {/* Student Card */}
          {meeting.childName && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/30 p-4 border border-slate-200/60 dark:border-slate-700/40">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Student</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 leading-tight">{meeting.childName}</p>
                {meeting.childClass && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{meeting.childClass}</p>
                )}
              </div>
            </div>
          )}

          {/* Date & Time Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/30 p-4 border border-slate-200/60 dark:border-slate-700/40">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-blue-500/10">
                  <Calendar className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Date & Time</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 leading-tight">{formatShortDate(meeting.scheduledDate)}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {meeting.scheduledTime} <span className="text-slate-300 dark:text-slate-600">•</span> {meeting.duration} min
              </p>
            </div>
          </div>

          {/* Location Card (for in-person meetings) */}
          {meeting.location && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/30 p-4 border border-slate-200/60 dark:border-slate-700/40">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-violet-500/10">
                    <MapPin className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
                  </div>
                  <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Location</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 leading-tight">{meeting.location}</p>
              </div>
            </div>
          )}

          {/* Meeting Type Card */}
          {meeting.meetingType && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/30 p-4 border border-slate-200/60 dark:border-slate-700/40">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" />
                  </div>
                  <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Type</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 leading-tight capitalize">{meeting.meetingType.replace(/_/g, " ").replace(/-/g, " ")}</p>
              </div>
            </div>
          )}
        </div>

        {/* Participant Info - Elegant Card */}
        {otherParticipantName && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/30 p-4 border border-slate-200/60 dark:border-slate-700/40">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white dark:ring-slate-700 shadow-lg">
                  <Image
                    src={otherParticipantPhoto || `https://i.pravatar.cc/150?u=${otherParticipantName}`}
                    alt={otherParticipantName}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-white dark:bg-slate-800 shadow-sm">
                  <User className="w-3 h-3 text-slate-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.625rem] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">{otherParticipantLabel}</p>
                <p className="text-base font-bold text-slate-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">{otherParticipantName}</p>
                {otherParticipantRole && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">{otherParticipantRole}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Meeting Credentials - Compact Design */}
        {(meeting.meetingLink || meeting.meetingId || meeting.passcode) && (
          <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/30 p-4 border border-slate-200/60 dark:border-slate-700/40 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10">
                <Video className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Meeting Credentials</span>
            </div>

            <div className="space-y-2">
              {meeting.meetingId && (
                <div className="flex items-center justify-between gap-3 px-3 py-2 bg-white/70 dark:bg-slate-900/50 rounded-xl border border-slate-200/50 dark:border-slate-700/30">
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.625rem] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Meeting ID</p>
                    <p className="text-sm font-mono font-semibold text-slate-800 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">{meeting.meetingId}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(meeting.meetingId!.replace(/\s/g, ""), "meetingId")}
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    {copiedField === "meetingId" ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
              )}

              {meeting.passcode && (
                <div className="flex items-center justify-between gap-3 px-3 py-2 bg-white/70 dark:bg-slate-900/50 rounded-xl border border-slate-200/50 dark:border-slate-700/30">
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.625rem] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Passcode</p>
                    <p className="text-sm font-mono font-semibold text-slate-800 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{meeting.passcode}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(meeting.passcode!, "passcode")}
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    {copiedField === "passcode" ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
              )}

              {/* Join Meeting Button - for external platforms */}
              {meeting.meetingLink && meeting.status !== "completed" && meeting.status !== "cancelled" && meeting.platform !== "educo-meet" && (
                <a
                  href={meeting.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Video className="w-4 h-4" />
                  Join Meeting
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {/* In-App Communication Options - for Educo Meet */}
              {meeting.platform === "educo-meet" && meeting.status !== "completed" && meeting.status !== "cancelled" && (
                <div className="space-y-2">
                  <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-2">Join meeting in-app</p>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Video Call Button */}
                    <button
                      onClick={() => onStartVideoCall?.(meeting.id, `meeting-${meeting.id}`)}
                      className="flex flex-col items-center gap-1.5 px-3 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <Video className="w-5 h-5" />
                      Video
                    </button>

                    {/* Voice Call Button */}
                    <button
                      onClick={() => onStartVoiceCall?.(meeting.id, `meeting-${meeting.id}`)}
                      className="flex flex-col items-center gap-1.5 px-3 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <Headphones className="w-5 h-5" />
                      Voice
                    </button>

                    {/* Chat Button */}
                    <button
                      onClick={() => onStartChat?.(meeting.id, `meeting-${meeting.id}`)}
                      className="flex flex-col items-center gap-1.5 px-3 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-500/25 transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Chat
                    </button>
                  </div>
                </div>
              )}

              {/* WhatsApp Call Options */}
              {(meeting.platform === "whatsapp-video" || meeting.platform === "whatsapp-voice") && meeting.status !== "completed" && meeting.status !== "cancelled" && (
                <a
                  href={meeting.meetingLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:-translate-y-0.5"
                >
                  {meeting.platform === "whatsapp-video" ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  {meeting.platform === "whatsapp-video" ? "Video Call on WhatsApp" : "Voice Call on WhatsApp"}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Notes/Description - Clean Card */}
        {!isEditing && (meeting.description || meeting.notes) && (
          <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/30 p-4 border border-slate-200/60 dark:border-slate-700/40">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-slate-500/10">
                <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {meeting.notes ? "Notes" : "Description"}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {meeting.notes || meeting.description}
            </p>
          </div>
        )}

        {/* Meeting Outcome - Success Style */}
        {!isEditing && meeting.outcome && (
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/30 dark:from-emerald-900/20 dark:to-emerald-800/10 p-4 border border-emerald-200/60 dark:border-emerald-700/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Meeting Outcome</span>
            </div>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed whitespace-pre-wrap">
              {meeting.outcome}
            </p>
          </div>
        )}

        {/* No outcome recorded */}
        {!isEditing && meeting.status === "completed" && !meeting.outcome && (
          <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/30 dark:from-amber-900/20 dark:to-amber-800/10 p-4 border border-amber-200/60 dark:border-amber-700/30">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" />
              </div>
              <span className="text-xs text-amber-700 dark:text-amber-300">No outcome has been recorded for this meeting yet.</span>
            </div>
          </div>
        )}

        {/* Cancellation Info */}
        {meeting.status === "cancelled" && meeting.cancellationReason && (
          <div className="rounded-2xl bg-gradient-to-br from-red-50 to-red-100/30 dark:from-red-900/20 dark:to-red-800/10 p-4 border border-red-200/60 dark:border-red-700/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-red-500/10">
                <Ban className="w-3.5 h-3.5 text-red-500 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />
              </div>
              <span className="text-xs font-semibold text-red-700 dark:text-red-300">Cancellation Reason</span>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed whitespace-pre-wrap">
              {meeting.cancellationReason}
            </p>
            {meeting.cancelledByName && (
              <p className="text-[0.625rem] text-red-500 dark:text-red-400 midnight:text-red-400 purple:text-red-400 mt-2 font-medium">
                Cancelled by {meeting.cancelledByName}
                {meeting.cancelledAt && ` on ${formatShortDate(meeting.cancelledAt.split("T")[0])}`}
              </p>
            )}
          </div>
        )}

        {/* Edit Notes/Outcome Section */}
        {canEdit && !isEditing && (
          <button
            onClick={handleStartEditing}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/50 hover:bg-slate-200/80 dark:hover:bg-slate-700/50 rounded-xl transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Notes & Outcome
          </button>
        )}

        {/* Edit Form */}
        {isEditing && (
          <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/30 p-4 border border-slate-200/60 dark:border-slate-700/40 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10">
                <Edit className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Edit Meeting Details</span>
            </div>

            <FormTextarea
              label="Notes"
              icon={<FileText className="w-4 h-4" />}
              value={editNotes}
              onChange={setEditNotes}
              placeholder="Add any notes about this meeting..."
              rows={3}
            />

            <FormTextarea
              label="Meeting Outcome"
              icon={<CheckCircle2 className="w-4 h-4" />}
              value={editOutcome}
              onChange={setEditOutcome}
              placeholder="What was discussed? Key takeaways or action items?"
              rows={4}
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={handleCancelEditing}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons - Modern Pill Style */}
        {showActions && (
          <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/30 p-4 border border-slate-200/60 dark:border-slate-700/40">
            <p className="text-[0.625rem] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Quick Actions</p>
            <div className="flex flex-wrap gap-2">
              {canAccept && (
                <button
                  onClick={handleAcceptMeeting}
                  disabled={isAccepting}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  {isAccepting ? "Accepting..." : "Accept"}
                </button>
              )}

              {canReschedule && (
                <button
                  onClick={() => setShowRescheduleForm(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/30 hover:bg-amber-200/80 dark:hover:bg-amber-900/50 rounded-xl transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <CalendarClock className="w-4 h-4" />
                  {viewContext === "parent" ? "Request Reschedule" : "Reschedule"}
                </button>
              )}

              {canCancel && (
                <button
                  onClick={() => setShowCancelForm(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-700 dark:text-red-300 bg-red-100/80 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 hover:bg-red-200/80 dark:hover:bg-red-900/50 rounded-xl transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <Ban className="w-4 h-4" />
                  Cancel
                </button>
              )}

              {canInviteParticipants && uninvitedParticipants.length > 0 && (
                <button
                  onClick={() => setShowInviteForm(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-900/30 hover:bg-indigo-200/80 dark:hover:bg-indigo-900/50 rounded-xl transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  Invite
                </button>
              )}
            </div>
          </div>
        )}

        {/* Cancel Meeting Form */}
        {showCancelForm && (
          <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/30 p-4 border border-slate-200/60 dark:border-slate-700/40 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-red-500/10">
                <Ban className="w-3.5 h-3.5 text-red-500 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cancel Meeting</span>
            </div>

            <FormTextarea
              label="Reason for cancellation"
              icon={<Ban className="w-4 h-4" />}
              value={cancelReason}
              onChange={setCancelReason}
              placeholder="Please provide a reason for cancelling this meeting..."
              rows={3}
              required
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => { setShowCancelForm(false); setCancelReason(""); }}
                disabled={isCancelling}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleCancelMeeting}
                disabled={isCancelling || !cancelReason.trim()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl shadow-lg shadow-red-500/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Ban className="w-4 h-4" />
                {isCancelling ? "Cancelling..." : "Cancel Meeting"}
              </button>
            </div>
          </div>
        )}

        {/* Reschedule Form */}
        {showRescheduleForm && (
          <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/30 p-4 border border-slate-200/60 dark:border-slate-700/40 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10">
                <CalendarClock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {viewContext === "parent" ? "Request Reschedule" : "Reschedule Meeting"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="New Date"
                icon={<Calendar className="w-4 h-4" />}
                type="date"
                value={rescheduleDate}
                onChange={setRescheduleDate}
                required
              />
              <FormInput
                label="New Time"
                icon={<Clock className="w-4 h-4" />}
                type="time"
                value={rescheduleTime}
                onChange={setRescheduleTime}
                required
              />
            </div>

            <FormTextarea
              label="Reason"
              icon={<FileText className="w-4 h-4" />}
              value={rescheduleReason}
              onChange={setRescheduleReason}
              placeholder={viewContext === "parent" ? "Please explain why you need to reschedule..." : "Optional: reason for rescheduling..."}
              rows={2}
              required={viewContext === "parent"}
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => { setShowRescheduleForm(false); setRescheduleDate(""); setRescheduleTime(""); setRescheduleReason(""); }}
                disabled={isRescheduling}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleRescheduleMeeting}
                disabled={isRescheduling || !rescheduleDate || !rescheduleTime || (viewContext === "parent" && !rescheduleReason.trim())}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50"
              >
                <CalendarClock className="w-4 h-4" />
                {isRescheduling ? "Saving..." : viewContext === "parent" ? "Request" : "Reschedule"}
              </button>
            </div>
          </div>
        )}

        {/* Invite Participant Form */}
        {showInviteForm && (
          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/30 dark:from-indigo-900/20 dark:to-indigo-800/10 p-4 border border-indigo-200/60 dark:border-indigo-700/30 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10">
                <UserPlus className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              </div>
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">Invite Participant</span>
            </div>

            <FormDropdown
              label="Select Person"
              icon={<Users className="w-4 h-4" />}
              value={selectedParticipantId}
              onChange={setSelectedParticipantId}
              options={uninvitedParticipants.map((p) => ({
                value: p.id,
                label: `${p.name} - ${p.role}`,
              }))}
              placeholder="Select a person..."
              required
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => { setShowInviteForm(false); setSelectedParticipantId(""); }}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteParticipant}
                disabled={!selectedParticipantId}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 rounded-xl shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                Invite
              </button>
            </div>
          </div>
        )}

        {/* Additional Participants */}
        {meeting.additionalParticipants && meeting.additionalParticipants.length > 0 && (
          <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/30 p-4 border border-slate-200/60 dark:border-slate-700/40">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-slate-500/10">
                <Users className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Additional Participants ({meeting.additionalParticipants.length})
              </span>
            </div>

            <div className="space-y-2">
              {meeting.additionalParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-2.5 bg-white/70 dark:bg-slate-900/50 rounded-xl border border-slate-200/50 dark:border-slate-700/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                      {participant.photo ? (
                        <Image
                          src={participant.photo}
                          alt={participant.name}
                          width={36}
                          height={36}
                          className="object-cover w-full h-full"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{participant.name}</p>
                      <p className="text-[0.625rem] text-slate-500 dark:text-slate-400">{participant.role}</p>
                    </div>
                  </div>
                  {onRemoveParticipant && (viewContext === "teacher" || viewContext === "admin") && isUpcoming && (
                    <button
                      onClick={() => handleRemoveParticipant(participant.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Remove participant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
