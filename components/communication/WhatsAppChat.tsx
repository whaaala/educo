"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Phone,
  Video,
  Search,
  ArrowLeft,
  Check,
  CheckCheck,
  X,
  ExternalLink,
  MessageCircle,
  Clock,
  AlertCircle,
  FileText,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { useCommunication } from "@/contexts/CommunicationContext";
import {
  getWhatsAppService,
  WhatsAppMessage,
  WhatsAppConversation,
  WhatsAppService,
  WhatsAppConfig,
} from "@/lib/services/communication/whatsapp-service";

interface WhatsAppChatProps {
  phoneNumber: string;
  contactName: string;
  contactAvatar?: string;
  onBack?: () => void;
}

export default function WhatsAppChat({
  phoneNumber,
  contactName,
  contactAvatar,
  onBack,
}: WhatsAppChatProps) {
  const { settings, isConfigured } = useCommunication();

  // State
  const [conversation, setConversation] = useState<WhatsAppConversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isConfiguredState, setIsConfiguredState] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const whatsappServiceRef = useRef<WhatsAppService | null>(null);

  // Initialize WhatsApp service
  useEffect(() => {
    const initService = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Check if WhatsApp is configured
        if (!isConfigured("whatsapp") || !settings.whatsApp.accessToken) {
          setIsConfiguredState(false);
          setIsLoading(false);
          return;
        }

        setIsConfiguredState(true);

        // Create config from settings
        const config: WhatsAppConfig = {
          phoneNumberId: settings.whatsApp.businessPhoneNumber,
          businessAccountId: "", // Would come from extended settings
          accessToken: settings.whatsApp.accessToken,
        };

        const service = getWhatsAppService(config);
        await service.initialize();
        whatsappServiceRef.current = service;

        // Load conversation
        const conv = service.getConversation(phoneNumber);
        setConversation(conv);

        // Subscribe to new messages
        const unsubscribe = service.onMessage((message) => {
          if (message.roomId === phoneNumber) {
            setConversation((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                messages: [...prev.messages, message],
                lastMessageAt: message.timestamp,
              };
            });
          }
        });

        return () => {
          unsubscribe();
        };
      } catch (err) {
        console.error("Failed to initialize WhatsApp service:", err);
        setError(err instanceof Error ? err.message : "Failed to connect to WhatsApp");
      }

      setIsLoading(false);
    };

    initService();
  }, [phoneNumber, settings, isConfigured]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages, scrollToBottom]);

  // Send message
  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || isSending || !whatsappServiceRef.current) return;

    setIsSending(true);
    setError(null);

    try {
      const message = await whatsappServiceRef.current.sendTextMessage(phoneNumber, newMessage.trim());

      // Add to local conversation
      setConversation((prev) => {
        if (!prev) {
          return {
            id: phoneNumber,
            contact: {
              phoneNumber,
              name: contactName,
            },
            messages: [message],
            lastMessageAt: new Date(),
            unreadCount: 0,
            isActive: true,
          };
        }
        return {
          ...prev,
          messages: [...prev.messages, message],
          lastMessageAt: new Date(),
        };
      });

      setNewMessage("");
      inputRef.current?.focus();
    } catch (err) {
      console.error("Failed to send message:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
    }

    setIsSending(false);
  }, [newMessage, isSending, phoneNumber, contactName]);

  // Handle file upload
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !whatsappServiceRef.current) return;

    setShowAttachMenu(false);
    setIsSending(true);

    try {
      // In production, you'd upload the file to your server first
      // Then send the URL to WhatsApp
      console.log("File selected:", file.name);
      // For now, just show an error that upload is not implemented
      setError("File upload requires server-side implementation");
    } catch (err) {
      console.error("Failed to upload file:", err);
      setError(err instanceof Error ? err.message : "Failed to upload file");
    }

    setIsSending(false);
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
  const messages = conversation?.messages || [];
  const groupedMessages = messages.reduce<{ date: string; messages: WhatsAppMessage[] }[]>((groups, message) => {
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

  // Open WhatsApp externally
  const openWhatsAppExternal = () => {
    window.open(WhatsAppService.generateChatLink(phoneNumber, ""), "_blank");
  };

  // Get message status icon
  const getStatusIcon = (status: WhatsAppMessage["status"]) => {
    switch (status) {
      case "sent":
        return <Check className="w-4 h-4" />;
      case "delivered":
        return <CheckCheck className="w-4 h-4" />;
      case "read":
        return <CheckCheck className="w-4 h-4 text-blue-400" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Get message type icon
  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-4 h-4" />;
      case "file":
        return <FileText className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // If not configured, show setup prompt
  if (!isLoading && !isConfiguredState) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-green-600">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-green-700 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            )}
            <MessageCircle className="w-8 h-8 text-white" />
            <div className="flex-1">
              <h3 className="font-semibold text-white">WhatsApp Business</h3>
              <p className="text-xs text-green-100">Not configured</p>
            </div>
          </div>
        </div>

        {/* Setup prompt */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
            <MessageCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            WhatsApp Business Not Configured
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            To use WhatsApp messaging, you need to configure WhatsApp Business API credentials in the admin settings.
          </p>
          <div className="space-y-3">
            <a
              href="/admin/settings/communication"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Configure WhatsApp
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={openWhatsAppExternal}
              className="block w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Open in WhatsApp App
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header - WhatsApp green theme */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-green-600">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-green-700 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}

          {/* Avatar */}
          {contactAvatar ? (
            <Image
              src={contactAvatar}
              alt={contactName}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center">
              <span className="text-white font-bold">{contactName.charAt(0).toUpperCase()}</span>
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{contactName}</h3>
            <p className="text-xs text-green-100">
              {phoneNumber}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {showSearch ? (
              <div className="flex items-center gap-2 bg-green-700 rounded-full px-3 py-1">
                <Search className="w-4 h-4 text-green-100" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent text-sm w-32 focus:outline-none text-white placeholder-green-200"
                  autoFocus
                  suppressHydrationWarning
                />
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                >
                  <X className="w-4 h-4 text-green-100" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2 hover:bg-green-700 rounded-full transition-colors"
                >
                  <Search className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={openWhatsAppExternal}
                  className="p-2 hover:bg-green-700 rounded-full transition-colors"
                  title="Open in WhatsApp"
                >
                  <ExternalLink className="w-5 h-5 text-white" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex-shrink-0 px-4 py-2 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Messages - WhatsApp style background */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{
          backgroundColor: "#e5ddd5",
          backgroundImage: "url('/whatsapp-bg.png')",
          backgroundRepeat: "repeat",
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-6 py-4 text-center">
              <MessageCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No messages yet with this contact.
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                Start a conversation via WhatsApp Business API
              </p>
            </div>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <div key={group.date}>
              {/* Date separator */}
              <div className="flex items-center justify-center my-4">
                <span className="px-3 py-1 bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 text-xs rounded-lg shadow-sm">
                  {group.date}
                </span>
              </div>

              {/* Messages */}
              {group.messages.map((message) => {
                const isOwn = message.senderId !== phoneNumber;

                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}
                  >
                    {/* Message bubble */}
                    <div
                      className={`max-w-[70%] rounded-lg px-3 py-2 shadow ${
                        isOwn
                          ? "bg-green-100 dark:bg-green-900 rounded-br-none"
                          : "bg-white dark:bg-gray-800 rounded-bl-none"
                      }`}
                    >
                      {/* Message type indicator */}
                      {message.type !== "text" && (
                        <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                          {getMessageTypeIcon(message.type)}
                          <span className="capitalize">{message.type}</span>
                        </div>
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
                          className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 underline"
                        >
                          <FileText className="w-4 h-4" />
                          {message.fileName || "Download file"}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      )}

                      {/* Time and status */}
                      <div className="flex items-center justify-end gap-1 mt-1 text-gray-400 text-xs">
                        <span>{formatTime(message.timestamp)}</span>
                        {isOwn && getStatusIcon(message.status)}
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
      <div className="flex-shrink-0 p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          {/* Attachment */}
          <div className="relative">
            <button
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {showAttachMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[150px]">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  <ImageIcon className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">Photo</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Document</span>
                </button>
                <button
                  onClick={() => {
                    // Would open location picker
                    setShowAttachMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Location</span>
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

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border-0 rounded-full text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            suppressHydrationWarning
          />

          {/* Send */}
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || isSending}
            className={`p-3 rounded-full transition-colors ${
              newMessage.trim() && !isSending
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 dark:bg-gray-600 text-gray-400"
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
