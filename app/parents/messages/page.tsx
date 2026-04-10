"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DashboardPage from "@/components/shared/DashboardPage";
import ActionButton from "@/components/shared/ActionButton";
import EmojiPickerPopover from "@/components/shared/EmojiPickerPopover";
import {
  MessageSquare,
  Mail,
  MailOpen,
  Send,
  Search,
  Clock,
  Star,
  Paperclip,
  Plus,
  Inbox,
  Archive,
  Trash2,
  User,
  MoreHorizontal,
  Reply,
  Forward,
  ChevronDown,
  Check,
  Filter,
  Sparkles,
  ArrowLeft,
  X,
  XCircle,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import type { ParentMessage } from "@/types/parent";

// Extended message interface for sent messages
interface ExtendedMessage extends ParentMessage {
  type: "received" | "sent";
  recipientName?: string;
  recipientRole?: "Teacher" | "Admin" | "Principal";
  recipientAvatar?: string;
}

// Mock Received Messages Data
const MOCK_RECEIVED_MESSAGES: ExtendedMessage[] = [
  {
    id: "msg-001",
    type: "received",
    senderId: "teacher-001",
    senderName: "Mrs. Nkechi Eze",
    senderRole: "Teacher",
    senderAvatar: "https://i.pravatar.cc/150?u=nkechi",
    subject: "Mathematics Progress Report for Adaeze",
    content: `Dear Mr. Okonkwo,

I hope this message finds you well. I wanted to share some updates about Adaeze's progress in Mathematics this term.

Adaeze has shown remarkable improvement in her mathematical skills, particularly in algebra and geometry. She has been actively participating in class discussions and consistently completes her homework on time.

Key highlights:
- Scored 85% in the mid-term test
- Shows excellent problem-solving abilities
- Helps classmates understand difficult concepts

Areas for improvement:
- Could practice more word problems
- Should work on time management during tests

I believe with continued support at home, Adaeze will excel further. Please feel free to reach out if you have any questions.

Best regards,
Mrs. Nkechi Eze
Mathematics Teacher`,
    timestamp: "2024-01-18T10:30:00Z",
    isRead: false,
    childId: "child-001",
    childName: "Adaeze Okonkwo",
  },
  {
    id: "msg-002",
    type: "received",
    senderId: "admin-001",
    senderName: "School Admin",
    senderRole: "Admin",
    subject: "Fee Payment Reminder - 2nd Term",
    content: `Dear Parent/Guardian,

This is a friendly reminder that the school fees for the 2nd Term of the 2024/2025 academic session is due on February 15, 2024.

Please ensure payment is made before the due date to avoid any late fees.

Payment can be made through:
- Bank Transfer
- Card Payment (online)
- Cash at the school bursary

Thank you for your continued support.

Best regards,
School Administration`,
    timestamp: "2024-01-15T09:00:00Z",
    isRead: true,
  },
  {
    id: "msg-003",
    type: "received",
    senderId: "principal-001",
    senderName: "Dr. Emmanuel Obi",
    senderRole: "Principal",
    senderAvatar: "https://i.pravatar.cc/150?u=principal",
    subject: "Welcome Back to School - New Term Message",
    content: `Dear Parents,

I hope this message finds you and your families in good health. As we begin the second term of the 2024/2025 academic session, I want to welcome you all back.

This term promises to be exciting with several activities planned:
- Inter-house Sports Competition (February 20th)
- Science Fair (March 5th)
- Cultural Day (March 15th)

I encourage all parents to actively participate in their children's education. Your involvement makes a significant difference in their academic success.

Please don't hesitate to reach out if you have any concerns or suggestions.

Warm regards,
Dr. Emmanuel Obi
Principal`,
    timestamp: "2024-01-08T08:00:00Z",
    isRead: true,
  },
  {
    id: "msg-004",
    type: "received",
    senderId: "teacher-002",
    senderName: "Mr. Oluwaseun Adeyemi",
    senderRole: "Teacher",
    senderAvatar: "https://i.pravatar.cc/150?u=oluwaseun",
    subject: "Physics Lab Session Reminder",
    content: `Dear Mr. Okonkwo,

I'm writing to remind you that Chukwuemeka has a physics practical session scheduled for next week Thursday.

Please ensure he comes with:
- Lab coat
- Safety goggles
- Scientific calculator
- Practical notebook

The session will cover electricity and magnetism experiments.

Best regards,
Mr. Oluwaseun Adeyemi
Physics Teacher`,
    timestamp: "2024-01-17T14:20:00Z",
    isRead: false,
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
  },
  {
    id: "msg-005",
    type: "received",
    senderId: "system",
    senderName: "System Notification",
    senderRole: "System",
    subject: "Attendance Alert - Adaeze Okonkwo",
    content: `This is an automated notification to inform you that Adaeze Okonkwo was marked absent on January 16, 2024.

If this was a planned absence, please contact the school administration with the appropriate documentation.

This message was automatically generated by the school management system.`,
    timestamp: "2024-01-16T09:30:00Z",
    isRead: true,
    childId: "child-001",
    childName: "Adaeze Okonkwo",
  },
];

// Mock Sent Messages Data
const MOCK_SENT_MESSAGES: ExtendedMessage[] = [
  {
    id: "sent-001",
    type: "sent",
    senderId: "parent-001",
    senderName: "Me",
    senderRole: "Admin", // Using Admin to represent parent for styling
    subject: "Request for Leave - Adaeze Okonkwo",
    recipientName: "Mrs. Nkechi Eze",
    recipientRole: "Teacher",
    recipientAvatar: "https://i.pravatar.cc/150?u=nkechi",
    content: `Dear Mrs. Eze,

I am writing to inform you that Adaeze will be absent from school on January 22nd and 23rd due to a family event.

She has a family wedding to attend in Lagos and we will be traveling on those days. I would appreciate it if you could provide any assignments or notes she might miss during this period.

We will ensure she catches up with all the work upon her return.

Thank you for your understanding.

Best regards,
Mr. Okonkwo`,
    timestamp: "2024-01-19T08:15:00Z",
    isRead: true,
    childId: "child-001",
    childName: "Adaeze Okonkwo",
  },
  {
    id: "sent-002",
    type: "sent",
    senderId: "parent-001",
    senderName: "Me",
    senderRole: "Admin",
    subject: "Inquiry About Extra Classes",
    recipientName: "Mr. Oluwaseun Adeyemi",
    recipientRole: "Teacher",
    recipientAvatar: "https://i.pravatar.cc/150?u=oluwaseun",
    content: `Dear Mr. Adeyemi,

I hope this message finds you well. I am writing to inquire about the possibility of extra physics classes for Chukwuemeka.

He has been showing great interest in physics and I believe additional tutoring would help him excel further. Could you please let me know:

1. Are there any after-school physics programs available?
2. What are the costs involved?
3. When would these classes be held?

I look forward to hearing from you.

Best regards,
Mr. Okonkwo`,
    timestamp: "2024-01-14T16:45:00Z",
    isRead: true,
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
  },
  {
    id: "sent-003",
    type: "sent",
    senderId: "parent-001",
    senderName: "Me",
    senderRole: "Admin",
    subject: "Re: Fee Payment Reminder - 2nd Term",
    recipientName: "School Admin",
    recipientRole: "Admin",
    content: `Dear School Administration,

Thank you for the reminder. I have completed the fee payment via bank transfer today.

Transaction Reference: TRF-2024-98765432
Amount: ₦150,000
Date: January 16, 2024

Please confirm receipt of payment at your earliest convenience.

Best regards,
Mr. Okonkwo`,
    timestamp: "2024-01-16T11:30:00Z",
    isRead: true,
  },
];

// Combine all messages
const MOCK_MESSAGES: ExtendedMessage[] = [...MOCK_RECEIVED_MESSAGES, ...MOCK_SENT_MESSAGES];

type FilterType = "all" | "unread" | "starred" | "sent";

export default function ParentMessagesPage() {
  const searchParams = useSearchParams();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ExtendedMessage | null>(null);
  const [starredMessages, setStarredMessages] = useState<Set<string>>(new Set());
  const [replyText, setReplyText] = useState("");
  const [showMobileMessage, setShowMobileMessage] = useState(false);
  const [replyAttachments, setReplyAttachments] = useState<File[]>([]);
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Ref for file input
  const replyFileInputRef = useRef<HTMLInputElement>(null);

  // Auto-select message from URL query param
  useEffect(() => {
    const selectedId = searchParams.get("selected") || searchParams.get("messageId");
    const action = searchParams.get("action");
    const fromAdmin = searchParams.get("from") === "admin";

    if (selectedId && !selectedMessage) {
      // Try to find the message by ID
      let message = MOCK_MESSAGES.find((msg) => msg.id === selectedId);

      // If coming from admin and message not found, select the first received message as fallback
      // (In a real app, IDs would match - this is just for demo purposes)
      if (!message && fromAdmin) {
        message = MOCK_RECEIVED_MESSAGES[0];
      }

      if (message) {
        setSelectedMessage(message);
        setShowMobileMessage(true);
        // If it's a sent message, switch to sent filter
        if (message.type === "sent") {
          setSelectedFilter("sent");
        }
        // If action is reply, focus the reply textarea and scroll to it
        if (action === "reply" && message.type !== "sent") {
          setTimeout(() => {
            const replyTextarea = document.querySelector('textarea[placeholder="Type your reply..."]') as HTMLTextAreaElement;
            if (replyTextarea) {
              replyTextarea.scrollIntoView({ behavior: "smooth", block: "center" });
              replyTextarea.focus();
            }
          }, 300);
        }
      }
    }
  }, [searchParams, selectedMessage]);

  // Filter messages
  const filteredMessages = useMemo(() => {
    return MOCK_MESSAGES.filter((msg) => {
      // For "sent" filter, only show sent messages
      if (selectedFilter === "sent") {
        return msg.type === "sent";
      }
      // For all other filters, only show received messages
      if (msg.type === "sent") {
        return false;
      }
      const matchesFilter =
        selectedFilter === "all" ||
        (selectedFilter === "unread" && !msg.isRead) ||
        (selectedFilter === "starred" && starredMessages.has(msg.id));
      const matchesSearch =
        searchQuery === "" ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (msg.recipientName && msg.recipientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        msg.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [selectedFilter, searchQuery, starredMessages]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = MOCK_RECEIVED_MESSAGES.length;
    const unread = MOCK_RECEIVED_MESSAGES.filter((m) => !m.isRead).length;
    const starred = starredMessages.size;
    const sent = MOCK_SENT_MESSAGES.length;
    return { total, unread, starred, sent };
  }, [starredMessages]);

  // Toggle star
  const toggleStar = (msgId: string) => {
    setStarredMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(msgId)) {
        newSet.delete(msgId);
      } else {
        newSet.add(msgId);
      }
      return newSet;
    });
  };

  // Get role badge styles
  const getRoleBadgeStyles = (role: ParentMessage["senderRole"]) => {
    const styles = {
      Teacher: {
        bg: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30",
        text: "text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
        ring: "ring-blue-500/20",
      },
      Admin: {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-700 dark:text-purple-400",
        ring: "ring-purple-500/20",
      },
      Principal: {
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        text: "text-emerald-700 dark:text-emerald-400",
        ring: "ring-emerald-500/20",
      },
      System: {
        bg: "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50",
        text: "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300",
        ring: "ring-gray-500/20",
      },
    };
    return styles[role];
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
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
    } else {
      return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    }
  };

  // Format full date
  const formatFullDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Handle message selection
  const handleSelectMessage = (message: ExtendedMessage) => {
    setSelectedMessage(message);
    setShowMobileMessage(true);
  };

  // Handle emoji selection for reply
  const handleEmojiSelect = (emoji: string) => {
    setReplyText((prev) => prev + emoji);
  };

  // Handle file selection for reply
  const handleReplyFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setReplyAttachments((prev) => [...prev, ...files]);
    if (replyFileInputRef.current) replyFileInputRef.current.value = "";
  };

  // Remove attachment
  const removeReplyAttachment = (index: number) => {
    setReplyAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />;
    if (file.type.includes("pdf")) return <FileText className="w-4 h-4 text-red-500" />;
    if (file.type.includes("word") || file.type.includes("document")) return <FileText className="w-4 h-4 text-blue-500" />;
    return <FileText className="w-4 h-4" />;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Send reply
  const handleSendReply = () => {
    if (!replyText.trim() && replyAttachments.length === 0) return;
    setIsSendingReply(true);
    // Simulate sending
    setTimeout(() => {
      setIsSendingReply(false);
      setReplyText("");
      setReplyAttachments([]);
      // Show success (in real app, would update messages list)
      alert("Reply sent successfully!");
    }, 1500);
  };

  // Get navigation context from URL params
  const fromAdmin = searchParams.get("from") === "admin";
  const messageSubject = searchParams.get("subject");

  // Build breadcrumbs based on navigation context
  const breadcrumbs = fromAdmin
    ? [
        { label: "Dashboard", href: "/admin" },
        { label: "Parents", href: "/admin/parents" },
        { label: "Messages", href: "/admin/parents/messages" },
        ...(messageSubject ? [{ label: messageSubject.length > 30 ? messageSubject.slice(0, 30) + "..." : messageSubject }] : []),
      ]
    : [
        { label: "Parent Portal", href: "/parents" },
        { label: "Messages" },
      ];

  return (
    <DashboardPage
      title="Messages"
      breadcrumbs={breadcrumbs}
      loadingText="Loading Messages"
      afterStats={
        <div className="transition-opacity duration-500">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <Link href="/parents/messages/compose">
              <ActionButton
                variant="primary"
                color="blue"
                size="md"
                icon={<Plus className="w-full h-full" />}
              >
                Compose Message
              </ActionButton>
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Total Messages */}
            <div className="group relative flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 to-white dark:from-blue-900/20 dark:to-gray-800/50 border border-blue-100/50 dark:border-blue-800/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Inbox className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{stats.total}</p>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 uppercase tracking-wide">Total Messages</p>
              </div>
            </div>

            {/* Unread Messages */}
            <div className="group relative flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-red-50/80 to-white dark:from-red-900/20 dark:to-gray-800/50 border border-red-100/50 dark:border-red-800/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                {stats.unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-800">
                    {stats.unread}
                  </span>
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{stats.unread}</p>
                <p className="text-xs font-medium text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 uppercase tracking-wide">Unread</p>
              </div>
            </div>

            {/* Sent Messages */}
            <div className="group relative flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-white dark:from-emerald-900/20 dark:to-gray-800/50 border border-emerald-100/50 dark:border-emerald-800/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{stats.sent}</p>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Sent</p>
              </div>
            </div>

            {/* Starred Messages */}
            <div className="group relative flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 to-white dark:from-amber-900/20 dark:to-gray-800/50 border border-amber-100/50 dark:border-amber-800/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{stats.starred}</p>
                <p className="text-xs font-medium text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400 uppercase tracking-wide">Starred</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Chat-like Layout */}
        <div className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
            {/* Message List Sidebar */}
            <div
              className={`lg:col-span-4 xl:col-span-4 border-r border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 flex min-w-0 flex-col ${
                showMobileMessage ? "hidden lg:flex" : "flex"
              }`}
            >
              {/* Search & Filter Header */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/50 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50 border-0 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>

                {/* Compact Tabs - Inbox vs Sent */}
                <div className="flex gap-1 p-0.5 bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/60 midnight:bg-[#0f1330]/60 purple:bg-[#251340]/60 rounded-lg">
                  <button
                    onClick={() => setSelectedFilter("all")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      selectedFilter !== "sent"
                        ? "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 shadow-sm"
                        : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:text-gray-700 dark:hover:text-gray-300 midnight:hover:text-cyan-200 purple:hover:text-pink-200"
                    }`}
                  >
                    <Inbox className="w-4 h-4" />
                    <span>Inbox</span>
                    {stats.unread > 0 && (
                      <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold bg-red-500 text-white">
                        {stats.unread}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedFilter("sent")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      selectedFilter === "sent"
                        ? "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-emerald-600 dark:text-emerald-400 shadow-sm"
                        : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:text-gray-700 dark:hover:text-gray-300 midnight:hover:text-cyan-200 purple:hover:text-pink-200"
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>Sent</span>
                    <span className={`flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold ${
                      selectedFilter === "sent"
                        ? "bg-emerald-100 dark:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                        : "bg-gray-200 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"
                    }`}>
                      {stats.sent}
                    </span>
                  </button>
                </div>

                {/* Compact Sub-filters for Inbox */}
                {selectedFilter !== "sent" && (
                  <div className="flex items-center gap-2">
                    {[
                      { id: "all", label: "All", count: stats.total },
                      { id: "unread", label: "Unread", count: stats.unread },
                      { id: "starred", label: "Starred", count: stats.starred, hasIcon: true },
                    ].map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setSelectedFilter(filter.id as FilterType)}
                        className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${
                          selectedFilter === filter.id
                            ? "bg-blue-500 dark:bg-blue-600 midnight:bg-cyan-600 purple:bg-pink-600 text-white"
                            : "bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                        }`}
                      >
                        {filter.hasIcon && (
                          <Star className={`w-3.5 h-3.5 ${selectedFilter === filter.id ? "fill-current" : ""}`} />
                        )}
                        {filter.label}
                        <span className={`text-[10px] font-bold ${
                          selectedFilter === filter.id
                            ? "text-white/80"
                            : "text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400"
                        }`}>
                          {filter.count}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      selectedFilter === "sent"
                        ? "bg-emerald-100 dark:bg-emerald-900/30"
                        : "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]"
                    }`}>
                      {selectedFilter === "sent" ? (
                        <Send className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
                      ) : (
                        <MessageSquare className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 font-medium">
                      {selectedFilter === "sent" ? "No sent messages" : "No messages found"}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 mt-1">
                      {selectedFilter === "sent"
                        ? "Messages you send will appear here"
                        : "Try adjusting your filters"}
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Section Header */}
                    <div className={`sticky top-0 z-10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide border-b ${
                      selectedFilter === "sent"
                        ? "bg-emerald-50/80 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/20"
                        : "bg-blue-50/80 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 border-blue-100 dark:border-blue-800/20"
                    }`}>
                      <span className="flex items-center gap-1.5">
                        {selectedFilter === "sent" ? <Send className="w-3 h-3" /> : <Inbox className="w-3 h-3" />}
                        {selectedFilter === "sent" ? "Sent" : selectedFilter === "unread" ? "Unread" : selectedFilter === "starred" ? "Starred" : "Inbox"} ({filteredMessages.length})
                      </span>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {filteredMessages.map((message) => {
                      const isSent = message.type === "sent";
                      const displayName = isSent ? message.recipientName || "Unknown" : message.senderName;
                      const displayAvatar = isSent ? message.recipientAvatar : message.senderAvatar;
                      const displayRole = isSent ? message.recipientRole : message.senderRole;
                      const roleStyles = getRoleBadgeStyles(displayRole || "System");
                      const isSelected = selectedMessage?.id === message.id;

                      return (
                        <div
                          key={message.id}
                          onClick={() => handleSelectMessage(message)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === "Enter" && handleSelectMessage(message)}
                          className={`relative p-4 transition-all cursor-pointer group ${
                            isSelected
                              ? "bg-blue-50/80 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20"
                              : !message.isRead && !isSent
                              ? "bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent"
                              : "hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10/30"
                          }`}
                        >
                          {/* Selection indicator */}
                          {isSelected && (
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${isSent ? "bg-emerald-500" : "bg-blue-500"} rounded-r`} />
                          )}

                          <div className="flex gap-3">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                              <div className={`w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br ${isSent ? "from-emerald-200 to-emerald-300 dark:from-emerald-600 dark:to-emerald-700" : "from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700"} ring-2 ring-white dark:ring-gray-800`}>
                                {displayAvatar ? (
                                  <Image
                                    src={displayAvatar}
                                    alt={displayName}
                                    width={44}
                                    height={44}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    {isSent ? (
                                      <Send className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                      <User className="w-5 h-5 text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
                                    )}
                                  </div>
                                )}
                              </div>
                              {/* Online indicator for teachers (only for received messages) */}
                              {!isSent && displayRole === "Teacher" && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-gray-800" />
                              )}
                              {/* Sent indicator */}
                              {isSent && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-gray-800 flex items-center justify-center">
                                  <Check className="w-2 h-2 text-white" />
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-0.5">
                                <span className={`text-sm truncate ${
                                  !message.isRead && !isSent
                                    ? "font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
                                    : "font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"
                                }`}>
                                  {isSent ? (
                                    <span className="flex items-center gap-1">
                                      <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">To:</span>
                                      {displayName}
                                    </span>
                                  ) : (
                                    displayName
                                  )}
                                </span>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  {!message.isRead && !isSent && (
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                  )}
                                  <span className="text-[11px] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                                    {formatTime(message.timestamp)}
                                  </span>
                                </div>
                              </div>

                              <p className={`text-sm truncate mb-1.5 ${
                                !message.isRead && !isSent
                                  ? "font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100"
                                  : "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"
                              }`}>
                                {message.subject}
                              </p>

                              <div className="flex items-center gap-2">
                                {isSent ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/20">
                                    Sent
                                  </span>
                                ) : (
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${roleStyles.bg} ${roleStyles.text} ring-1 ${roleStyles.ring}`}>
                                    {displayRole}
                                  </span>
                                )}
                                {message.childName && (
                                  <span className="text-[11px] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 truncate">
                                    {message.childName}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Star button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStar(message.id);
                              }}
                              className={`flex-shrink-0 p-1 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                                starredMessages.has(message.id)
                                  ? "opacity-100 text-amber-500"
                                  : "text-gray-300 dark:text-gray-600 midnight:text-cyan-500 purple:text-pink-500 hover:text-amber-500"
                              }`}
                            >
                              <Star className={`w-4 h-4 ${starredMessages.has(message.id) ? "fill-current" : ""}`} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Message View Panel */}
            <div
              className={`lg:col-span-8 xl:col-span-8 flex min-w-0 flex-col ${
                !showMobileMessage ? "hidden lg:flex" : "flex"
              }`}
            >
              {selectedMessage ? (
                (() => {
                  const isSentMessage = selectedMessage.type === "sent";
                  const viewDisplayName = isSentMessage ? selectedMessage.recipientName || "Unknown" : selectedMessage.senderName;
                  const viewDisplayAvatar = isSentMessage ? selectedMessage.recipientAvatar : selectedMessage.senderAvatar;
                  const viewDisplayRole = isSentMessage ? selectedMessage.recipientRole : selectedMessage.senderRole;

                  return (
                <>
                  {/* Message Header */}
                  <div className="p-4 lg:p-6 border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/50">
                    {/* Mobile back button */}
                    <button
                      onClick={() => setShowMobileMessage(false)}
                      className="lg:hidden flex items-center gap-2 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-4 hover:text-gray-900 dark:hover:text-white midnight:hover:text-cyan-50 purple:hover:text-pink-50 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="text-sm font-medium">Back to messages</span>
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Sent message indicator */}
                        {isSentMessage && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
                            <Send className="w-3 h-3" />
                            Sent Message
                          </div>
                        )}
                        <h2 className="text-base min-[420px]:text-lg lg:text-xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-3 leading-tight break-words">
                          {selectedMessage.subject}
                        </h2>

                        <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center gap-4">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br ${isSentMessage ? "from-emerald-200 to-emerald-300 dark:from-emerald-600 dark:to-emerald-700" : "from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700"} ring-2 ring-white dark:ring-gray-700 midnight:ring-cyan-500/20 purple:ring-pink-500/20 shadow-md`}>
                              {viewDisplayAvatar ? (
                                <Image
                                  src={viewDisplayAvatar}
                                  alt={viewDisplayName}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  {isSentMessage ? (
                                    <Send className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                  ) : (
                                    <User className="w-6 h-6 text-gray-500" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                                {isSentMessage ? "To:" : "From:"}
                              </span>
                              <span className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                                {viewDisplayName}
                              </span>
                              {isSentMessage ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                                  {viewDisplayRole}
                                </span>
                              ) : (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${getRoleBadgeStyles(selectedMessage.senderRole).bg} ${getRoleBadgeStyles(selectedMessage.senderRole).text}`}>
                                  {selectedMessage.senderRole}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 flex items-start gap-1 break-words">
                              <Clock className="w-3.5 h-3.5" />
                              {formatFullDate(selectedMessage.timestamp)}
                            </p>
                            {selectedMessage.childName && (
                              <p className="text-sm text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-0.5 flex items-center gap-1">
                                <User className="w-3.5 h-3.5" />
                                Regarding: {selectedMessage.childName}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 self-start sm:self-auto">
                        <button
                          onClick={() => toggleStar(selectedMessage.id)}
                          className={`p-2 rounded-xl transition-all cursor-pointer ${
                            starredMessages.has(selectedMessage.id)
                              ? "text-amber-500 bg-amber-50 dark:bg-amber-900/20"
                              : "text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                          }`}
                        >
                          <Star className={`w-5 h-5 ${starredMessages.has(selectedMessage.id) ? "fill-current" : ""}`} />
                        </button>
                        <button className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all cursor-pointer">
                          <Archive className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-900/20 purple:hover:bg-red-900/20 transition-all cursor-pointer">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                    <div className={`rounded-2xl p-5 lg:p-6 ${isSentMessage ? "bg-emerald-50/50 dark:bg-emerald-900/10" : "bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/30"}`}>
                      <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                        {selectedMessage.content.split("\n").map((line, idx) => (
                          <p key={idx} className="mb-2 text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 leading-relaxed break-words">
                            {line || <br />}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Reply Section - Only show for received messages */}
                  {!isSentMessage && (
                  <div className="p-4 lg:p-6 border-t border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/50 bg-gray-50/50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50">
                    <div className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey && (replyText.trim() || replyAttachments.length > 0)) {
                            e.preventDefault();
                            handleSendReply();
                          }
                        }}
                        placeholder="Type your reply..."
                        rows={3}
                        className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder:text-gray-400 text-sm resize-none focus:outline-none"
                      />

                      {/* Attachment Preview */}
                      {replyAttachments.length > 0 && (
                        <div className="px-4 pb-3">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                            Attachments ({replyAttachments.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {replyAttachments.map((file, index) => (
                              <div
                                key={index}
                                className="group relative flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"
                              >
                                {file.type.startsWith("image/") ? (
                                  <div className="w-8 h-8 rounded overflow-hidden bg-gray-200 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 flex-shrink-0">
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={file.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded bg-gray-100 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                    {getFileIcon(file)}
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 truncate max-w-[120px]">
                                    {file.name}
                                  </p>
                                  <p className="text-[10px] text-gray-400">{formatFileSize(file.size)}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeReplyAttachment(index)}
                                  className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/50">
                        <div className="flex items-center gap-1">
                          <EmojiPickerPopover
                            onEmojiSelect={handleEmojiSelect}
                            position="top"
                          />
                          <button
                            type="button"
                            onClick={() => replyFileInputRef.current?.click()}
                            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                          >
                            <Paperclip className="w-5 h-5" />
                          </button>
                          <input
                            ref={replyFileInputRef}
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                            onChange={handleReplyFileSelect}
                            className="hidden"
                          />
                        </div>
                        <button
                          onClick={handleSendReply}
                          disabled={(!replyText.trim() && replyAttachments.length === 0) || isSendingReply}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-blue-500/25 transition-all"
                        >
                          {isSendingReply ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>Send Reply</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  )}
                </>
                  );
                })()
              ) : (
                /* Empty State */
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl scale-150 animate-pulse" />
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 flex items-center justify-center">
                      <MessageSquare className="w-12 h-12 text-blue-500 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">
                    Select a message
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 text-center max-w-xs mb-6">
                    Choose a message from the list to view its contents and reply
                  </p>
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                    <Sparkles className="w-4 h-4" />
                    <span>{stats.unread} unread messages waiting</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      }
    />
  );
}
