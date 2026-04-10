"use client";

import { X, Send, Search, ArrowUpAZ, ArrowDownZA, Undo2, Mail, MessageSquare, Bell, Phone, ChevronDown, ChevronUp, Edit2, Check, LucideIcon } from "lucide-react";
import { useEffect, useState, useRef, ReactNode } from "react";
import Image from "next/image";

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface ChannelMessage {
  subject?: string;
  message: string;
}

export interface RecordCustomMessage {
  [channelId: string]: ChannelMessage | undefined;
}

export interface ChannelConfig {
  id: string;
  label: string;
  subtitle: string;
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "orange" | "red" | "teal";
  hasSubject: boolean;
  subjectLabel?: string;
  enabled?: boolean;
  comingSoon?: boolean;
}

export interface BulkMessageRecipient {
  id: string;
  primaryId: string; // For avatar generation
  primaryName: string;
  primaryEmail?: string;
  primaryPhone?: string;
  secondaryName?: string;
  secondaryInfo?: string;
  badge?: string;
  badgeColor?: "red" | "green" | "blue" | "orange" | "purple" | "gray";
  highlightValue?: string;
  highlightLabel?: string;
}

export interface MessageTemplate {
  channelId: string;
  subject?: string;
  message: string;
}

export interface BulkMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    recipientIds: string[],
    channels: string[],
    channelMessages: Record<string, ChannelMessage>,
    customMessages: Record<string, RecordCustomMessage>
  ) => void;

  // Recipients
  recipients: BulkMessageRecipient[];
  onRemoveRecipient: (recipientId: string) => void;

  // Customization
  title?: string;
  subtitle?: string | ReactNode;
  headerIcon?: LucideIcon;
  headerColor?: "orange" | "blue" | "green" | "purple" | "red";
  confirmButtonText?: string;

  // Channel configuration
  channels?: ChannelConfig[];
  defaultChannels?: string[];
  defaultMessages?: MessageTemplate[];

  // Placeholders
  placeholders?: { key: string; label: string }[];

  // Formatters
  formatHighlightValue?: (value: string) => string;
}

// ============================================
// DEFAULT CONFIGURATIONS
// ============================================

const defaultChannels: ChannelConfig[] = [
  { id: "email", label: "Email", subtitle: "Via email address", icon: Mail, color: "blue", hasSubject: true, subjectLabel: "Email Subject" },
  { id: "sms", label: "SMS", subtitle: "Via phone number", icon: MessageSquare, color: "green", hasSubject: false },
  { id: "inApp", label: "Push Notification", subtitle: "Mobile App", icon: Bell, color: "purple", hasSubject: true, subjectLabel: "Notification Title" },
  { id: "whatsapp", label: "WhatsApp", subtitle: "Coming soon", icon: Phone, color: "teal", hasSubject: false, comingSoon: true },
];

const defaultPlaceholders = [
  { key: "{recipientName}", label: "recipientName" },
  { key: "{date}", label: "date" },
];

const defaultMessageTemplates: MessageTemplate[] = [
  { channelId: "email", subject: "Important Notification", message: "Dear {recipientName},\n\nThis is an important notification.\n\nThank you." },
  { channelId: "sms", message: "Dear {recipientName}, this is an important notification. Thank you." },
  { channelId: "inApp", subject: "Notification", message: "You have received an important notification." },
];

const colorClasses = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20",
    border: "border-blue-500 dark:border-blue-400",
    iconBg: "bg-blue-500",
    text: "text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-500 dark:border-green-400",
    iconBg: "bg-green-500",
    text: "text-green-700 dark:text-green-300",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-500 dark:border-purple-400",
    iconBg: "bg-purple-500",
    text: "text-purple-700 dark:text-purple-300",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-500 dark:border-orange-400",
    iconBg: "bg-orange-500",
    text: "text-orange-700 dark:text-orange-300",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20",
    border: "border-red-500 dark:border-red-400",
    iconBg: "bg-red-500",
    text: "text-red-700 dark:text-red-300",
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-900/20",
    border: "border-teal-500 dark:border-teal-400",
    iconBg: "bg-teal-500",
    text: "text-teal-700 dark:text-teal-300",
  },
};

const headerColorClasses = {
  orange: "bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800/30",
  blue: "bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border-blue-100 dark:border-blue-800/30",
  green: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30",
  purple: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/30",
  red: "bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20 border-red-100 dark:border-red-800/30",
};

const headerIconColorClasses = {
  orange: "bg-orange-500 dark:bg-orange-600",
  blue: "bg-blue-500 dark:bg-blue-600",
  green: "bg-green-500 dark:bg-green-600",
  purple: "bg-purple-500 dark:bg-purple-600",
  red: "bg-red-500 dark:bg-red-600",
};

const badgeColorClasses = {
  red: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
  green: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400",
  blue: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
  orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  gray: "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200",
};

// ============================================
// COMPONENT
// ============================================

export default function BulkMessageModal({
  isOpen,
  onClose,
  onConfirm,
  recipients,
  onRemoveRecipient,
  title = "Send Bulk Messages",
  subtitle,
  headerIcon: HeaderIcon = Send,
  headerColor = "orange",
  confirmButtonText = "Send Messages",
  channels = defaultChannels,
  defaultChannels: initialChannels = ["email"],
  defaultMessages = defaultMessageTemplates,
  placeholders = defaultPlaceholders,
  formatHighlightValue,
}: BulkMessageModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [initialRecipientCount, setInitialRecipientCount] = useState(0);
  const [removedRecipients, setRemovedRecipients] = useState<BulkMessageRecipient[]>([]);
  const [showRemovedRecipients, setShowRemovedRecipients] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set(initialChannels));
  const [expandedChannel, setExpandedChannel] = useState<string | null>(initialChannels[0] || null);
  const [channelMessages, setChannelMessages] = useState<Record<string, ChannelMessage>>({});
  const [customMessages, setCustomMessages] = useState<Record<string, RecordCustomMessage>>({});
  const [editingRecipientId, setEditingRecipientId] = useState<string | null>(null);
  const [editingRecipientMessages, setEditingRecipientMessages] = useState<RecordCustomMessage>({});
  const modalRef = useRef<HTMLDivElement>(null);

  // Initialize channel messages from defaults
  useEffect(() => {
    const messages: Record<string, ChannelMessage> = {};
    defaultMessages.forEach((template) => {
      messages[template.channelId] = {
        subject: template.subject,
        message: template.message,
      };
    });
    setChannelMessages(messages);
  }, [defaultMessages]);

  // Scroll modal into view when it opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      setTimeout(() => {
        modalRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [isOpen]);

  // Track initial recipient count when modal opens
  useEffect(() => {
    if (isOpen) {
      setInitialRecipientCount(recipients.length);
    }
  }, [isOpen, recipients.length]);

  // Calculate removed count
  const removedCount = initialRecipientCount - recipients.length;

  // Filter recipients based on search query
  const filteredRecipients = recipients.filter(
    (recipient) =>
      recipient.primaryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipient.secondaryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipient.secondaryInfo?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort filtered recipients
  const sortedAndFilteredRecipients = [...filteredRecipients].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.primaryName.localeCompare(b.primaryName);
    } else {
      return b.primaryName.localeCompare(a.primaryName);
    }
  });

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Toggle channel selection
  const toggleChannel = (channelId: string) => {
    const channel = channels.find((c) => c.id === channelId);
    if (channel?.comingSoon) return;

    setSelectedChannels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(channelId)) {
        if (newSet.size > 1) {
          newSet.delete(channelId);
          if (expandedChannel === channelId) {
            const remaining = Array.from(newSet);
            setExpandedChannel(remaining[0] || null);
          }
        }
      } else {
        newSet.add(channelId);
        setExpandedChannel(channelId);
      }
      return newSet;
    });
  };

  // Update channel message
  const updateChannelMessage = (channelId: string, field: "subject" | "message", value: string) => {
    setChannelMessages((prev) => ({
      ...prev,
      [channelId]: {
        ...prev[channelId],
        [field]: value,
      },
    }));
  };

  // Start editing a recipient's custom message
  const startEditingRecipient = (recipientId: string) => {
    setEditingRecipientId(recipientId);
    setEditingRecipientMessages(customMessages[recipientId] || {});
  };

  // Save recipient's custom message
  const saveRecipientMessage = () => {
    if (editingRecipientId) {
      const hasCustomContent = Object.values(editingRecipientMessages).some(
        (msg) => msg && (msg.subject || msg.message)
      );
      if (hasCustomContent) {
        setCustomMessages((prev) => ({
          ...prev,
          [editingRecipientId]: editingRecipientMessages,
        }));
      } else {
        setCustomMessages((prev) => {
          const newMessages = { ...prev };
          delete newMessages[editingRecipientId];
          return newMessages;
        });
      }
    }
    setEditingRecipientId(null);
    setEditingRecipientMessages({});
  };

  // Update editing recipient message
  const updateEditingRecipientMessage = (channelId: string, field: "subject" | "message", value: string) => {
    setEditingRecipientMessages((prev) => ({
      ...prev,
      [channelId]: {
        message: prev[channelId]?.message || "",
        subject: prev[channelId]?.subject,
        [field]: value,
      },
    }));
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSortOrder("asc");
      setRemovedRecipients([]);
      setShowRemovedRecipients(false);
      setSelectedChannels(new Set(initialChannels));
      setExpandedChannel(initialChannels[0] || null);
      setCustomMessages({});
      setEditingRecipientId(null);
      setEditingRecipientMessages({});
    }
  }, [isOpen, initialChannels]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (editingRecipientId) {
          setEditingRecipientId(null);
          setEditingRecipientMessages({});
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, editingRecipientId]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(
      recipients.map((recipient) => recipient.id),
      Array.from(selectedChannels),
      channelMessages,
      customMessages
    );
  };

  // Handle removing a recipient and track it
  const handleRemoveRecipient = (recipientId: string) => {
    const recipientToRemove = recipients.find((recipient) => recipient.id === recipientId);
    if (recipientToRemove) {
      setRemovedRecipients((prev) => [...prev, recipientToRemove]);
    }
    onRemoveRecipient(recipientId);
  };

  // Check if a recipient has custom message
  const hasCustomMessage = (recipientId: string) => {
    return !!customMessages[recipientId];
  };

  // Get enabled channels (non-coming soon)
  const enabledChannels = channels.filter((c) => !c.comingSoon);

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[calc(100vh-3rem)] sm:max-h-[calc(100vh-4rem)] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${headerColorClasses[headerColor]} px-6 pt-4 pb-3 rounded-t-2xl border-b flex-shrink-0`}>
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className={`absolute inset-0 ${headerIconColorClasses[headerColor]} rounded-full opacity-20 animate-ping`}></div>
              <div className={`relative w-9 h-9 ${headerIconColorClasses[headerColor]} rounded-full flex items-center justify-center`}>
                <HeaderIcon className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>
          <h2 className="text-sm font-bold text-center text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{title}</h2>
          {subtitle && (
            <div className="text-xs text-center text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mt-1">{subtitle}</div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 pt-4 pb-6 overflow-y-auto flex-1">
          {/* Channel Selection Cards */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-3">Send via</p>
            <div className="grid grid-cols-2 gap-3">
              {channels.map((channel) => {
                const Icon = channel.icon;
                const isSelected = selectedChannels.has(channel.id);
                const colors = colorClasses[channel.color];

                if (channel.comingSoon) {
                  return (
                    <div
                      key={channel.id}
                      className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 opacity-60"
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">{channel.label}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">{channel.subtitle}</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={channel.id}
                    onClick={() => toggleChannel(channel.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? `${colors.bg} ${colors.border}`
                        : "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected ? `${colors.iconBg} text-white` : "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-medium ${isSelected ? colors.text : "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"}`}>
                        {channel.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">{channel.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Editor Section */}
          {selectedChannels.size > 0 && (
            <div className="mb-5 p-4 bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              {/* Channel tabs */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-x-auto">
                {Array.from(selectedChannels).map((channelId) => {
                  const channel = channels.find((c) => c.id === channelId);
                  if (!channel) return null;
                  const Icon = channel.icon;
                  const isActive = expandedChannel === channelId;
                  return (
                    <button
                      key={channelId}
                      onClick={() => setExpandedChannel(channelId)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                        isActive
                          ? `${colorClasses[channel.color].bg} ${colorClasses[channel.color].text} border ${colorClasses[channel.color].border}`
                          : "bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:border-gray-300 dark:hover:border-gray-500 midnight:hover:border-cyan-500/40 purple:hover:border-pink-500/40"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {channel.label}
                    </button>
                  );
                })}
              </div>

              {/* Active channel message editor */}
              {expandedChannel && selectedChannels.has(expandedChannel) && (
                <div className="space-y-4">
                  {(() => {
                    const channel = channels.find((c) => c.id === expandedChannel);
                    if (!channel) return null;
                    const Icon = channel.icon;

                    return (
                      <>
                        {/* Subject field */}
                        {channel.hasSubject && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                                {channel.subjectLabel || "Subject"}
                              </label>
                            </div>
                            <input
                              type="text"
                              value={channelMessages[expandedChannel]?.subject || ""}
                              onChange={(e) => updateChannelMessage(expandedChannel, "subject", e.target.value)}
                              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:focus:border-orange-400 transition-all"
                              placeholder="Enter subject..."
                            />
                          </div>
                        )}

                        {/* Message field */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">Message</label>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                              {channelMessages[expandedChannel]?.message?.length || 0}/{expandedChannel === "sms" ? "160" : "5000"}
                            </span>
                          </div>
                          <textarea
                            value={channelMessages[expandedChannel]?.message || ""}
                            onChange={(e) => updateChannelMessage(expandedChannel, "message", e.target.value)}
                            rows={expandedChannel === "sms" ? 3 : 5}
                            className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:focus:border-orange-400 transition-all resize-none"
                            placeholder="Enter your message..."
                          />
                          {placeholders.length > 0 && (
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                              Available placeholders:{" "}
                              {placeholders.map((p, i) => (
                                <span key={p.key}>
                                  <code className="px-1 py-0.5 bg-gray-200 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 rounded text-[10px]">{p.key}</code>
                                  {i < placeholders.length - 1 && " "}
                                </span>
                              ))}
                            </p>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Search Field */}
          {recipients.length >= 5 && (
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipients..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 midnight:placeholder-cyan-400 purple:placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-600 focus:border-transparent transition-all duration-200"
              />
            </div>
          )}

          {/* Recipients List Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                Recipients ({filteredRecipients.length} of {recipients.length}):
              </p>
              {removedCount > 0 && (
                <button
                  onClick={() => setShowRemovedRecipients(!showRemovedRecipients)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 border border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/40 transition-all duration-200 cursor-pointer active:scale-95"
                  title="Click to view removed items"
                >
                  {removedCount} removed
                </button>
              )}
            </div>

            {recipients.length > 1 && (
              <button
                onClick={toggleSortOrder}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 transition-all duration-200 cursor-pointer active:scale-95"
                title={sortOrder === "asc" ? "Sort Z to A" : "Sort A to Z"}
              >
                {sortOrder === "asc" ? (
                  <>
                    <ArrowUpAZ className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">A-Z</span>
                  </>
                ) : (
                  <>
                    <ArrowDownZA className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Z-A</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Recipients List */}
          <div className="space-y-2">
            <div
              className={`${showRemovedRecipients && removedRecipients.length > 0 ? "max-h-[180px]" : "max-h-[200px]"} overflow-y-auto space-y-2 pr-1 custom-scrollbar`}
            >
              {sortedAndFilteredRecipients.map((recipient) => (
                <div key={recipient.id}>
                  {/* Recipient Row */}
                  <div
                    className={`flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50 rounded-lg border ${
                      hasCustomMessage(recipient.id)
                        ? "border-orange-300 dark:border-orange-600"
                        : "border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"
                    } group hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-200`}
                  >
                    {/* Avatar */}
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] flex-shrink-0">
                      <Image
                        src={`https://i.pravatar.cc/150?u=${recipient.primaryId}`}
                        alt={recipient.primaryName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
                          {recipient.primaryName}
                        </p>
                        {recipient.badge && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                              badgeColorClasses[recipient.badgeColor || "gray"]
                            }`}
                          >
                            {recipient.badge}
                          </span>
                        )}
                        {hasCustomMessage(recipient.id) && (
                          <span className="text-[10px] text-orange-600 dark:text-orange-400 font-normal">(custom)</span>
                        )}
                      </div>
                      {(recipient.secondaryName || recipient.secondaryInfo) && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 truncate">
                          {recipient.secondaryName}
                          {recipient.secondaryName && recipient.secondaryInfo && " • "}
                          {recipient.secondaryInfo}
                        </p>
                      )}
                      {recipient.highlightValue && (
                        <p className="text-xs font-medium text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">
                          {recipient.highlightLabel || "Value"}:{" "}
                          {formatHighlightValue ? formatHighlightValue(recipient.highlightValue) : recipient.highlightValue}
                        </p>
                      )}
                    </div>

                    {/* Edit Button */}
                    <button
                      onClick={() => startEditingRecipient(recipient.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center bg-white dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 border border-gray-300 dark:border-gray-500 text-gray-500 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-600 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200 flex-shrink-0 cursor-pointer"
                      title="Customize message for this recipient"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveRecipient(recipient.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center bg-white dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 border border-gray-300 dark:border-gray-500 text-gray-500 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-900/20 purple:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 flex-shrink-0 cursor-pointer"
                      title="Remove from list"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Inline Edit Panel */}
                  {editingRecipientId === recipient.id && (
                    <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-700 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-orange-700 dark:text-orange-400">
                          Custom message for {recipient.primaryName}
                        </h4>
                        <button
                          onClick={saveRecipientMessage}
                          className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-orange-600 text-white hover:bg-orange-700 transition-colors cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          Done
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                        Leave blank to use the default channel message.
                      </p>
                      {Array.from(selectedChannels).map((channelId) => {
                        const channel = channels.find((c) => c.id === channelId);
                        if (!channel) return null;
                        const Icon = channel.icon;
                        return (
                          <div key={channelId} className="mb-3 last:mb-0">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-1">
                              <Icon className="w-3.5 h-3.5" />
                              {channel.label}
                            </div>
                            {channel.hasSubject && (
                              <input
                                type="text"
                                value={editingRecipientMessages[channelId]?.subject || ""}
                                onChange={(e) => updateEditingRecipientMessage(channelId, "subject", e.target.value)}
                                className="w-full px-2 py-1 mb-1 text-xs rounded border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                placeholder={`Subject (default: ${channelMessages[channelId]?.subject || "N/A"})`}
                              />
                            )}
                            <textarea
                              value={editingRecipientMessages[channelId]?.message || ""}
                              onChange={(e) => updateEditingRecipientMessage(channelId, "message", e.target.value)}
                              rows={2}
                              className="w-full px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
                              placeholder="Leave blank to use default message..."
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Removed Recipients Panel */}
          {showRemovedRecipients && removedRecipients.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/10 border border-green-300 dark:border-green-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-green-700 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400">
                  Removed ({removedRecipients.length})
                </h3>
              </div>

              <div className="max-h-[100px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {removedRecipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    className="flex items-center gap-2 p-2 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50 rounded-lg border border-green-200 dark:border-green-600 text-sm"
                  >
                    <span className="flex-1 truncate text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                      {recipient.primaryName}
                      {recipient.secondaryInfo && ` - ${recipient.secondaryInfo}`}
                    </span>
                    <button
                      onClick={() => {
                        setRemovedRecipients((prev) => prev.filter((r) => r.id !== recipient.id));
                      }}
                      className="text-xs text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 hover:underline cursor-pointer"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {recipients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">No recipients selected</p>
            </div>
          ) : filteredRecipients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">No recipients match your search</p>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 flex-shrink-0 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-b-2xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
            Sending to {selectedChannels.size} {selectedChannels.size === 1 ? "channel" : "channels"}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15 transition-all duration-200 cursor-pointer active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={recipients.length === 0 || selectedChannels.size === 0}
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm text-white ${headerIconColorClasses[headerColor]} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2`}
            >
              <Send className="w-4 h-4" />
              {confirmButtonText} ({recipients.length})
            </button>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
}
