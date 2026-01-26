"use client";

import { useState } from "react";
import Modal from "./Modal";
import {
  Send,
  Mail,
  Phone,
  MessageSquare,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Paperclip,
  FileText,
  Image as ImageIcon,
  File,
  Download,
  Eye,
  X,
} from "lucide-react";
import { type FeeReminderRecord, type ReminderAttachment } from "@/lib/mockParents";

// Helper to get file icon based on type
const getFileIcon = (type: ReminderAttachment["type"]) => {
  switch (type) {
    case "pdf":
      return <FileText className="w-4 h-4 text-red-500" />;
    case "image":
      return <ImageIcon className="w-4 h-4 text-blue-500" />;
    case "document":
      return <File className="w-4 h-4 text-gray-500" />;
    default:
      return <File className="w-4 h-4 text-gray-500" />;
  }
};

interface FeeReminderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: FeeReminderRecord[];
  feeType: string;
  childName: string;
  balance: number;
  money: (amount: number) => string;
}

// Helper function to get channel icon
const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "email": return <Mail className="w-4 h-4" />;
    case "sms": return <Phone className="w-4 h-4" />;
    case "push": return <Bell className="w-4 h-4" />;
    case "whatsapp": return <MessageSquare className="w-4 h-4" />;
    default: return <Send className="w-4 h-4" />;
  }
};

// Helper function to get channel color classes
const getChannelColorClasses = (channel: string) => {
  switch (channel) {
    case "email": return { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", label: "Email" };
    case "sms": return { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400", label: "SMS" };
    case "push": return { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400", label: "Push" };
    case "whatsapp": return { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400", label: "WhatsApp" };
    default: return { bg: "bg-gray-100 dark:bg-gray-700", text: "text-gray-600 dark:text-gray-400", label: channel };
  }
};

// Helper function to get status config
const getStatusConfig = (status: string) => {
  switch (status) {
    case "delivered":
      return {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        label: "Delivered",
      };
    case "sent":
      return {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        icon: <Send className="w-3.5 h-3.5" />,
        label: "Sent",
      };
    case "scheduled":
      return {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-400",
        icon: <Clock className="w-3.5 h-3.5" />,
        label: "Scheduled",
      };
    case "failed":
      return {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        label: "Failed",
      };
    default:
      return {
        bg: "bg-gray-100 dark:bg-gray-700",
        text: "text-gray-600 dark:text-gray-400",
        icon: null,
        label: status,
      };
  }
};

// Attachment Preview Component
function AttachmentPreview({
  attachment,
  onClose
}: {
  attachment: ReminderAttachment;
  onClose: () => void;
}) {
  const isPlaceholder = attachment.id.startsWith("placeholder-") || attachment.size === "Unknown";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Attachment Preview</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="p-6">
          {/* File Icon */}
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
            {attachment.type === "pdf" && <FileText className="w-10 h-10 text-red-500" />}
            {attachment.type === "image" && <ImageIcon className="w-10 h-10 text-blue-500" />}
            {attachment.type === "document" && <File className="w-10 h-10 text-gray-500" />}
          </div>

          {/* File Details */}
          <div className="text-center mb-6">
            <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              {attachment.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {attachment.type.toUpperCase()} • {attachment.size}
            </p>
          </div>

          {/* Notice for placeholder/demo */}
          {isPlaceholder ? (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 mb-4">
              <p className="text-sm text-amber-700 dark:text-amber-400 text-center">
                This is a demo attachment. In a real application, the actual file content would be displayed here.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 mb-4">
              <p className="text-sm text-blue-700 dark:text-blue-400 text-center">
                File preview would open in a new tab or display inline depending on the file type.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                // In a real app, this would trigger a download
                onClose();
              }}
              className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual Reminder Item Component
function ReminderItem({ reminder }: { reminder: FeeReminderRecord }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedAttachments, setExpandedAttachments] = useState<string | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<ReminderAttachment | null>(null);
  const statusConfig = getStatusConfig(reminder.status);

  const toggleAttachments = (channel: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedAttachments(expandedAttachments === channel ? null : channel);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      {/* Header - Always visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          {/* Channel Icons */}
          <div className="flex -space-x-1">
            {reminder.channels.map((channel, idx) => {
              const config = getChannelColorClasses(channel);
              return (
                <div
                  key={channel}
                  className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center border-2 border-white dark:border-gray-800`}
                  style={{ zIndex: reminder.channels.length - idx }}
                  title={config.label}
                >
                  <span className={config.text}>{getChannelIcon(channel)}</span>
                </div>
              );
            })}
          </div>

          {/* Date & Time */}
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {new Date(reminder.sentAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(reminder.sentAt).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
            {statusConfig.icon}
            {statusConfig.label}
          </span>

          {/* Expand/Collapse Icon */}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 space-y-4 bg-white dark:bg-gray-900">
          {/* Channels Detail */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Channels Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {reminder.channels.map((channel) => {
                const config = getChannelColorClasses(channel);
                return (
                  <span
                    key={channel}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${config.bg} ${config.text}`}
                  >
                    {getChannelIcon(channel)}
                    {config.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Message Content per Channel */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Message Content
            </h4>
            <div className="space-y-3">
              {reminder.channels.map((channel) => {
                const config = getChannelColorClasses(channel);
                const msg = reminder.messages[channel];
                if (!msg) return null;

                // Get effective attachments - use array if available, or generate placeholders from count
                const effectiveAttachments: ReminderAttachment[] =
                  (msg.attachments && msg.attachments.length > 0)
                    ? msg.attachments
                    : (msg.attachmentCount && msg.attachmentCount > 0)
                      ? Array.from({ length: msg.attachmentCount }, (_, i) => ({
                          id: `placeholder-${channel}-${i}`,
                          name: `Attachment_${i + 1}.pdf`,
                          type: "pdf" as const,
                          size: "Unknown",
                        }))
                      : [];

                return (
                  <div
                    key={channel}
                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 rounded-lg ${config.bg} flex items-center justify-center`}>
                        <span className={config.text}>{getChannelIcon(channel)}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {config.label}
                      </span>
                      {/* Attachment badge - clickable when there are attachments */}
                      {effectiveAttachments.length > 0 && (
                        <button
                          type="button"
                          onClick={(e) => toggleAttachments(channel, e)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors cursor-pointer ${
                            expandedAttachments === channel
                              ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                          }`}
                        >
                          <Paperclip className="w-3 h-3" />
                          {effectiveAttachments.length} attachment{effectiveAttachments.length > 1 ? "s" : ""}
                          {expandedAttachments === channel ? (
                            <ChevronUp className="w-3 h-3 ml-0.5" />
                          ) : (
                            <ChevronDown className="w-3 h-3 ml-0.5" />
                          )}
                        </button>
                      )}
                    </div>
                    {msg.subject && (
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {msg.subject}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {msg.message}
                    </p>

                    {/* Expandable Attachments List */}
                    {expandedAttachments === channel && effectiveAttachments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Attachments
                          </span>
                          <button
                            type="button"
                            onClick={(e) => toggleAttachments(channel, e)}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5 text-gray-400" />
                          </button>
                        </div>
                        <div className="space-y-2">
                          {effectiveAttachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                  {getFileIcon(attachment.type)}
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                                    {attachment.name}
                                  </p>
                                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                    {attachment.size}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewAttachment(attachment);
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                  title="Preview"
                                >
                                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewAttachment(attachment);
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                  title="Download"
                                >
                                  <Download className="w-3.5 h-3.5 text-green-500" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sent By */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">Sent by</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-white">{reminder.sentBy}</span>
          </div>
        </div>
      )}

      {/* Attachment Preview Modal */}
      {previewAttachment && (
        <AttachmentPreview
          attachment={previewAttachment}
          onClose={() => setPreviewAttachment(null)}
        />
      )}
    </div>
  );
}

export default function FeeReminderHistoryModal({
  isOpen,
  onClose,
  reminders,
  feeType,
  childName,
  balance,
  money,
}: FeeReminderHistoryModalProps) {
  // Calculate channel stats
  const channelStats = {
    email: reminders.filter(r => r.channels.includes("email")).length,
    sms: reminders.filter(r => r.channels.includes("sms")).length,
    push: reminders.filter(r => r.channels.includes("push")).length,
    whatsapp: reminders.filter(r => r.channels.includes("whatsapp")).length,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reminder History"
      subtitle={`${reminders.length} reminder${reminders.length !== 1 ? "s" : ""} sent`}
      icon={<Send className="w-5 h-5" />}
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Header Info */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 dark:from-orange-500/20 dark:to-amber-500/20 border border-orange-200 dark:border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{feeType}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{childName}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{money(balance)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Outstanding</p>
            </div>
          </div>

          {/* Channel Summary */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-orange-200/50 dark:border-orange-500/20">
            {channelStats.email > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                <Mail className="w-3 h-3" />
                {channelStats.email}
              </span>
            )}
            {channelStats.sms > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-[11px] font-semibold text-green-600 dark:text-green-400">
                <Phone className="w-3 h-3" />
                {channelStats.sms}
              </span>
            )}
            {channelStats.whatsapp > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <MessageSquare className="w-3 h-3" />
                {channelStats.whatsapp}
              </span>
            )}
            {channelStats.push > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                <Bell className="w-3 h-3" />
                {channelStats.push}
              </span>
            )}
          </div>
        </div>

        {/* Reminders List */}
        {reminders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No reminders sent yet</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Send a reminder to see history here</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {reminders.map((reminder) => (
              <ReminderItem key={reminder.id} reminder={reminder} />
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
