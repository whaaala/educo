"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  Send,
  CheckCircle2,
  Paperclip,
  XCircle,
  ExternalLink,
} from "lucide-react";
import Modal from "@/components/shared/Modal";
import EmojiPickerPopover from "@/components/shared/EmojiPickerPopover";
import { useNotifications } from "@/contexts/NotificationContext";

// Generic recipient interface that works for parents, teachers, students, etc.
export interface ChatRecipient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  profilePhoto?: string;
  role?: string; // e.g., "Parent", "Teacher", "Student", "Father", "Mother", etc.
}

interface SendChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: ChatRecipient;
  /** URL path for viewing the chat page for this recipient (e.g., "/admin/parents/chat") */
  chatPageUrl?: string;
  /** Type of recipient for display purposes */
  recipientType?: "parent" | "teacher" | "student" | "staff" | "user";
}

interface ChatMessage {
  id: string;
  from: "recipient" | "sender";
  message: string;
  timestamp: string;
  read: boolean;
}

export default function SendChatModal({
  isOpen,
  onClose,
  recipient,
  chatPageUrl,
  recipientType = "user",
}: SendChatModalProps) {
  const router = useRouter();
  const { addNotification } = useNotifications();

  const [chatMessage, setChatMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatAttachments, setChatAttachments] = useState<File[]>([]);

  // Mock chat history - use fixed base date to avoid hydration mismatch
  const BASE_DATE = new Date("2026-01-25T12:00:00").getTime();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "1",
      from: "recipient",
      message: "Hello, I wanted to ask about the upcoming parent-teacher meeting.",
      timestamp: new Date(BASE_DATE - 3600000 * 24 * 2).toISOString(),
      read: true,
    },
    {
      id: "2",
      from: "sender",
      message: "Hi! The parent-teacher meeting is scheduled for next Friday at 2 PM. Would you like to book a slot?",
      timestamp: new Date(BASE_DATE - 3600000 * 24 * 2 + 1800000).toISOString(),
      read: true,
    },
    {
      id: "3",
      from: "recipient",
      message: "Yes, please. Can I get the 3 PM slot?",
      timestamp: new Date(BASE_DATE - 3600000 * 24).toISOString(),
      read: true,
    },
    {
      id: "4",
      from: "sender",
      message: "Of course! I've booked the 3 PM slot for you. You'll receive a confirmation email shortly.",
      timestamp: new Date(BASE_DATE - 3600000 * 23).toISOString(),
      read: true,
    },
    {
      id: "5",
      from: "recipient",
      message: "Thank you so much! Also, could you please share the latest fee statement?",
      timestamp: new Date(BASE_DATE - 3600000 * 2).toISOString(),
      read: true,
    },
  ]);

  // Refs
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Format timestamp for chat messages
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return "🖼️";
    if (file.type.includes("pdf")) return "📄";
    if (file.type.includes("word") || file.type.includes("document")) return "📝";
    if (file.type.includes("excel") || file.type.includes("spreadsheet")) return "📊";
    return "📎";
  };

  // Handle chat file selection
  const handleChatFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setChatAttachments((prev) => [...prev, ...Array.from(files)]);
    }
    e.target.value = "";
  };

  // Remove attachment
  const removeChatAttachment = (index: number) => {
    setChatAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setChatMessage((prev) => prev + emoji);
    chatInputRef.current?.focus();
  };

  // Send chat message
  const handleSendChat = () => {
    if (!chatMessage.trim() && chatAttachments.length === 0) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      from: "sender",
      message: chatMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    setChatHistory((prev) => [...prev, newMessage]);
    setChatMessage("");
    setChatAttachments([]);

    // Simulate typing response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        from: "recipient",
        message: "Thank you for your message! I'll get back to you shortly.",
        timestamp: new Date().toISOString(),
        read: false,
      };
      setChatHistory((prev) => [...prev, replyMessage]);
    }, 2000);

    addNotification({
      type: "success",
      title: "Message Sent",
      message: `Your message to ${recipient.firstName} ${recipient.lastName} has been sent.`,
    });
  };

  // Handle close
  const handleClose = () => {
    setChatMessage("");
    setChatAttachments([]);
    onClose();
  };

  // Navigate to chat page for this recipient
  const handleViewAllChats = () => {
    handleClose();
    if (chatPageUrl) {
      // Navigate to chat page with recipient ID
      router.push(`${chatPageUrl}/${recipient.id}`);
    }
  };

  const fullName = `${recipient.firstName} ${recipient.lastName}`;
  const initials = `${recipient.firstName.charAt(0)}${recipient.lastName.charAt(0)}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Quick Chat"
      subtitle={`Chat with ${fullName}`}
      icon={<MessageCircle className="w-5 h-5" />}
      maxWidth="lg"
    >
      <div className="flex flex-col h-[450px]">
        {/* Header with recipient info */}
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <div className="relative">
              {recipient.profilePhoto ? (
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={recipient.profilePhoto}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{initials}</span>
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white">{fullName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {recipient.role && <span>{recipient.role}</span>}
                {recipient.phone && <span> &bull; {recipient.phone}</span>}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                Online
              </span>
              {chatPageUrl && (
                <button
                  onClick={handleViewAllChats}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                  title={`Open full chat with this ${recipientType}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Open Chat</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-1 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {chatHistory.map((msg, index) => {
            const isSender = msg.from === "sender";
            const showDate =
              index === 0 ||
              new Date(msg.timestamp).toDateString() !==
                new Date(chatHistory[index - 1].timestamp).toDateString();

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="flex items-center justify-center my-4">
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400">
                      {new Date(msg.timestamp).toLocaleDateString([], {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
                <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex items-end gap-2 max-w-[75%] ${
                      isSender ? "flex-row-reverse" : ""
                    }`}
                  >
                    {!isSender &&
                      (recipient.profilePhoto ? (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                          <img
                            src={recipient.profilePhoto}
                            alt={fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {recipient.firstName.charAt(0)}
                          </span>
                        </div>
                      ))}
                    <div
                      className={`group relative ${
                        isSender ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2.5 rounded-2xl ${
                          isSender
                            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-md"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 mt-1 ${
                          isSender ? "justify-end" : "justify-start"
                        }`}
                      >
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                          {formatTime(msg.timestamp)}
                        </span>
                        {isSender && <CheckCircle2 className="w-3 h-3 text-blue-500" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-end gap-2">
                {recipient.profilePhoto ? (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                    <img
                      src={recipient.profilePhoto}
                      alt={recipient.firstName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {recipient.firstName.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 rounded-bl-md">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="flex-shrink-0 pt-3 border-t border-gray-200 dark:border-gray-700 mt-3 relative overflow-visible">
          {/* Chat Attachments Preview */}
          {chatAttachments.length > 0 && (
            <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {chatAttachments.map((file, index) => (
                <div key={index} className="relative flex-shrink-0 group">
                  {file.type.startsWith("image/") ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center p-1">
                      <span className="text-lg">{getFileIcon(file)}</span>
                      <span className="text-[8px] text-gray-500 truncate w-full text-center">
                        {file.name.slice(0, 8)}...
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeChatAttachment(index)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <textarea
                ref={chatInputRef}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChat();
                  }
                }}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>

            {/* Emoji Picker */}
            <EmojiPickerPopover
              onEmojiSelect={handleEmojiSelect}
              position="top"
              buttonClassName="p-2.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            />

            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => chatFileInputRef.current?.click()}
              className="p-2.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              ref={chatFileInputRef}
              type="file"
              multiple
              onChange={handleChatFileSelect}
              className="hidden"
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSendChat}
              disabled={!chatMessage.trim() && chatAttachments.length === 0}
              className="p-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
