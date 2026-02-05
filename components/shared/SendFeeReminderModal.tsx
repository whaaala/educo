"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Modal from "./Modal";
import FormInput from "./FormInput";
import FormTextarea, { AttachmentFile } from "./FormTextarea";
import FormButton from "./FormButton";
import ModernCalendar from "./ModernCalendar";
import ModernTimePicker from "./ModernTimePicker";
import {
  Send,
  Mail,
  MessageSquare,
  Phone,
  Bell,
  Calendar,
  Clock,
  AlertCircle,
  User,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export interface SendFeeReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  parentId: string;
  childName: string;
  childId: string;
  feeRecordId: string;
  feeType: string;
  amount: number;
  balance: number;
  dueDate: string;
  money: (amount: number) => string;
  onSend?: (data: ReminderData & { feeRecordId: string; parentId: string; childId: string }) => void;
  // Customization props
  title?: string;
  successTitle?: string;
  sendButtonText?: string;
  scheduleButtonText?: string;
  channelSectionLabel?: string;
  showScheduleOption?: boolean;
  defaultChannels?: string[];
}

export interface ChannelMessage {
  subject?: string;
  message: string;
  attachments?: AttachmentFile[];
}

export interface ReminderData {
  channels: string[];
  messages: Record<string, ChannelMessage>;
  scheduleDate?: string;
  scheduleTime?: string;
}

// Character limits for different channels
const CHANNEL_LIMITS = {
  email: { message: 5000, subject: 200 },
  sms: { message: 160 },
  push: { message: 200, title: 50 },
  whatsapp: { message: 1000 },
};

export default function SendFeeReminderModal({
  isOpen,
  onClose,
  parentName,
  parentEmail,
  parentPhone,
  parentId,
  childName,
  childId,
  feeRecordId,
  feeType,
  amount: _amount,
  balance,
  dueDate,
  money,
  onSend,
  // Customization props with defaults
  title = "Send Payment Reminder",
  successTitle = "Reminder Sent!",
  sendButtonText = "Send Reminder",
  scheduleButtonText = "Schedule Reminder",
  channelSectionLabel = "Send via",
  showScheduleOption = true,
  defaultChannels = ["email"],
}: SendFeeReminderModalProps) {
  // Generate default messages for each channel
  const getDefaultMessages = () => {
    const formattedBalance = money(balance);
    const formattedDueDate = new Date(dueDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const shortDueDate = new Date(dueDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

    return {
      email: {
        subject: `Payment Reminder: ${feeType} for ${childName}`,
        message: `Dear ${parentName},\n\nThis is a friendly reminder that an outstanding balance of ${formattedBalance} is due for ${feeType} for your child ${childName}.\n\nDue Date: ${formattedDueDate}\n\nPlease arrange for payment at your earliest convenience. If you have already made this payment, please disregard this notice.\n\nThank you for your prompt attention to this matter.\n\nBest regards,\nSchool Administration`,
        attachments: [],
      },
      sms: {
        message: `Hi ${parentName.split(" ")[0]}, reminder: ${formattedBalance} due for ${childName}'s ${feeType} by ${shortDueDate}. Please pay soon. - School Admin`,
      },
      push: {
        subject: `Payment Due: ${formattedBalance}`,
        message: `${feeType} for ${childName} is due by ${shortDueDate}. Tap to view details and pay.`,
      },
      whatsapp: {
        message: `Hello ${parentName},\n\nThis is a reminder from School Administration.\n\n*Outstanding Balance:* ${formattedBalance}\n*Fee Type:* ${feeType}\n*Student:* ${childName}\n*Due Date:* ${formattedDueDate}\n\nPlease arrange payment at your earliest convenience.\n\nThank you!`,
        attachments: [],
      },
    };
  };

  const [channels, setChannels] = useState<string[]>(defaultChannels);
  const [activeTab, setActiveTab] = useState<string>("email");
  const [messages, setMessages] = useState<Record<string, ChannelMessage>>(getDefaultMessages());
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const dateInputRef = useRef<HTMLButtonElement>(null);
  const timeInputRef = useRef<HTMLButtonElement>(null);

  const channelOptions = [
    { id: "email", label: "Email", icon: <Mail className="w-4 h-4" />, description: parentEmail, color: "blue" },
    { id: "sms", label: "SMS", icon: <Phone className="w-4 h-4" />, description: parentPhone, color: "green" },
    { id: "push", label: "Push Notification", icon: <Bell className="w-4 h-4" />, description: "Mobile App", color: "purple" },
    { id: "whatsapp", label: "WhatsApp", icon: <MessageSquare className="w-4 h-4" />, description: parentPhone, color: "emerald" },
  ];

  // Update active tab when channels change
  useEffect(() => {
    if (channels.length > 0 && !channels.includes(activeTab)) {
      setActiveTab(channels[0]);
    }
  }, [channels, activeTab]);

  const toggleChannel = (channelId: string) => {
    setChannels((prev) => {
      const newChannels = prev.includes(channelId)
        ? prev.filter((c) => c !== channelId)
        : [...prev, channelId];

      // If we're adding a channel, switch to it
      if (!prev.includes(channelId)) {
        setActiveTab(channelId);
      }

      return newChannels;
    });
  };

  const updateMessage = (channel: string, field: "message" | "subject", value: string) => {
    setMessages((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [field]: value,
      },
    }));
  };

  const updateAttachments = (channel: string, attachments: AttachmentFile[]) => {
    setMessages((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        attachments,
      },
    }));
  };

  // Check if channel supports attachments
  const supportsAttachments = (channel: string) => {
    return channel === "email" || channel === "whatsapp";
  };

  const getCharacterCount = (channel: string, field: "message" | "subject" = "message") => {
    const text = field === "subject" ? messages[channel]?.subject || "" : messages[channel]?.message || "";
    const limit = field === "subject"
      ? (CHANNEL_LIMITS[channel as keyof typeof CHANNEL_LIMITS] as { subject?: number })?.subject
      : CHANNEL_LIMITS[channel as keyof typeof CHANNEL_LIMITS]?.message;
    return { count: text.length, limit: limit || 0 };
  };

  const isOverLimit = (channel: string, field: "message" | "subject" = "message") => {
    const { count, limit } = getCharacterCount(channel, field);
    return limit > 0 && count > limit;
  };

  const handleSend = async () => {
    if (channels.length === 0) return;

    setIsSending(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const reminderData: ReminderData & { feeRecordId: string; parentId: string; childId: string } = {
      channels,
      messages: channels.reduce((acc, channel) => {
        acc[channel] = messages[channel];
        return acc;
      }, {} as Record<string, ChannelMessage>),
      scheduleDate: isScheduled ? scheduleDate : undefined,
      scheduleTime: isScheduled ? scheduleTime : undefined,
      feeRecordId,
      parentId,
      childId,
    };

    onSend?.(reminderData);
    setIsSending(false);
    setIsSent(true);

    // Auto close after showing success
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setIsSent(false);
    setIsSending(false);
    setShowDatePicker(false);
    setShowTimePicker(false);
    onClose();
  };

  const handleDateChange = (date: string) => {
    setScheduleDate(date);
    setShowDatePicker(false);
  };

  const handleTimeChange = (time: string) => {
    setScheduleTime(time);
    setShowTimePicker(false);
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isOverdue = new Date(dueDate) < new Date();

  // Check if any selected channel has messages over limit
  const hasOverLimitMessages = channels.some(
    (channel) => isOverLimit(channel, "message") || (channel === "email" && isOverLimit(channel, "subject"))
  );

  // Footer content
  const footerContent = !isSent ? (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        {channels.length > 0 && (
          <span>
            Sending to {channels.length} channel{channels.length > 1 ? "s" : ""}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <FormButton type="button" onClick={handleClose} variant="secondary">
          Cancel
        </FormButton>
        <FormButton
          type="button"
          onClick={handleSend}
          variant="primary"
          disabled={channels.length === 0 || isSending || hasOverLimitMessages || (isScheduled && (!scheduleDate || !scheduleTime))}
          icon={isSending ? undefined : <Send className="w-4 h-4" />}
        >
          {isSending ? "Sending..." : isScheduled ? scheduleButtonText : sendButtonText}
        </FormButton>
      </div>
    </div>
  ) : undefined;

  // Get tab colors
  const getTabColor = (channelId: string, isActive: boolean) => {
    const colors: Record<string, { active: string; inactive: string }> = {
      email: {
        active: "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
        inactive: "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
      },
      sms: {
        active: "border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
        inactive: "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
      },
      push: {
        active: "border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20",
        inactive: "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
      },
      whatsapp: {
        active: "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
        inactive: "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
      },
    };
    return isActive ? colors[channelId]?.active : colors[channelId]?.inactive;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isSent ? successTitle : title}
      subtitle={isSent ? "The reminder has been sent successfully" : `${feeType} - ${money(balance)} outstanding`}
      icon={isSent ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <Send className="w-5 h-5 sm:w-6 sm:h-6" />}
      maxWidth="2xl"
      footer={footerContent}
    >
      {isSent ? (
        <div className="py-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Reminder Sent Successfully!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {isScheduled
              ? `Reminder scheduled for ${formatDisplayDate(scheduleDate)} at ${scheduleTime}`
              : `Reminder sent to ${parentName} via ${channels.map(c => channelOptions.find(o => o.id === c)?.label).join(", ")}`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Parent & Student Info */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                <Image
                  src={`https://i.pravatar.cc/150?u=${parentId}`}
                  alt={parentName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-gray-500" />
                  <p className="font-semibold text-gray-900 dark:text-white">{parentName}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <GraduationCap className="w-3.5 h-3.5 text-gray-500" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Parent of {childName}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-red-600 dark:text-red-400">{money(balance)}</p>
              <div className="flex items-center gap-1 mt-1">
                {isOverdue ? (
                  <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="w-3 h-3" />
                    Overdue
                  </span>
                ) : (
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Due: {new Date(dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Channel Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
              {channelSectionLabel}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {channelOptions.map((channel) => (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => toggleChannel(channel.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-left cursor-pointer ${
                    channels.includes(channel.id)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        channels.includes(channel.id)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {channel.icon}
                    </div>
                    <div>
                      <p
                        className={`font-medium text-sm ${
                          channels.includes(channel.id)
                            ? "text-blue-700 dark:text-blue-300"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {channel.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                        {channel.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Section with Tabs (when multiple channels selected) */}
          {channels.length > 0 && (
            <div>
              {/* Tabs for multiple channels */}
              {channels.length > 1 && (
                <div className="flex gap-1 mb-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-x-auto">
                  {channels.map((channelId) => {
                    const channel = channelOptions.find((c) => c.id === channelId);
                    const hasError = isOverLimit(channelId, "message") || (channelId === "email" && isOverLimit(channelId, "subject"));
                    return (
                      <button
                        key={channelId}
                        type="button"
                        onClick={() => setActiveTab(channelId)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap border-b-2 ${getTabColor(channelId, activeTab === channelId)}`}
                      >
                        {channel?.icon}
                        {channel?.label}
                        {hasError && (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Active Channel Message Form */}
              <div className="space-y-4">
                {/* Subject field for email and push */}
                {(activeTab === "email" || activeTab === "push") && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                          {activeTab === "email" ? (
                            <Mail className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <Bell className="w-2.5 h-2.5 text-purple-600 dark:text-purple-400" />
                          )}
                        </div>
                        <span>{activeTab === "email" ? "Email Subject" : "Notification Title"}</span>
                      </label>
                      {activeTab === "push" && (
                        <span className={`text-xs ${isOverLimit(activeTab, "subject") ? "text-red-500 font-semibold" : "text-gray-400"}`}>
                          {getCharacterCount(activeTab, "subject").count}/{getCharacterCount(activeTab, "subject").limit}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={messages[activeTab]?.subject || ""}
                      onChange={(e) => updateMessage(activeTab, "subject", e.target.value)}
                      placeholder={activeTab === "email" ? "Enter email subject" : "Enter notification title"}
                      className={`w-full min-h-[46px] text-sm font-normal bg-white dark:bg-gray-800 border rounded-xl px-4 py-2.5 outline-none focus:ring-2 transition-all duration-200 ${
                        isOverLimit(activeTab, "subject")
                          ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-blue-500/20 focus:border-blue-500"
                      } text-gray-900 dark:text-white`}
                    />
                    {isOverLimit(activeTab, "subject") && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {activeTab === "push" ? "Title" : "Subject"} exceeds maximum length
                      </p>
                    )}
                  </div>
                )}

                {/* Message field */}
                <FormTextarea
                  label="Message"
                  icon={<MessageSquare className="w-3.5 h-3.5" />}
                  iconBgColor="bg-purple-100 dark:bg-purple-900/30"
                  iconColor="text-purple-600 dark:text-purple-400"
                  value={messages[activeTab]?.message || ""}
                  onChange={(value) => updateMessage(activeTab, "message", value)}
                  placeholder="Enter your message..."
                  rows={activeTab === "sms" ? 3 : activeTab === "push" ? 4 : 6}
                  showCharacterCount={true}
                  maxLength={CHANNEL_LIMITS[activeTab as keyof typeof CHANNEL_LIMITS]?.message}
                  characterCountPosition="top"
                  showAttachments={supportsAttachments(activeTab)}
                  attachments={messages[activeTab]?.attachments || []}
                  onAttachmentsChange={(attachments) => updateAttachments(activeTab, attachments)}
                  maxAttachments={5}
                  maxFileSize={10}
                  acceptedFileTypes={activeTab === "email" ? "image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" : "image/*,.pdf,.doc,.docx"}
                  error={
                    isOverLimit(activeTab, "message")
                      ? `Message exceeds maximum length for ${channelOptions.find(c => c.id === activeTab)?.label}`
                      : undefined
                  }
                />
                {activeTab === "sms" && !isOverLimit(activeTab, "message") && (
                  <p className="mt-1 text-xs text-gray-500">
                    SMS messages are limited to 160 characters for best delivery
                  </p>
                )}
              </div>
            </div>
          )}

          {/* No channels selected message */}
          {channels.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Select at least one channel to send the reminder</p>
            </div>
          )}

          {/* Schedule Option */}
          {showScheduleOption && (
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Schedule for later</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Send at a specific date and time</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduled(!isScheduled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all cursor-pointer ${
                  isScheduled
                    ? "bg-orange-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                    isScheduled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>

            {isScheduled && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {/* Date Picker */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                      <Calendar className="w-2.5 h-2.5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span>Schedule Date</span>
                  </label>
                  <button
                    ref={dateInputRef}
                    type="button"
                    onClick={() => {
                      setShowDatePicker(!showDatePicker);
                      setShowTimePicker(false);
                    }}
                    className="w-full min-h-[46px] text-sm font-normal text-left bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl px-4 py-2.5 outline-none focus:ring-2 transition-all duration-200 cursor-pointer"
                  >
                    {scheduleDate ? (
                      <span className="text-gray-900 dark:text-white">{formatDisplayDate(scheduleDate)}</span>
                    ) : (
                      <span className="text-gray-400/70 dark:text-gray-500/70 italic">Select date</span>
                    )}
                  </button>
                  {showDatePicker && (
                    <ModernCalendar
                      value={scheduleDate}
                      onChange={handleDateChange}
                      onClose={() => setShowDatePicker(false)}
                      triggerRef={dateInputRef}
                    />
                  )}
                </div>

                {/* Time Picker */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                      <Clock className="w-2.5 h-2.5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span>Schedule Time</span>
                  </label>
                  <button
                    ref={timeInputRef}
                    type="button"
                    onClick={() => {
                      setShowTimePicker(!showTimePicker);
                      setShowDatePicker(false);
                    }}
                    className="w-full min-h-[46px] text-sm font-normal text-left bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl px-4 py-2.5 outline-none focus:ring-2 transition-all duration-200 cursor-pointer"
                  >
                    {scheduleTime ? (
                      <span className="text-gray-900 dark:text-white">{scheduleTime}</span>
                    ) : (
                      <span className="text-gray-400/70 dark:text-gray-500/70 italic">Select time</span>
                    )}
                  </button>
                  {showTimePicker && (
                    <ModernTimePicker
                      value={scheduleTime}
                      onChange={handleTimeChange}
                      onClose={() => setShowTimePicker(false)}
                      triggerRef={timeInputRef}
                      format="12h"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          )}
        </div>
      )}
    </Modal>
  );
}
