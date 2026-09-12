// Shared chat types for use across different recipient types (parents, teachers, students, staff)

export interface ChatConversation {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  recipientEmail: string;
  recipientRole?: "Parent" | "Teacher" | "Admin" | "Principal" | "Student" | "Staff";
  lastMessage: string;
  lastMessageTime: string;
  lastMessageFrom: "recipient" | "admin";
  unreadCount: number;
  isOnline: boolean;
  isPinned: boolean;
  childName?: string;
}

// Stats interface for chat statistics
export interface ChatStats {
  total: number;
  active: number;
  unread: number;
  totalUnreadMessages: number;
}

// Configuration for the chat page
export interface ChatPageConfig {
  recipientType: "parent" | "teacher" | "student" | "staff";
  recipientLabel: string; // e.g., "Parent", "Teacher"
  recipientLabelPlural: string; // e.g., "Parents", "Teachers"
  pageTitle: string;
  basePath: string; // e.g., "/admin/parents"
  breadcrumbs: Array<{ label: string; href?: string; isActive?: boolean }>;
  composeUrl?: string;
  viewChatUrl?: (chat: ChatConversation) => string;
}

// Filter values type
export interface ChatFilterValues {
  status?: string[];
  messages?: string[];
}

// Sort options for chats
export const CHAT_SORT_OPTIONS = [
  { label: "Most Recent", value: "recent" },
  { label: "Oldest First", value: "oldest" },
  { label: "Most Unread", value: "unread" },
  { label: "A-Z (Name)", value: "name_asc" },
  { label: "Z-A (Name)", value: "name_desc" },
] as const;

// Default filter fields for chat
export const DEFAULT_CHAT_FILTER_FIELDS = [
  { id: "status", label: "Status", options: ["Online", "Offline"], width: "half" as const },
  { id: "messages", label: "Messages", options: ["Unread", "Read"], width: "half" as const },
];
