"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { DashboardPage } from "@/components/pages";
import {
  DetailPageLayout,
  DetailPageHeader,
  DetailCard,
  PersonCard,
  InfoRow,
  InfoGrid,
  StatusBadge,
  ActionButton,
  CopyableField,
  type StatusType,
} from "@/components/detail-page";
import { useMeetings } from "@/contexts/MeetingsContext";
import { useCall } from "@/hooks/useCall";
import { useCommunication } from "@/contexts/CommunicationContext";
import { cn } from "@/lib/utils";
import {
  Video,
  Phone,
  Calendar,
  Clock,
  Users,
  MapPin,
  ArrowLeft,
  GraduationCap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  FileText,
  Share2,
  Bell,
  Timer,
} from "lucide-react";

// Platform icons with enhanced styling
const ZoomIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M4.585 7.6c-.4.3-.585.8-.585 1.4v6c0 .6.185 1.1.585 1.4.4.3.9.4 1.415.4h9c1.1 0 2-.9 2-2v-2l4 3v-8l-4 3V9c0-1.1-.9-2-2-2h-9c-.515 0-1.015.1-1.415.4z" />
  </svg>
);

const GoogleMeetIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <path d="M17 12l-3-2.5v5z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const EducoMeetIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
  </svg>
);

// Platform configuration with theme support - subtle colors
const getPlatformConfig = (platform: string) => {
  const configs: Record<string, {
    name: string;
    icon: React.ReactNode;
    gradient: string;
  }> = {
    zoom: {
      name: "Zoom",
      icon: <ZoomIcon />,
      gradient: "from-blue-400/80 to-blue-500/80 midnight:from-cyan-600/70 midnight:to-cyan-700/70 purple:from-pink-500/70 purple:to-pink-600/70",
    },
    "google-meet": {
      name: "Google Meet",
      icon: <GoogleMeetIcon />,
      gradient: "from-teal-400/80 to-teal-500/80 midnight:from-cyan-600/70 midnight:to-cyan-700/70 purple:from-pink-500/70 purple:to-pink-600/70",
    },
    "whatsapp-video": {
      name: "WhatsApp Video",
      icon: <WhatsAppIcon />,
      gradient: "from-emerald-400/80 to-emerald-500/80 midnight:from-cyan-600/70 midnight:to-cyan-700/70 purple:from-pink-500/70 purple:to-pink-600/70",
    },
    "whatsapp-voice": {
      name: "WhatsApp Voice",
      icon: <WhatsAppIcon />,
      gradient: "from-emerald-400/80 to-emerald-500/80 midnight:from-cyan-600/70 midnight:to-cyan-700/70 purple:from-pink-500/70 purple:to-pink-600/70",
    },
    "educo-meet": {
      name: "Educo Meet",
      icon: <EducoMeetIcon />,
      gradient: "from-indigo-400/80 to-violet-500/80 midnight:from-cyan-600/70 midnight:to-cyan-700/70 purple:from-pink-500/70 purple:to-pink-600/70",
    },
    "in-person": {
      name: "In Person",
      icon: <Users className="w-6 h-6" />,
      gradient: "from-slate-400/80 to-slate-500/80 midnight:from-cyan-600/70 midnight:to-cyan-700/70 purple:from-pink-500/70 purple:to-pink-600/70",
    },
  };
  return configs[platform] || configs["in-person"];
};

// Status mapping to StatusBadge types
const getStatusType = (status: string): StatusType => {
  const statusMap: Record<string, StatusType> = {
    scheduled: "scheduled",
    "in-progress": "live",
    completed: "completed",
    cancelled: "cancelled",
    pending_approval: "pending",
  };
  return statusMap[status] || "info";
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    scheduled: "Scheduled",
    "in-progress": "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
    pending_approval: "Pending Approval",
  };
  return labels[status] || status;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (time24: string) => {
  if (!time24 || time24.includes("AM") || time24.includes("PM")) return time24;
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export default function MeetingDetailsPage() {
  const params = useParams();
  const meetingId = params?.id as string;

  const { meetings } = useMeetings();
  const { startVideoCall, startVoiceCall, startChat } = useCall();
  const { getAvailablePlatforms, isConfigured, settings: commSettings } = useCommunication();

  // Get available communication types from tenant configuration
  const availablePlatforms = getAvailablePlatforms();
  const hasVideoCapability = availablePlatforms.length > 0;
  const hasVoiceCapability = availablePlatforms.length > 0;
  const hasChatCapability = isConfigured("agora") || isConfigured("webrtc");
  const hasInAppCalling = commSettings.enableInAppCalling;

  const meeting = useMemo(() => {
    return meetings.find((m) => m.id === meetingId);
  }, [meetings, meetingId]);

  const platformConfig = meeting ? getPlatformConfig(meeting.platform) : null;

  const handleJoinMeeting = () => {
    if (meeting?.meetingLink) {
      window.open(meeting.meetingLink, "_blank");
    }
  };

  const handleStartCall = (type: "video" | "voice" | "chat") => {
    if (!meeting) return;
    const teacherParticipant = {
      id: meeting.teacherId,
      name: meeting.teacherName,
      type: "teacher" as const,
      role: meeting.teacherRole || "Teacher",
      photo: meeting.teacherPhoto,
    };
    const roomId = `meeting-${meeting.id}`;
    const callContext = { meetingTitle: meeting.title, childName: meeting.childName };

    if (type === "video") {
      startVideoCall(teacherParticipant, { roomId, callContext });
    } else if (type === "voice") {
      startVoiceCall(teacherParticipant, { roomId, callContext });
    } else {
      startChat(teacherParticipant, { roomId, callContext });
    }
  };

  if (!meeting) {
    return (
      <DashboardPage
        title="Meeting Not Found"
        breadcrumbs={[
          { label: "Parent Portal", href: "/parents" },
          { label: "Meetings", href: "/parents/meetings" },
          { label: "Details" },
        ]}
        loadingText="Loading Meeting"
        afterStats={
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="relative">
              <div className={cn(
                "absolute inset-0 rounded-full blur-2xl",
                "bg-gradient-to-r from-primary-500/20 to-purple-500/20",
                "midnight:from-cyan-500/20 midnight:to-cyan-600/20",
                "purple:from-pink-500/20 purple:to-pink-600/20"
              )} />
              <div className={cn(
                "relative p-6 rounded-full mb-6",
                "bg-gradient-to-br from-gray-100 to-gray-200",
                "dark:from-gray-700 dark:to-gray-800",
                "midnight:from-gray-800 midnight:to-gray-900",
                "purple:from-gray-800 purple:to-gray-900"
              )}>
                <AlertCircle className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-white purple:text-white mb-3">
              Meeting Not Found
            </h2>
            <p className="text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 mb-8 max-w-md">
              The meeting you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <ActionButton href="/parents/meetings" icon={<ArrowLeft className="w-4 h-4" />}>
              Back to Meetings
            </ActionButton>
          </div>
        }
      />
    );
  }

  return (
    <DashboardPage
      title={meeting.title}
      breadcrumbs={[
        { label: "Parent Portal", href: "/parents" },
        { label: "Meetings", href: "/parents/meetings" },
        { label: meeting.title },
      ]}
      loadingText="Loading Meeting Details"
      afterStats={
        <div className="space-y-6">
          {/* Header Section */}
          <DetailPageHeader
            title={meeting.title}
            subtitle={meeting.description}
            backHref="/parents/meetings"
            backLabel="Back to Meetings"
            icon={platformConfig?.icon}
            badge={
              <StatusBadge
                status={getStatusType(meeting.status)}
                label={getStatusLabel(meeting.status)}
                pulse={meeting.status === "in-progress"}
                size="md"
              />
            }
            actions={
              <div className="flex items-center gap-2">
                <ActionButton
                  variant="ghost"
                  size="sm"
                  icon={<Share2 className="w-4 h-4" />}
                  onClick={() => navigator.share?.({ title: meeting.title, url: window.location.href })}
                >
                  Share
                </ActionButton>
                <ActionButton
                  variant="ghost"
                  size="sm"
                  icon={<Bell className="w-4 h-4" />}
                >
                  Remind
                </ActionButton>
              </div>
            }
          />

          <DetailPageLayout
            sidebar={
              <>
                {/* Host Information Card */}
                <DetailCard
                  title="Meeting Host"
                  icon={<Users className="w-5 h-5" />}
                  variant="default"
                >
                  <PersonCard
                    name={meeting.teacherName}
                    role={meeting.teacherRole || "Teacher"}
                    avatarUrl={meeting.teacherPhoto || `https://i.pravatar.cc/150?u=${meeting.teacherId}`}
                    size="md"
                    actions={
                      <ActionButton
                        variant="secondary"
                        size="sm"
                        fullWidth
                        icon={<MessageSquare className="w-4 h-4" />}
                        onClick={() => handleStartCall("chat")}
                      >
                        Send Message
                      </ActionButton>
                    }
                  />
                </DetailCard>

                {/* Child Information */}
                {meeting.childName && (
                  <DetailCard
                    title="Regarding Student"
                    icon={<GraduationCap className="w-5 h-5" />}
                    variant="default"
                  >
                    <PersonCard
                      name={meeting.childName}
                      role={meeting.childClass || "Student"}
                      size="md"
                      variant="compact"
                    />
                  </DetailCard>
                )}

                {/* Quick Actions Card - Show based on tenant communication configuration */}
                {hasInAppCalling && meeting.status !== "completed" && meeting.status !== "cancelled" && (
                  <DetailCard title="Quick Actions" variant="gradient">
                    <div className="space-y-3">
                      {hasVideoCapability && (
                        <ActionButton
                          variant="primary"
                          fullWidth
                          icon={<Video className="w-4 h-4" />}
                          onClick={() => handleStartCall("video")}
                        >
                          Start Video Call
                        </ActionButton>
                      )}
                      {hasVoiceCapability && (
                        <ActionButton
                          variant="secondary"
                          fullWidth
                          icon={<Phone className="w-4 h-4" />}
                          onClick={() => handleStartCall("voice")}
                        >
                          Start Voice Call
                        </ActionButton>
                      )}
                      {hasChatCapability && (
                        <ActionButton
                          variant="ghost"
                          fullWidth
                          icon={<MessageSquare className="w-4 h-4" />}
                          onClick={() => handleStartCall("chat")}
                        >
                          Start Chat
                        </ActionButton>
                      )}
                    </div>
                  </DetailCard>
                )}

                {/* Location Card (for in-person meetings) */}
                {meeting.location && meeting.platform === "in-person" && (
                  <DetailCard
                    title="Location"
                    icon={<MapPin className="w-5 h-5" />}
                    variant="default"
                  >
                    <p className="text-gray-700 dark:text-gray-300 midnight:text-gray-300 purple:text-gray-300">{meeting.location}</p>
                  </DetailCard>
                )}
              </>
            }
          >
            {/* Meeting Info Card - Modern Unified Design */}
            <div className={cn(
              "relative overflow-hidden rounded-3xl",
              "bg-white dark:bg-gray-800/90 midnight:bg-gray-900/90 purple:bg-gray-900/90",
              "shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 midnight:shadow-black/30 purple:shadow-black/30",
              "border border-gray-100 dark:border-gray-700/50 midnight:border-gray-800/50 purple:border-gray-800/50"
            )}>
              {/* Platform Header Strip */}
              <div className={cn(
                "relative px-6 py-5 sm:px-8 sm:py-6",
                "bg-gradient-to-r",
                platformConfig?.gradient
              )}>
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white ring-1 ring-white/25">
                      {platformConfig?.icon}
                    </div>
                    <div>
                      <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Platform</p>
                      <h3 className="text-white text-lg font-bold">{platformConfig?.name}</h3>
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold flex items-center gap-2 ring-1 ring-white/25">
                    <Timer className="w-4 h-4" />
                    {meeting.duration} min
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Date & Time - Hero Style */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={cn(
                    "group relative p-5 rounded-2xl transition-all duration-300",
                    "bg-gradient-to-br from-gray-50 to-gray-100/50",
                    "dark:from-gray-700/50 dark:to-gray-800/30",
                    "midnight:from-gray-800/50 midnight:to-gray-900/30",
                    "purple:from-gray-800/50 purple:to-gray-900/30",
                    "hover:shadow-lg hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10",
                    "midnight:hover:shadow-cyan-500/10 purple:hover:shadow-pink-500/10",
                    "border border-gray-200/50 dark:border-gray-600/30 midnight:border-gray-700/30 purple:border-gray-700/30"
                  )}>
                    <div className={cn(
                      "inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3",
                      "bg-blue-100 dark:bg-blue-900/30",
                      "midnight:bg-cyan-900/30 purple:bg-pink-900/30",
                      "text-blue-600 dark:text-blue-400",
                      "midnight:text-cyan-400 purple:text-pink-400",
                      "group-hover:scale-110 transition-transform duration-300"
                    )}>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 midnight:text-gray-500 purple:text-gray-500 mb-1">
                      Date
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-white purple:text-white">
                      {formatDate(meeting.scheduledDate)}
                    </p>
                  </div>

                  <div className={cn(
                    "group relative p-5 rounded-2xl transition-all duration-300",
                    "bg-gradient-to-br from-gray-50 to-gray-100/50",
                    "dark:from-gray-700/50 dark:to-gray-800/30",
                    "midnight:from-gray-800/50 midnight:to-gray-900/30",
                    "purple:from-gray-800/50 purple:to-gray-900/30",
                    "hover:shadow-lg hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10",
                    "midnight:hover:shadow-cyan-500/10 purple:hover:shadow-pink-500/10",
                    "border border-gray-200/50 dark:border-gray-600/30 midnight:border-gray-700/30 purple:border-gray-700/30"
                  )}>
                    <div className={cn(
                      "inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3",
                      "bg-blue-100 dark:bg-blue-900/30",
                      "midnight:bg-cyan-900/30 purple:bg-pink-900/30",
                      "text-blue-600 dark:text-blue-400",
                      "midnight:text-cyan-400 purple:text-pink-400",
                      "group-hover:scale-110 transition-transform duration-300"
                    )}>
                      <Clock className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 midnight:text-gray-500 purple:text-gray-500 mb-1">
                      Time
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-white purple:text-white">
                      {formatTime(meeting.scheduledTime)}
                    </p>
                  </div>
                </div>

                {/* Connection Details - Subtle Design */}
                {meeting.meetingLink && (
                  <div className={cn(
                    "relative overflow-hidden rounded-2xl",
                    "bg-gradient-to-br from-gray-50 via-gray-100/80 to-gray-50",
                    "dark:from-gray-800/60 dark:via-gray-800/40 dark:to-gray-800/60",
                    "midnight:from-gray-800/50 midnight:via-gray-900/30 midnight:to-gray-800/50",
                    "purple:from-gray-800/50 purple:via-purple-900/20 purple:to-gray-800/50",
                    "border border-gray-200/60 dark:border-gray-700/40 midnight:border-gray-700/40 purple:border-gray-700/40"
                  )}>
                    {/* Subtle gradient accent */}
                    <div className={cn(
                      "absolute top-0 left-0 right-0 h-1",
                      "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400",
                      "dark:from-blue-500 dark:via-blue-600 dark:to-blue-500",
                      "midnight:from-cyan-500 midnight:via-cyan-400 midnight:to-cyan-500",
                      "purple:from-pink-500 purple:via-pink-400 purple:to-pink-500"
                    )} />

                    <div className="relative p-5 space-y-4">
                      {/* Header */}
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          "p-1.5 rounded-lg",
                          "bg-blue-100 dark:bg-blue-900/30",
                          "midnight:bg-cyan-900/30 purple:bg-pink-900/30"
                        )}>
                          <svg className={cn(
                            "w-4 h-4",
                            "text-blue-600 dark:text-blue-400",
                            "midnight:text-cyan-400 purple:text-pink-400"
                          )} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </div>
                        <span className={cn(
                          "text-xs font-semibold uppercase tracking-wider",
                          "text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400"
                        )}>
                          Connection Details
                        </span>
                      </div>

                      {/* Meeting Link */}
                      <div className={cn(
                        "group relative p-4 rounded-xl",
                        "bg-white dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50",
                        "border border-gray-200 dark:border-gray-700/50 midnight:border-gray-700/50 purple:border-gray-700/50",
                        "hover:border-blue-300 dark:hover:border-blue-700/50",
                        "midnight:hover:border-cyan-700/50 purple:hover:border-pink-700/50",
                        "transition-all duration-200"
                      )}>
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                            "bg-blue-50 dark:bg-blue-900/20",
                            "midnight:bg-cyan-900/20 purple:bg-pink-900/20"
                          )}>
                            <svg className={cn(
                              "w-5 h-5",
                              "text-blue-500 dark:text-blue-400",
                              "midnight:text-cyan-400 purple:text-pink-400"
                            )} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 midnight:text-gray-500 purple:text-gray-500 mb-0.5">
                              Meeting Link
                            </p>
                            <p className="text-sm font-mono text-gray-700 dark:text-gray-300 midnight:text-gray-300 purple:text-gray-300 truncate">
                              {meeting.meetingLink}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigator.clipboard.writeText(meeting.meetingLink || "")}
                              className={cn(
                                "p-2 rounded-lg transition-all duration-200 cursor-pointer",
                                "bg-gray-100 dark:bg-gray-700/50 midnight:bg-gray-700/50 purple:bg-gray-700/50",
                                "hover:bg-gray-200 dark:hover:bg-gray-600/50 midnight:hover:bg-gray-600/50 purple:hover:bg-gray-600/50",
                                "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                                "midnight:hover:text-gray-200 purple:hover:text-gray-200"
                              )}
                              title="Copy link"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => window.open(meeting.meetingLink, "_blank")}
                              className={cn(
                                "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer",
                                "bg-blue-500 hover:bg-blue-600",
                                "dark:bg-blue-600 dark:hover:bg-blue-700",
                                "midnight:bg-cyan-500 midnight:hover:bg-cyan-600",
                                "purple:bg-pink-500 purple:hover:bg-pink-600",
                                "text-white shadow-sm hover:shadow-md"
                              )}
                            >
                              Open
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Credentials Row */}
                      {(meeting.meetingId || meeting.passcode) && (
                        <div className="grid grid-cols-2 gap-3">
                          {meeting.meetingId && (
                            <div
                              className={cn(
                                "group relative p-3.5 rounded-xl cursor-pointer",
                                "bg-white dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50",
                                "border border-gray-200 dark:border-gray-700/50 midnight:border-gray-700/50 purple:border-gray-700/50",
                                "hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-gray-600 purple:hover:border-gray-600",
                                "hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-gray-700/50 purple:hover:bg-gray-700/50",
                                "transition-all duration-200"
                              )}
                              onClick={() => navigator.clipboard.writeText(meeting.meetingId || "")}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-medium text-gray-400 dark:text-gray-500 midnight:text-gray-500 purple:text-gray-500 mb-1 flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                    </svg>
                                    Meeting ID
                                  </p>
                                  <p className="text-sm font-mono font-semibold text-gray-800 dark:text-gray-200 midnight:text-gray-200 purple:text-gray-200 tracking-wide">
                                    {meeting.meetingId}
                                  </p>
                                </div>
                                <div className={cn(
                                  "p-1.5 rounded-md transition-all duration-200",
                                  "text-gray-300 group-hover:text-gray-500",
                                  "dark:text-gray-600 dark:group-hover:text-gray-400",
                                  "midnight:group-hover:text-gray-400 purple:group-hover:text-gray-400"
                                )}>
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          )}
                          {meeting.passcode && (
                            <div
                              className={cn(
                                "group relative p-3.5 rounded-xl cursor-pointer",
                                "bg-white dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50",
                                "border border-gray-200 dark:border-gray-700/50 midnight:border-gray-700/50 purple:border-gray-700/50",
                                "hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-gray-600 purple:hover:border-gray-600",
                                "hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-gray-700/50 purple:hover:bg-gray-700/50",
                                "transition-all duration-200"
                              )}
                              onClick={() => navigator.clipboard.writeText(meeting.passcode || "")}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-medium text-gray-400 dark:text-gray-500 midnight:text-gray-500 purple:text-gray-500 mb-1 flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Passcode
                                  </p>
                                  <p className="text-sm font-mono font-semibold text-gray-800 dark:text-gray-200 midnight:text-gray-200 purple:text-gray-200 tracking-widest">
                                    {meeting.passcode}
                                  </p>
                                </div>
                                <div className={cn(
                                  "p-1.5 rounded-md transition-all duration-200",
                                  "text-gray-300 group-hover:text-gray-500",
                                  "dark:text-gray-600 dark:group-hover:text-gray-400",
                                  "midnight:group-hover:text-gray-400 purple:group-hover:text-gray-400"
                                )}>
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Join Button - CTA */}
                {meeting.meetingLink && (
                  <button
                    onClick={handleJoinMeeting}
                    className={cn(
                      "w-full py-4 px-6 rounded-2xl font-semibold text-white cursor-pointer",
                      "bg-gradient-to-r from-blue-500 to-blue-600",
                      "dark:from-blue-600 dark:to-blue-700",
                      "midnight:from-cyan-500 midnight:to-cyan-600",
                      "purple:from-pink-500 purple:to-pink-600",
                      "hover:shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-blue-500/20",
                      "midnight:hover:shadow-cyan-500/25 purple:hover:shadow-pink-500/25",
                      "transform hover:-translate-y-0.5 active:translate-y-0",
                      "transition-all duration-200",
                      "flex items-center justify-center gap-3"
                    )}
                  >
                    <Video className="w-5 h-5" />
                    Join Meeting
                  </button>
                )}
              </div>
            </div>

            {/* Notes Section */}
            {meeting.notes && (
              <DetailCard
                title="Meeting Notes"
                icon={<FileText className="w-5 h-5" />}
                variant="default"
              >
                <p className="text-gray-700 dark:text-gray-300 midnight:text-gray-300 purple:text-gray-300 leading-relaxed">
                  {meeting.notes}
                </p>
              </DetailCard>
            )}

            {/* Outcome (for completed meetings) */}
            {meeting.status === "completed" && meeting.outcome && (
              <DetailCard
                variant="default"
                className="border-emerald-200 dark:border-emerald-800/50 midnight:border-emerald-800/50 purple:border-emerald-800/50"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white midnight:text-white purple:text-white mb-2">
                      Meeting Outcome
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 midnight:text-gray-300 purple:text-gray-300 leading-relaxed">
                      {meeting.outcome}
                    </p>
                  </div>
                </div>
              </DetailCard>
            )}

            {/* Cancellation Info */}
            {meeting.status === "cancelled" && meeting.cancellationReason && (
              <DetailCard
                variant="default"
                className="border-red-200 dark:border-red-800/50 midnight:border-red-800/50 purple:border-red-800/50"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400 mb-2">
                      Cancellation Reason
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 midnight:text-gray-300 purple:text-gray-300 leading-relaxed">
                      {meeting.cancellationReason}
                    </p>
                    {meeting.cancelledByName && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 mt-2">
                        Cancelled by {meeting.cancelledByName}
                      </p>
                    )}
                  </div>
                </div>
              </DetailCard>
            )}
          </DetailPageLayout>
        </div>
      }
    />
  );
}
