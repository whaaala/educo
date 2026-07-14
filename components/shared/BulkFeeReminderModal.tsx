"use client";

import { X, Send, Search, ArrowUpAZ, ArrowDownZA, Undo2, Mail, MessageSquare, Bell, ChevronDown, ChevronUp, Edit2, Check } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

export interface BulkReminderRecord {
  id: string;
  parentId: string;
  parentName: string;
  parentEmail: string;
  parentPhone?: string;
  childId: string;
  childName: string;
  childClass: string;
  feeType: string;
  amount: number;
  balance: number;
  dueDate: string;
}

export interface ChannelMessage {
  subject?: string;
  message: string;
}

export interface RecordCustomMessage {
  email?: ChannelMessage;
  sms?: ChannelMessage;
  inApp?: ChannelMessage;
}

interface BulkFeeReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (recordIds: string[], channels: string[], channelMessages: Record<string, ChannelMessage>, customMessages: Record<string, RecordCustomMessage>) => void;
  records: BulkReminderRecord[];
  onRemoveRecord: (recordId: string) => void;
  money: (amount: number) => string;
  title?: string;
}

// Default message templates with placeholders
const defaultMessages: Record<string, ChannelMessage> = {
  email: {
    subject: "Fee Payment Reminder - {feeType}",
    message: "Dear {parentName},\n\nThis is a friendly reminder that {childName}'s {feeType} payment of {balance} is outstanding.\n\nPlease make the payment at your earliest convenience.\n\nThank you.",
  },
  sms: {
    message: "Dear {parentName}, reminder: {childName}'s {feeType} balance of {balance} is due. Please pay soon. Thank you.",
  },
  inApp: {
    subject: "Fee Payment Reminder",
    message: "Your {feeType} payment of {balance} for {childName} is outstanding. Please make the payment soon.",
  },
};

export default function BulkFeeReminderModal({
  isOpen,
  onClose,
  onConfirm,
  records,
  onRemoveRecord,
  money,
  title = "Send Bulk Reminders",
}: BulkFeeReminderModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [initialRecordCount, setInitialRecordCount] = useState(0);
  const [removedRecords, setRemovedRecords] = useState<BulkReminderRecord[]>([]);
  const [showRemovedRecords, setShowRemovedRecords] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set(["email"]));
  const [expandedChannel, setExpandedChannel] = useState<string | null>("email");
  const [channelMessages, setChannelMessages] = useState<Record<string, ChannelMessage>>(defaultMessages);
  const [customMessages, setCustomMessages] = useState<Record<string, RecordCustomMessage>>({});
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [editingRecordMessages, setEditingRecordMessages] = useState<RecordCustomMessage>({});
  const modalRef = useRef<HTMLDivElement>(null);

  // Scroll modal into view when it opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      setTimeout(() => {
        modalRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }, [isOpen]);

  // Track initial record count when modal opens
  useEffect(() => {
    if (isOpen) {
      setInitialRecordCount(records.length);
    }
  }, [isOpen, records.length]);

  // Calculate removed count
  const removedCount = initialRecordCount - records.length;

  // Filter records based on search query
  const filteredRecords = records.filter((record) =>
    record.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.feeType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort filtered records
  const sortedAndFilteredRecords = [...filteredRecords].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.parentName.localeCompare(b.parentName);
    } else {
      return b.parentName.localeCompare(a.parentName);
    }
  });

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Toggle channel selection
  const toggleChannel = (channel: string) => {
    setSelectedChannels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(channel)) {
        if (newSet.size > 1) {
          newSet.delete(channel);
          if (expandedChannel === channel) {
            setExpandedChannel(null);
          }
        }
      } else {
        newSet.add(channel);
        setExpandedChannel(channel);
      }
      return newSet;
    });
  };

  // Toggle channel message editor
  const toggleChannelExpand = (channel: string) => {
    if (selectedChannels.has(channel)) {
      setExpandedChannel(expandedChannel === channel ? null : channel);
    }
  };

  // Update channel message
  const updateChannelMessage = (channel: string, field: 'subject' | 'message', value: string) => {
    setChannelMessages(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [field]: value,
      },
    }));
  };

  // Start editing a record's custom message
  const startEditingRecord = (recordId: string) => {
    setEditingRecordId(recordId);
    setEditingRecordMessages(customMessages[recordId] || {});
  };

  // Save record's custom message
  const saveRecordMessage = () => {
    if (editingRecordId) {
      // Only save if there are actual custom messages
      const hasCustomContent = Object.values(editingRecordMessages).some(
        msg => msg && (msg.subject || msg.message)
      );
      if (hasCustomContent) {
        setCustomMessages(prev => ({
          ...prev,
          [editingRecordId]: editingRecordMessages,
        }));
      } else {
        // Remove custom message if empty
        setCustomMessages(prev => {
          const newMessages = { ...prev };
          delete newMessages[editingRecordId];
          return newMessages;
        });
      }
    }
    setEditingRecordId(null);
    setEditingRecordMessages({});
  };

  // Update editing record message
  const updateEditingRecordMessage = (channel: string, field: 'subject' | 'message', value: string) => {
    setEditingRecordMessages(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel as keyof RecordCustomMessage],
        [field]: value,
      },
    }));
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSortOrder("asc");
      setRemovedRecords([]);
      setShowRemovedRecords(false);
      setSelectedChannels(new Set(["email"]));
      setExpandedChannel("email");
      setChannelMessages(defaultMessages);
      setCustomMessages({});
      setEditingRecordId(null);
      setEditingRecordMessages({});
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (editingRecordId) {
          setEditingRecordId(null);
          setEditingRecordMessages({});
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
  }, [isOpen, onClose, editingRecordId]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(
      records.map((record) => record.id),
      Array.from(selectedChannels),
      channelMessages,
      customMessages
    );
  };

  // Handle removing a record and track it
  const handleRemoveRecord = (recordId: string) => {
    const recordToRemove = records.find(record => record.id === recordId);
    if (recordToRemove) {
      setRemovedRecords(prev => [...prev, recordToRemove]);
    }
    onRemoveRecord(recordId);
  };

  // Calculate total outstanding
  const totalOutstanding = records.reduce((sum, record) => sum + record.balance, 0);

  // Check if a record has custom message
  const hasCustomMessage = (recordId: string) => {
    return !!customMessages[recordId];
  };

  const channelConfig: Record<string, { icon: typeof Mail; label: string; color: 'blue' | 'green' | 'purple'; hasSubject: boolean }> = {
    email: { icon: Mail, label: "Email", color: "blue", hasSubject: true },
    sms: { icon: MessageSquare, label: "SMS", color: "green", hasSubject: false },
    inApp: { icon: Bell, label: "In-App", color: "purple", hasSubject: true },
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[calc(100vh-3rem)] sm:max-h-[calc(100vh-4rem)] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-orange-50 dark:bg-orange-900/20 midnight:bg-orange-900/20 purple:bg-orange-900/20 px-6 pt-4 pb-3 rounded-t-2xl border-b border-orange-100 dark:border-orange-800/30 midnight:border-orange-700/30 purple:border-orange-700/30 flex-shrink-0">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 dark:bg-orange-400 rounded-full opacity-20 animate-ping"></div>
              <div className="relative w-9 h-9 bg-orange-500 dark:bg-orange-600 midnight:bg-orange-600 purple:bg-orange-600 rounded-full flex items-center justify-center">
                <Send className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>
          <h2 className="text-sm font-bold text-center text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
            {title}
          </h2>
          <p className="text-xs text-center text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mt-1">
            Total Outstanding: <span className="font-semibold text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">{money(totalOutstanding)}</span>
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pt-4 pb-6 overflow-y-auto flex-1">
          {/* Channel Selection Cards */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-3">Send via</p>
            <div className="grid grid-cols-2 gap-3">
              {/* Email Channel */}
              <button
                onClick={() => toggleChannel("email")}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  selectedChannels.has("email")
                    ? "bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border-blue-500 dark:border-blue-400"
                    : "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedChannels.has("email")
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"
                }`}>
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-medium ${
                    selectedChannels.has("email")
                      ? "text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300"
                      : "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"
                  }`}>Email</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Via email address</p>
                </div>
              </button>

              {/* SMS Channel */}
              <button
                onClick={() => toggleChannel("sms")}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  selectedChannels.has("sms")
                    ? "bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-400"
                    : "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedChannels.has("sms")
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"
                }`}>
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-medium ${
                    selectedChannels.has("sms")
                      ? "text-green-700 dark:text-green-300"
                      : "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"
                  }`}>SMS</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Via phone number</p>
                </div>
              </button>

              {/* In-App Channel */}
              <button
                onClick={() => toggleChannel("inApp")}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  selectedChannels.has("inApp")
                    ? "bg-purple-50 dark:bg-purple-900/20 border-purple-500 dark:border-purple-400"
                    : "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedChannels.has("inApp")
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"
                }`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-medium ${
                    selectedChannels.has("inApp")
                      ? "text-purple-700 dark:text-purple-300"
                      : "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"
                  }`}>Push Notification</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Mobile App</p>
                </div>
              </button>

              {/* WhatsApp Channel (placeholder - disabled) */}
              <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 opacity-60">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">WhatsApp</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">Coming soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message Editor Section - Only show if at least one channel is selected */}
          {selectedChannels.size > 0 && (
            <div className="mb-5 p-4 bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              {/* Channel tabs */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                {Array.from(selectedChannels).map((channel) => {
                  const config = channelConfig[channel];
                  const Icon = config.icon;
                  const isActive = expandedChannel === channel;
                  return (
                    <button
                      key={channel}
                      onClick={() => setExpandedChannel(channel)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-600"
                          : "bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:border-gray-300 dark:hover:border-gray-500 midnight:hover:border-cyan-500/40 purple:hover:border-pink-500/40"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {config.label}
                    </button>
                  );
                })}
              </div>

              {/* Active channel message editor */}
              {expandedChannel && selectedChannels.has(expandedChannel) && (
                <div className="space-y-4">
                  {/* Subject field for email/inApp */}
                  {channelConfig[expandedChannel]?.hasSubject && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                          {expandedChannel === 'email' ? 'Email Subject' : 'Notification Title'}
                        </label>
                      </div>
                      <input
                        type="text"
                        value={channelMessages[expandedChannel]?.subject || ""}
                        onChange={(e) => updateChannelMessage(expandedChannel, 'subject', e.target.value)}
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
                        {channelMessages[expandedChannel]?.message?.length || 0}/{expandedChannel === 'sms' ? '160' : '5000'}
                      </span>
                    </div>
                    <textarea
                      value={channelMessages[expandedChannel]?.message || ""}
                      onChange={(e) => updateChannelMessage(expandedChannel, 'message', e.target.value)}
                      rows={expandedChannel === 'sms' ? 3 : 5}
                      className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:focus:border-orange-400 transition-all resize-none"
                      placeholder="Enter your message..."
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                      Available placeholders: <code className="px-1 py-0.5 bg-gray-200 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 rounded text-[10px]">{"{parentName}"}</code>{" "}
                      <code className="px-1 py-0.5 bg-gray-200 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 rounded text-[10px]">{"{childName}"}</code>{" "}
                      <code className="px-1 py-0.5 bg-gray-200 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 rounded text-[10px]">{"{feeType}"}</code>{" "}
                      <code className="px-1 py-0.5 bg-gray-200 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 rounded text-[10px]">{"{balance}"}</code>{" "}
                      <code className="px-1 py-0.5 bg-gray-200 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 rounded text-[10px]">{"{dueDate}"}</code>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search Field */}
          {records.length >= 5 && (
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by parent, student, or fee type..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 midnight:placeholder-cyan-400 purple:placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-600 focus:border-transparent transition-all duration-200"
              />
            </div>
          )}

          {/* Records List Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                Recipients ({filteredRecords.length} of {records.length}):
              </p>
              {removedCount > 0 && (
                <button
                  onClick={() => setShowRemovedRecords(!showRemovedRecords)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 border border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/40 transition-all duration-200 cursor-pointer active:scale-95"
                  title="Click to view removed items"
                >
                  {removedCount} removed
                </button>
              )}
            </div>

            {records.length > 1 && (
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

          {/* Records List */}
          <div className="space-y-2">
            <div className={`${showRemovedRecords && removedRecords.length > 0 ? 'max-h-[180px]' : 'max-h-[200px]'} overflow-y-auto space-y-2 pr-1 custom-scrollbar`}>
              {sortedAndFilteredRecords.map((record) => (
                <div key={record.id}>
                  {/* Record Row */}
                  <div
                    className={`flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50 rounded-lg border ${
                      hasCustomMessage(record.id)
                        ? 'border-orange-300 dark:border-orange-600'
                        : 'border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30'
                    } group hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-200`}
                  >
                    {/* Avatar */}
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] flex-shrink-0">
                      <Image
                        src={`https://i.pravatar.cc/150?u=${record.parentId}`}
                        alt={record.parentName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
                        {record.parentName}
                        {hasCustomMessage(record.id) && (
                          <span className="ml-2 text-[10px] text-orange-600 dark:text-orange-400 font-normal">(custom message)</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 truncate">
                        {record.childName} • {record.feeType}
                      </p>
                      <p className="text-xs font-medium text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">
                        Balance: {money(record.balance)}
                      </p>
                    </div>

                    {/* Edit Button */}
                    <button
                      onClick={() => startEditingRecord(record.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center bg-white dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 border border-gray-300 dark:border-gray-500 text-gray-500 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-600 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200 flex-shrink-0 cursor-pointer"
                      title="Customize message for this recipient"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveRecord(record.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center bg-white dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 border border-gray-300 dark:border-gray-500 text-gray-500 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-900/20 purple:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 flex-shrink-0 cursor-pointer"
                      title="Remove from list"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Inline Edit Panel */}
                  {editingRecordId === record.id && (
                    <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-700 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-orange-700 dark:text-orange-400">
                          Custom message for {record.parentName}
                        </h4>
                        <button
                          onClick={saveRecordMessage}
                          className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-orange-600 text-white hover:bg-orange-700 transition-colors cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          Done
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                        Leave blank to use the default channel message. Placeholders will be replaced with actual values.
                      </p>
                      {Array.from(selectedChannels).map((channel) => {
                        const config = channelConfig[channel as keyof typeof channelConfig];
                        const Icon = config.icon;
                        return (
                          <div key={channel} className="mb-3 last:mb-0">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-1">
                              <Icon className="w-3.5 h-3.5" />
                              {config.label}
                            </div>
                            {config.hasSubject && (
                              <input
                                type="text"
                                value={editingRecordMessages[channel as keyof RecordCustomMessage]?.subject || ""}
                                onChange={(e) => updateEditingRecordMessage(channel, 'subject', e.target.value)}
                                className="w-full px-2 py-1 mb-1 text-xs rounded border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                placeholder={`Subject (default: ${channelMessages[channel]?.subject || 'N/A'})`}
                              />
                            )}
                            <textarea
                              value={editingRecordMessages[channel as keyof RecordCustomMessage]?.message || ""}
                              onChange={(e) => updateEditingRecordMessage(channel, 'message', e.target.value)}
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

          {/* Removed Records Panel */}
          {showRemovedRecords && removedRecords.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/10 border border-green-300 dark:border-green-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-green-700 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400">
                  Removed ({removedRecords.length})
                </h3>
              </div>

              <div className="max-h-[100px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {removedRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center gap-2 p-2 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50 rounded-lg border border-green-200 dark:border-green-600 text-sm"
                  >
                    <span className="flex-1 truncate text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                      {record.parentName} - {record.feeType}
                    </span>
                    <button
                      onClick={() => {
                        setRemovedRecords(prev => prev.filter(r => r.id !== record.id));
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
          {records.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                No records with outstanding balance selected
              </p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                No records match your search
              </p>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 flex-shrink-0 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15 transition-all duration-200 cursor-pointer active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={records.length === 0 || selectedChannels.size === 0}
            className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-600 transition-all duration-200 cursor-pointer active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send Reminders ({records.length})
          </button>
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
