"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Search,
  ArrowLeft,
  Check,
  CheckCheck,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCommunication } from "@/contexts/CommunicationContext";
import {
  getCommunicationManager,
  ChatMessage,
  ChatRoom as ChatRoomType,
} from "@/lib/services/communication";

interface ChatRoomProps {
  roomId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  roomName?: string;
  roomType?: "direct" | "group" | "meeting";
  participants?: {
    id: string;
    name: string;
    avatar?: string;
    isOnline?: boolean;
  }[];
  onStartVideoCall?: () => void;
  onStartVoiceCall?: () => void;
  onBack?: () => void;
}

export default function ChatRoom({
  roomId,
  userId,
  userName,
  userAvatar,
  roomName,
  roomType = "direct",
  participants = [],
  onStartVideoCall,
  onStartVoiceCall,
  onBack,
}: ChatRoomProps) {
  const { settings } = useCommunication();
  const manager = getCommunicationManager();

  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        if (settings) {
          manager.setSettings(settings);
        }

        const service = await manager.getService(undefined, "chat");
        const history = await service.getChatHistory(roomId);
        setMessages(history);

        // Subscribe to new messages
        service.onChatMessage((message) => {
          if (message.roomId === roomId) {
            setMessages((prev) => [...prev, message]);
          }
        });
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
      setIsLoading(false);
    };

    loadMessages();
  }, [roomId, settings]);

  // Scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Send message
  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const service = manager.getCurrentService();
      if (service) {
        await service.sendChatMessage({
          roomId,
          senderId: userId,
          senderName: userName,
          senderAvatar: userAvatar,
          content: newMessage.trim(),
          type: "text",
          isRead: false,
          replyTo: replyTo?.id,
        });
        setNewMessage("");
        setReplyTo(null);
        inputRef.current?.focus();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
    setIsSending(false);
  }, [newMessage, isSending, roomId, userId, userName, userAvatar, replyTo]);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // For now, just log the file
    // In production, you'd upload to a server and send the URL
    console.log("File selected:", file.name);
    setShowAttachMenu(false);
  }, []);

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

  // Get recipient for direct chat
  const recipient = roomType === "direct" ? participants.find((p) => p.id !== userId) : null;
  const displayName = roomName || recipient?.name || "Chat";

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-[#22262e] rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
            </button>
          )}

          {/* Avatar */}
          {recipient?.avatar ? (
            <Image
              src={recipient.avatar}
              alt={displayName}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">{displayName.charAt(0).toUpperCase()}</span>
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">{displayName}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
              {recipient?.isOnline ? (
                <span className="text-green-500">Online</span>
              ) : roomType === "group" ? (
                `${participants.length} participants`
              ) : (
                "Offline"
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {showSearch ? (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded-full px-3 py-1">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent text-sm w-32 focus:outline-none text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
                  autoFocus
                  suppressHydrationWarning
                />
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-[#22262e] rounded-full transition-colors"
                >
                  <Search className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
                </button>
                {onStartVoiceCall && (
                  <button
                    onClick={onStartVoiceCall}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-[#22262e] rounded-full transition-colors"
                  >
                    <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
                  </button>
                )}
                {onStartVideoCall && (
                  <button
                    onClick={onStartVideoCall}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-[#22262e] rounded-full transition-colors"
                  >
                    <Video className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
                  </button>
                )}
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#22262e] rounded-full transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] flex items-center justify-center mb-4">
              <Send className="w-8 h-8 opacity-50" />
            </div>
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <div key={group.date}>
              {/* Date separator */}
              <div className="flex items-center justify-center my-4">
                <span className="px-3 py-1 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 text-xs rounded-full">
                  {group.date}
                </span>
              </div>

              {/* Messages */}
              {group.messages.map((message, index) => {
                const isOwn = message.senderId === userId;
                const showAvatar =
                  !isOwn &&
                  (index === 0 || group.messages[index - 1].senderId !== message.senderId);

                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}
                  >
                    {/* Avatar */}
                    {!isOwn && (
                      <div className="w-8 mr-2">
                        {showAvatar && (
                          message.senderAvatar ? (
                            <Image
                              src={message.senderAvatar}
                              alt={message.senderName}
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {message.senderName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        isOwn
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 rounded-bl-sm shadow-sm"
                      }`}
                    >
                      {/* Reply reference */}
                      {message.replyTo && (
                        <div
                          className={`text-xs mb-1 px-2 py-1 rounded border-l-2 ${
                            isOwn
                              ? "bg-blue-700/50 border-blue-400"
                              : "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border-gray-400"
                          }`}
                        >
                          Replying to message...
                        </div>
                      )}

                      {/* Sender name (in group chats) */}
                      {!isOwn && roomType === "group" && showAvatar && (
                        <p className="text-xs text-blue-500 font-medium mb-1">
                          {message.senderName}
                        </p>
                      )}

                      {/* Content */}
                      {message.type === "image" && message.fileUrl ? (
                        <Image
                          src={message.fileUrl}
                          alt="Image"
                          width={200}
                          height={200}
                          className="rounded-lg max-w-full"
                        />
                      ) : message.type === "file" && message.fileUrl ? (
                        <a
                          href={message.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm underline"
                        >
                          <Paperclip className="w-4 h-4" />
                          {message.fileName || "Download file"}
                        </a>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      )}

                      {/* Time and status */}
                      <div
                        className={`flex items-center justify-end gap-1 mt-1 ${
                          isOwn ? "text-blue-200" : "text-gray-400"
                        }`}
                      >
                        <span className="text-xs">{formatTime(message.timestamp)}</span>
                        {isOwn && (
                          message.isRead ? (
                            <CheckCheck className="w-4 h-4 text-blue-200" />
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

      {/* Reply preview */}
      {replyTo && (
        <div className="flex-shrink-0 px-4 py-2 bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <div className="flex items-center gap-2">
            <div className="flex-1 text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
              <p className="font-medium">Replying to {replyTo.senderName}</p>
              <p className="truncate">{replyTo.content}</p>
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-[#22262e] rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]">
        <div className="flex items-center gap-2">
          {/* Attachment */}
          <div className="relative">
            <button
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-[#22262e] rounded-full transition-colors"
            >
              <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
            </button>

            {showAttachMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 py-2 min-w-[150px]">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#22262e] text-left"
                >
                  <ImageIcon className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Image</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#22262e] text-left"
                >
                  <Paperclip className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">File</span>
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              suppressHydrationWarning
            />
          </div>

          {/* Emoji */}
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#22262e] rounded-full transition-colors">
            <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
          </button>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border-0 rounded-full text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            suppressHydrationWarning
          />

          {/* Send */}
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || isSending}
            className={`p-3 rounded-full transition-colors ${
              newMessage.trim() && !isSending
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-400"
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
  );
}
