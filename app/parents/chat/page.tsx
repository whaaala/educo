"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DashboardPage from "@/components/shared/DashboardPage";
import ActionButton from "@/components/shared/ActionButton";
import EmojiPickerPopover from "@/components/shared/EmojiPickerPopover";
import {
  MessageCircle,
  Send,
  Paperclip,
  Search,
  User,
  Circle,
  CheckCheck,
  Check,
  Plus,
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  XCircle,
  FileText,
  Image as ImageIcon,
  Smile,
} from "lucide-react";

// Chat contact type
interface ChatContact {
  id: string;
  name: string;
  role: "Teacher" | "Admin" | "Principal";
  avatar?: string;
  email: string;
  isOnline: boolean;
  lastSeen?: string;
}

// Chat message type
interface ChatMessage {
  id: string;
  contactId: string;
  from: "parent" | "staff";
  message: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  attachments?: { name: string; type: string; url: string }[];
}

// Mock contacts
// Use a fixed base date to avoid hydration mismatch
const BASE_DATE = new Date("2026-01-25T12:00:00").getTime();

const MOCK_CONTACTS: ChatContact[] = [
  { id: "teacher-001", name: "Mrs. Nkechi Eze", role: "Teacher", avatar: "https://i.pravatar.cc/150?u=nkechi", email: "nkechi.eze@school.com", isOnline: true },
  { id: "teacher-002", name: "Mr. Oluwaseun Adeyemi", role: "Teacher", avatar: "https://i.pravatar.cc/150?u=oluwaseun", email: "oluwaseun.a@school.com", isOnline: false, lastSeen: new Date(BASE_DATE - 3600000).toISOString() },
  { id: "admin-001", name: "Mrs. Adaeze Okonkwo", role: "Admin", avatar: "https://i.pravatar.cc/150?u=adaeze", email: "admin@school.com", isOnline: true },
  { id: "principal-001", name: "Dr. Chukwuma Obi", role: "Principal", avatar: "https://i.pravatar.cc/150?u=chukwuma", email: "principal@school.com", isOnline: false, lastSeen: new Date(BASE_DATE - 7200000).toISOString() },
];

// Mock messages for each contact - use BASE_DATE for deterministic timestamps
const generateMockMessages = (contactId: string): ChatMessage[] => {
  const messages: ChatMessage[] = [
    { id: `${contactId}-1`, contactId, from: "staff", message: "Hello! How can I help you today?", timestamp: new Date(BASE_DATE - 86400000 * 2).toISOString(), status: "read" },
    { id: `${contactId}-2`, contactId, from: "parent", message: "Hi! I wanted to ask about my child's progress in Mathematics.", timestamp: new Date(BASE_DATE - 86400000 * 2 + 300000).toISOString(), status: "read" },
    { id: `${contactId}-3`, contactId, from: "staff", message: "Of course! Your child has been doing well. There's been significant improvement in problem-solving skills.", timestamp: new Date(BASE_DATE - 86400000).toISOString(), status: "read" },
    { id: `${contactId}-4`, contactId, from: "parent", message: "That's great to hear! Are there any areas that need more attention?", timestamp: new Date(BASE_DATE - 86400000 + 600000).toISOString(), status: "read" },
    { id: `${contactId}-5`, contactId, from: "staff", message: "I would recommend more practice with word problems. I can share some resources if you'd like.", timestamp: new Date(BASE_DATE - 3600000 * 5).toISOString(), status: "read" },
    { id: `${contactId}-6`, contactId, from: "parent", message: "Yes, please! That would be very helpful.", timestamp: new Date(BASE_DATE - 3600000 * 4).toISOString(), status: "delivered" },
  ];
  return messages;
};

// Conversation preview for sidebar
interface ConversationPreview {
  contact: ChatContact;
  lastMessage: ChatMessage;
  unreadCount: number;
}

export default function ParentChatPage() {
  const searchParams = useSearchParams();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Generate conversations
  const conversations = useMemo<ConversationPreview[]>(() => {
    return MOCK_CONTACTS.map((contact) => {
      const msgs = generateMockMessages(contact.id);
      return {
        contact,
        lastMessage: msgs[msgs.length - 1],
        unreadCount: contact.id === "teacher-001" ? 2 : contact.id === "admin-001" ? 1 : 0,
      };
    });
  }, []);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const search = searchQuery.toLowerCase();
    return conversations.filter(
      (c) => c.contact.name.toLowerCase().includes(search) || c.contact.role.toLowerCase().includes(search)
    );
  }, [conversations, searchQuery]);

  // Handle URL params (from admin navigation)
  useEffect(() => {
    const chatId = searchParams.get("chatId");
    const fromAdmin = searchParams.get("from") === "admin";
    const parentName = searchParams.get("parentName");

    if (chatId || fromAdmin) {
      // If coming from admin, select first contact as demo
      const contact = MOCK_CONTACTS[0];
      setSelectedContact(contact);
      setMessages(generateMockMessages(contact.id));
      setShowMobileChat(true);
    }
  }, [searchParams]);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle contact selection
  const handleSelectContact = (contact: ChatContact) => {
    setSelectedContact(contact);
    setMessages(generateMockMessages(contact.id));
    setShowMobileChat(true);
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!newMessage.trim() && attachments.length === 0) return;
    if (!selectedContact) return;

    setIsSending(true);

    const attachmentText = attachments.length > 0 ? `\n\n📎 ${attachments.length} attachment${attachments.length > 1 ? "s" : ""}` : "";

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      contactId: selectedContact.id,
      from: "parent",
      message: newMessage.trim() + attachmentText,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
    setAttachments([]);
    setIsSending(false);

    // Simulate typing and response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const response: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          contactId: selectedContact.id,
          from: "staff",
          message: "Thank you for your message! I'll get back to you shortly.",
          timestamp: new Date().toISOString(),
          status: "read",
        };
        setMessages((prev) => [...prev, response]);
      }, 2000);
    }, 1000);
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    const textarea = messageInputRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = newMessage.slice(0, start) + emoji + newMessage.slice(end);
      setNewMessage(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      }, 0);
    } else {
      setNewMessage((prev) => prev + emoji);
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />;
    if (file.type.includes("pdf")) return <FileText className="w-4 h-4 text-red-500" />;
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Format time
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
    }
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  // Format message date separator
  const formatDateSeparator = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  };

  // Get navigation context
  const fromAdmin = searchParams.get("from") === "admin";
  const breadcrumbs = fromAdmin
    ? [
        { label: "Dashboard", href: "/" },
        { label: "Admin" },
        { label: "Parents", href: "/admin/parents" },
        { label: "Chat", href: "/admin/parents/chat" },
        { label: selectedContact?.name || "Conversation" },
      ]
    : [{ label: "Parent Portal", href: "/parents" }, { label: "Chat" }];

  return (
    <DashboardPage
      title="Chat"
      breadcrumbs={breadcrumbs}
      loadingText="Loading Chat"
      afterStats={
        <div className="transition-opacity duration-500">
        {/* Header */}
        <div className="mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <Link href={fromAdmin ? "/parents/chat/compose?from=admin" : "/parents/chat/compose"}>
              <ActionButton variant="primary" color="blue" size="md" icon={<Plus className="w-full h-full" />}>
                New Chat
              </ActionButton>
            </Link>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm overflow-hidden h-[calc(100vh-220px)] min-h-[500px] flex">
          {/* Sidebar - Conversations List */}
          <div className={`w-full lg:w-80 xl:w-96 border-r border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 flex flex-col ${showMobileChat ? "hidden lg:flex" : "flex"}`}>
            {/* Search */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 text-sm outline-none"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 midnight:text-cyan-500 purple:text-pink-500 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 text-center">No conversations yet</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.contact.id}
                    onClick={() => handleSelectContact(conv.contact)}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer text-left border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 ${
                      selectedContact?.id === conv.contact.id ? "bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20" : ""
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]">
                        {conv.contact.avatar ? (
                          <Image src={conv.contact.avatar} alt={conv.contact.name} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                      </div>
                      {conv.contact.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className={`text-sm truncate ${conv.unreadCount > 0 ? "font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50" : "font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"}`}>
                          {conv.contact.name}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 flex-shrink-0">{formatTime(conv.lastMessage.timestamp)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {conv.lastMessage.from === "parent" && (
                            <CheckCheck className={`w-4 h-4 flex-shrink-0 ${conv.lastMessage.status === "read" ? "text-blue-500" : "text-gray-400"}`} />
                          )}
                          <p className={`text-xs truncate ${conv.unreadCount > 0 ? "font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100" : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"}`}>
                            {conv.lastMessage.message}
                          </p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs font-bold flex-shrink-0">{conv.unreadCount}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 mt-0.5">{conv.contact.role}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${!showMobileChat ? "hidden lg:flex" : "flex"}`}>
            {selectedContact ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]">
                  <button
                    onClick={() => setShowMobileChat(false)}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
                  </button>
                  <div className="relative flex-shrink-0">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]">
                      {selectedContact.avatar ? (
                        <Image src={selectedContact.avatar} alt={selectedContact.name} fill className="object-cover" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                    </div>
                    {selectedContact.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">{selectedContact.name}</p>
                    <p className={`text-xs ${selectedContact.isOnline ? "text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"}`}>
                      {selectedContact.isOnline ? "Online" : `Last seen ${formatTime(selectedContact.lastSeen || "")}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer">
                      <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer">
                      <Video className="w-5 h-5 text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer">
                      <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/30">
                  {messages.map((msg, index) => {
                    const isParent = msg.from === "parent";
                    const showDate = index === 0 || new Date(msg.timestamp).toDateString() !== new Date(messages[index - 1].timestamp).toDateString();

                    return (
                      <React.Fragment key={msg.id}>
                        {showDate && (
                          <div className="flex items-center justify-center">
                            <span className="px-3 py-1 rounded-full bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                              {formatDateSeparator(msg.timestamp)}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isParent ? "justify-end" : "justify-start"}`}>
                          <div className={`flex items-end gap-2 max-w-[75%] ${isParent ? "flex-row-reverse" : ""}`}>
                            {!isParent && (
                              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] flex-shrink-0">
                                {selectedContact.avatar ? (
                                  <Image src={selectedContact.avatar} alt={selectedContact.name} fill className="object-cover" unoptimized />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-gray-500" />
                                  </div>
                                )}
                              </div>
                            )}
                            <div>
                              <div
                                className={`px-4 py-2.5 rounded-2xl ${
                                  isParent
                                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-md"
                                    : "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 rounded-bl-md border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
                                }`}
                              >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                              </div>
                              <div className={`flex items-center gap-1.5 mt-1 ${isParent ? "justify-end" : "justify-start"}`}>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">
                                  {new Date(msg.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                                </span>
                                {isParent && (
                                  <CheckCheck className={`w-3.5 h-3.5 ${msg.status === "read" ? "text-blue-500" : "text-gray-400"}`} />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-end gap-2">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] flex-shrink-0">
                          {selectedContact.avatar ? (
                            <Image src={selectedContact.avatar} alt={selectedContact.name} fill className="object-cover" unoptimized />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="px-4 py-3 rounded-2xl bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-bl-md">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]">
                  {/* Attachments Preview */}
                  {attachments.length > 0 && (
                    <div className="px-4 pt-3">
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="relative flex-shrink-0 group">
                            {file.type.startsWith("image/") ? (
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30">
                                <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 flex flex-col items-center justify-center p-1">
                                {getFileIcon(file)}
                                <span className="text-[8px] text-gray-500 truncate w-full text-center mt-1">{file.name.slice(0, 8)}...</span>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-end gap-3 p-4">
                    <div className="flex items-center gap-1">
                      <EmojiPickerPopover onEmojiSelect={handleEmojiSelect} position="top" />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                      >
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>

                    <div className="flex-1">
                      <textarea
                        ref={messageInputRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey && (newMessage.trim() || attachments.length > 0)) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-4 py-3 rounded-2xl bg-gray-100 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border-0 focus:ring-2 focus:ring-blue-500/50 resize-none text-sm text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 placeholder-gray-400 outline-none"
                        style={{ minHeight: "48px", maxHeight: "120px" }}
                      />
                    </div>

                    <button
                      onClick={handleSendMessage}
                      disabled={(!newMessage.trim() && attachments.length === 0) || isSending}
                      className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-blue-500/25"
                    >
                      {isSending ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* No Chat Selected */
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50/30 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/30">
                <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center mb-6">
                  <MessageCircle className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">Your Messages</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 text-center max-w-sm mb-6">
                  Select a conversation from the list or start a new chat with a teacher or administrator.
                </p>
                <Link href={fromAdmin ? "/parents/chat/compose?from=admin" : "/parents/chat/compose"}>
                  <ActionButton variant="primary" color="blue" size="md" icon={<Plus className="w-full h-full" />}>
                    Start New Chat
                  </ActionButton>
                </Link>
              </div>
            )}
          </div>
        </div>
        </div>
      }
    />
  );
}
