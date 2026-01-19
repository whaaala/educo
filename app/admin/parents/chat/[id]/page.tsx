"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Search,
  Check,
  CheckCheck,
  X,
  ArrowLeft,
  User,
  Mail,
  Calendar,
} from "lucide-react";
import { getAllParents, type AdminParent } from "@/lib/mockParents";
import { useCall } from "@/hooks/useCall";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  type: "text" | "image" | "file";
  fileUrl?: string;
  fileName?: string;
}

// Mock messages for demo
const generateMockMessages = (parentName: string, parentId: string): ChatMessage[] => {
  const now = new Date();
  return [
    {
      id: "msg-1",
      senderId: parentId,
      senderName: parentName,
      content: "Good morning! I wanted to check on my child's progress this term.",
      timestamp: new Date(now.getTime() - 3600000 * 2),
      isRead: true,
      type: "text",
    },
    {
      id: "msg-2",
      senderId: "admin",
      senderName: "Admin",
      content: "Good morning! Your child has been doing well. Would you like to schedule a meeting to discuss in detail?",
      timestamp: new Date(now.getTime() - 3600000 * 1.5),
      isRead: true,
      type: "text",
    },
    {
      id: "msg-3",
      senderId: parentId,
      senderName: parentName,
      content: "That would be great! When is the teacher available?",
      timestamp: new Date(now.getTime() - 3600000),
      isRead: true,
      type: "text",
    },
  ];
};

export default function ParentChatPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const parentId = params.id as string;
  const { startVideoCall, startVoiceCall } = useCall();

  // Get parent data
  const [parent, setParent] = useState<AdminParent | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showParticipantInfo, setShowParticipantInfo] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load parent data
  useEffect(() => {
    const allParents = getAllParents();
    const foundParent = allParents.find((p) => p.id === parentId);
    if (foundParent) {
      setParent(foundParent);
      setMessages(generateMockMessages(`${foundParent.firstName} ${foundParent.lastName}`, foundParent.id));
    }
  }, [parentId]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Send message
  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "admin",
      senderName: "Admin",
      content: newMessage.trim(),
      timestamp: new Date(),
      isRead: false,
      type: "text",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    setTimeout(() => {
      setIsSending(false);
      inputRef.current?.focus();
    }, 300);
  }, [newMessage, isSending]);

  // Format timestamp
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date for message groups
  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return messageDate.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
  };

  // Group messages by date
  const groupedMessages = messages.reduce<{ date: string; messages: ChatMessage[] }[]>((groups, message) => {
    const date = formatDate(message.timestamp);
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup.date === date) {
      lastGroup.messages.push(message);
    } else {
      groups.push({ date, messages: [message] });
    }

    return groups;
  }, []);

  // Filter messages by search
  const filteredGroups = showSearch && searchQuery
    ? groupedMessages.map((group) => ({
        ...group,
        messages: group.messages.filter((m) =>
          m.content.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((group) => group.messages.length > 0)
    : groupedMessages;

  // Participant for calls
  const parentParticipant = parent ? {
    id: parent.id,
    name: `${parent.firstName} ${parent.lastName}`,
    avatar: parent.profilePhoto,
    role: parent.relationship,
    phone: parent.phone,
    email: parent.email,
  } : null;

  if (!parent) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-120px)]">
        {/* Page Header */}
        <div className="flex-shrink-0 mb-4">
          <PageHeader
            title="Messages"
            breadcrumbs={[
              { label: "Parents", href: "/admin/parents" },
              { label: `${parent.firstName} ${parent.lastName}`, href: `/admin/parents/${parent.id}` },
              { label: "Chat" },
            ]}
          />
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat Header */}
            <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center gap-3">
                {/* Back Button */}
                <button
                  onClick={() => router.push("/admin/parents")}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>

                {/* Avatar */}
                {parent.profilePhoto ? (
                  <Image
                    src={parent.profilePhoto}
                    alt={`${parent.firstName} ${parent.lastName}`}
                    width={44}
                    height={44}
                    className="w-11 h-11 rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-white dark:border-gray-700 shadow-sm">
                    <span className="text-white font-bold text-lg">
                      {parent.firstName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Info */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => setShowParticipantInfo(!showParticipantInfo)}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    Message to {parent.firstName}
                  </h3>
                  <p className="text-xs text-green-500 font-medium">Online</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {showSearch ? (
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1.5">
                      <Search className="w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search messages..."
                        className="bg-transparent text-sm w-40 focus:outline-none text-gray-900 dark:text-white"
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          setShowSearch(false);
                          setSearchQuery("");
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowSearch(true)}
                        className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        title="Search messages"
                      >
                        <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => parentParticipant && startVoiceCall(parentParticipant)}
                        className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        title="Voice call"
                      >
                        <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => parentParticipant && startVideoCall(parentParticipant)}
                        className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        title="Video call"
                      >
                        <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        title="More options"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <Send className="w-10 h-10 opacity-50" />
                  </div>
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                filteredGroups.map((group) => (
                  <div key={group.date}>
                    {/* Date separator */}
                    <div className="flex items-center justify-center my-4">
                      <span className="px-4 py-1.5 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                        {group.date}
                      </span>
                    </div>

                    {/* Messages */}
                    {group.messages.map((message, index) => {
                      const isOwn = message.senderId === "admin";
                      const showAvatar =
                        !isOwn &&
                        (index === 0 || group.messages[index - 1].senderId !== message.senderId);

                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}
                        >
                          {/* Avatar */}
                          {!isOwn && (
                            <div className="w-9 mr-2 flex-shrink-0">
                              {showAvatar && (
                                parent.profilePhoto ? (
                                  <Image
                                    src={parent.profilePhoto}
                                    alt={message.senderName}
                                    width={36}
                                    height={36}
                                    className="w-9 h-9 rounded-full"
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">
                                      {message.senderName.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                          {/* Message bubble */}
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
                              isOwn
                                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-md"
                                : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md border border-gray-100 dark:border-gray-700"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                              {message.content}
                            </p>

                            {/* Time and status */}
                            <div
                              className={`flex items-center justify-end gap-1 mt-1.5 ${
                                isOwn ? "text-blue-100" : "text-gray-400"
                              }`}
                            >
                              <span className="text-xs">{formatTime(message.timestamp)}</span>
                              {isOwn && (
                                message.isRead ? (
                                  <CheckCheck className="w-4 h-4" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-3">
                {/* Attachment */}
                <div className="relative">
                  <button
                    onClick={() => setShowAttachMenu(!showAttachMenu)}
                    className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>

                  {showAttachMenu && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[160px] z-10">
                      <button
                        onClick={() => {
                          fileInputRef.current?.click();
                          setShowAttachMenu(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Image</span>
                      </button>
                      <button
                        onClick={() => {
                          fileInputRef.current?.click();
                          setShowAttachMenu(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <Paperclip className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Document</span>
                      </button>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  />
                </div>

                {/* Emoji */}
                <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                  <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>

                {/* Input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-5 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-full text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                />

                {/* Send */}
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isSending}
                  className={`p-3 rounded-full transition-all ${
                    newMessage.trim() && !isSending
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                  }`}
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Participant Info Sidebar */}
          {showParticipantInfo && (
            <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
              <div className="p-6">
                {/* Close button */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setShowParticipantInfo(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Avatar */}
                <div className="text-center mb-6">
                  {parent.profilePhoto ? (
                    <Image
                      src={parent.profilePhoto}
                      alt={`${parent.firstName} ${parent.lastName}`}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full mx-auto border-4 border-white dark:border-gray-700 shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto border-4 border-white dark:border-gray-700 shadow-lg">
                      <span className="text-white font-bold text-3xl">
                        {parent.firstName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-4">
                    {parent.firstName} {parent.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {parent.relationship}
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mt-2">
                    Online
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {parent.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {parent.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Children</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {parent.children.length} {parent.children.length === 1 ? "child" : "children"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* View Profile Button */}
                <button
                  onClick={() => router.push(`/admin/parents/${parent.id}`)}
                  className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25"
                >
                  View Full Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
