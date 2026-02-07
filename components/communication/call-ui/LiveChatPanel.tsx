"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Send,
  Smile,
  MoreHorizontal,
  Heart,
  ThumbsUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  reactions?: { emoji: string; count: number }[];
}

export interface LiveChatPanelProps {
  messages: ChatMessage[];
  currentUserId: string;
  primaryColor?: string;
  secondaryColor?: string;
  onClose: () => void;
  onSendMessage: (content: string) => void;
  className?: string;
}

export function LiveChatPanel({
  messages,
  currentUserId,
  primaryColor = "#2563eb",
  secondaryColor = "#1e40af",
  onClose,
  onSendMessage,
  className,
}: LiveChatPanelProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;

    return messageDate.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const unreadCount = messages.filter((m) => m.senderId !== currentUserId).length;

  return (
    <div
      className={cn(
        "flex flex-col bg-white dark:bg-gray-900",
        "w-full h-full",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Live Chat
          </h3>
          {unreadCount > 0 && (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: primaryColor }}
            >
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer active:scale-95"
        >
          <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
              <Send className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              No messages yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId === currentUserId;
            return (
              <div key={message.id} className="group">
                {/* Message Row */}
                <div className={cn("flex gap-2.5", isOwn && "flex-row-reverse")}>
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {message.senderAvatar ? (
                      <Image
                        src={message.senderAvatar}
                        alt={message.senderName}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        }}
                      >
                        {message.senderName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={cn("flex-1 max-w-[80%]", isOwn && "flex flex-col items-end")}>
                    {/* Sender Name & Time */}
                    <div className={cn("flex items-center gap-2 mb-1", isOwn && "flex-row-reverse")}>
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">
                        {isOwn ? "You" : message.senderName}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                        • {formatTime(message.timestamp)}
                      </span>
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={cn(
                        "px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
                        isOwn
                          ? "text-white rounded-br-md"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md"
                      )}
                      style={
                        isOwn
                          ? { background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }
                          : {}
                      }
                    >
                      {message.content}
                    </div>

                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                      <div className={cn("flex items-center gap-1 mt-1.5", isOwn && "justify-end")}>
                        {message.reactions.map((reaction, idx) => (
                          <button
                            key={idx}
                            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-gray-600 dark:text-gray-400 font-medium">
                              {reaction.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Actions */}
                <div className={cn(
                  "hidden group-hover:flex items-center gap-1 mt-1 ml-10",
                  isOwn && "mr-10 ml-0 justify-end"
                )}>
                  <button className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <ThumbsUp className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <Heart className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <Smile className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-2">
          <button className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 cursor-pointer">
            <Smile className="w-5 h-5" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
            suppressHydrationWarning
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={cn(
              "p-2 rounded-full transition-all duration-200 cursor-pointer",
              newMessage.trim()
                ? "text-white hover:opacity-90 hover:scale-105 active:scale-95"
                : "text-gray-400 dark:text-gray-500 cursor-not-allowed"
            )}
            style={
              newMessage.trim()
                ? { background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }
                : {}
            }
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default LiveChatPanel;
