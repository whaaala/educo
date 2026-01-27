// Shared call log types for use across different recipient types (parents, teachers, students, staff)

export type CallType = "video" | "voice";
export type CallStatus = "completed" | "missed" | "declined" | "no_answer";
export type CallDirection = "incoming" | "outgoing";

export interface CallLog {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  recipientEmail?: string;
  recipientRole?: "Parent" | "Teacher" | "Admin" | "Principal" | "Student" | "Staff";
  callType: CallType;
  callDirection: CallDirection;
  callStatus: CallStatus;
  startTime: string;
  endTime?: string;
  duration?: number; // in seconds
  recordingUrl?: string;
  notes?: string;
  childName?: string; // For parent calls, the related child
}

// Stats interface for call log statistics
export interface CallLogStats {
  total: number;
  videoCalls: number;
  voiceCalls: number;
  completed: number;
  missed: number;
  totalDuration: number; // in seconds
}

// Configuration for the call logs page
export interface CallLogsPageConfig {
  recipientType: "parent" | "teacher" | "student" | "staff";
  recipientLabel: string; // e.g., "Parent", "Teacher"
  recipientLabelPlural: string; // e.g., "Parents", "Teachers"
  pageTitle: string;
  basePath: string; // e.g., "/admin/parents"
  breadcrumbs: Array<{ label: string; href?: string; isActive?: boolean }>;
  viewCallUrl?: (call: CallLog) => string;
  startNewCallUrl?: string;
}

// Filter values type
export interface CallLogFilterValues {
  type?: string[];
  status?: string[];
  direction?: string[];
}

// Sort options for call logs
export const CALL_LOG_SORT_OPTIONS = [
  { label: "Most Recent", value: "recent" },
  { label: "Oldest First", value: "oldest" },
  { label: "Longest Duration", value: "duration_desc" },
  { label: "Shortest Duration", value: "duration_asc" },
  { label: "A-Z (Name)", value: "name_asc" },
  { label: "Z-A (Name)", value: "name_desc" },
] as const;

// Default filter fields for call logs
export const DEFAULT_CALL_LOG_FILTER_FIELDS = [
  { id: "type", label: "Call Type", options: ["Video", "Voice"], width: "half" as const },
  { id: "status", label: "Status", options: ["Completed", "Missed", "Declined", "No Answer"], width: "half" as const },
  { id: "direction", label: "Direction", options: ["Incoming", "Outgoing"], width: "half" as const },
];

// Status configuration for badges
export const CALL_STATUS_CONFIG: Record<CallStatus, { bg: string; text: string; label: string }> = {
  completed: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", label: "Completed" },
  missed: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", label: "Missed" },
  declined: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", label: "Declined" },
  no_answer: { bg: "bg-gray-100 dark:bg-gray-700/50", text: "text-gray-700 dark:text-gray-400", label: "No Answer" },
};

// Helper to format duration
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

// Helper to format call time
export function formatCallTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  } else if (days === 1) {
    return "Yesterday";
  } else if (days < 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
