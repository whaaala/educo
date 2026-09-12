// Shared message types for use across different recipient types (parents, teachers, students, staff)

export interface AdminMessage {
  id: string;
  type: "received" | "sent";
  senderId: string;
  senderName: string;
  senderRole: "Parent" | "Teacher" | "Admin" | "Principal" | "System" | "Student" | "Staff";
  senderAvatar?: string;
  recipientId: string;
  recipientName: string;
  recipientRole: "Parent" | "Teacher" | "Admin" | "Principal" | "Student" | "Staff";
  recipientAvatar?: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  hasAttachment: boolean;
  priority: "low" | "normal" | "high";
  category: MessageCategory;
  childName?: string;
  childId?: string;
}

export type MessageCategory = "Academic" | "Fee" | "Event" | "General" | "Complaint" | "Inquiry";

export type MessageType = "received" | "sent";

export type MessagePriority = "low" | "normal" | "high";

export type MessageStatus = "read" | "unread";

// Stats interface for message statistics
export interface MessageStats {
  total: number;
  received: number;
  sent: number;
  unread: number;
  highPriority: number;
}

// Configuration for the messages page
export interface MessagesPageConfig {
  recipientType: "parent" | "teacher" | "student" | "staff";
  pageTitle: string;
  basePath: string; // e.g., "/admin/parents"
  breadcrumbs: Array<{ label: string; href?: string; isActive?: boolean }>;
  composeUrl?: string;
  viewMessageUrl?: (msg: AdminMessage) => string;
  replyMessageUrl?: (msg: AdminMessage) => string;
}

// Filter values type
export interface MessageFilterValues {
  type?: string[];
  status?: string[];
  category?: string[];
  priority?: string[];
}

// Sort options for messages
export const MESSAGE_SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "High Priority", value: "priority" },
  { label: "A-Z (Sender)", value: "sender_asc" },
  { label: "Z-A (Sender)", value: "sender_desc" },
] as const;

// Category configuration for badges
export const CATEGORY_CONFIG: Record<MessageCategory, { bg: string; text: string }> = {
  Academic: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400" },
  Fee: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400" },
  Event: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400" },
  General: { bg: "bg-gray-100 dark:bg-gray-700/50", text: "text-gray-700 dark:text-gray-400" },
  Complaint: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400" },
  Inquiry: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400" },
};

// Default filter fields for messages
export const DEFAULT_MESSAGE_FILTER_FIELDS = [
  {
    id: "type",
    label: "Type",
    options: ["Received", "Sent"],
    width: "half" as const,
  },
  {
    id: "status",
    label: "Status",
    options: ["Read", "Unread"],
    width: "half" as const,
  },
  {
    id: "category",
    label: "Category",
    options: ["Academic", "Fee", "Event", "General", "Complaint", "Inquiry"],
    width: "half" as const,
  },
  {
    id: "priority",
    label: "Priority",
    options: ["High", "Normal", "Low"],
    width: "half" as const,
  },
];
