"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Send,
  Paperclip,
  XCircle,
  ExternalLink,
} from "lucide-react";
import Modal from "@/components/shared/Modal";
import FormButton from "@/components/shared/FormButton";
import { useNotifications } from "@/contexts/NotificationContext";

// Generic recipient interface that works for parents, teachers, students, etc.
export interface MessageRecipient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePhoto?: string;
  role?: string; // e.g., "Parent", "Teacher", "Student", "Father", "Mother", etc.
}

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: MessageRecipient;
  /** URL path for viewing all messages for this recipient (e.g., "/admin/parents/messages") */
  messagesPageUrl?: string;
  /** Type of recipient for display purposes */
  recipientType?: "parent" | "teacher" | "student" | "staff" | "user";
}

export default function SendMessageModal({
  isOpen,
  onClose,
  recipient,
  messagesPageUrl,
  recipientType = "user",
}: SendMessageModalProps) {
  const router = useRouter();
  const { addNotification } = useNotifications();

  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [emailAttachments, setEmailAttachments] = useState<File[]>([]);

  // Refs
  const emailFileInputRef = useRef<HTMLInputElement>(null);

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return "🖼️";
    if (file.type.includes("pdf")) return "📄";
    if (file.type.includes("word") || file.type.includes("document")) return "📝";
    if (file.type.includes("excel") || file.type.includes("spreadsheet")) return "📊";
    return "📎";
  };

  // Handle email file selection
  const handleEmailFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setEmailAttachments((prev) => [...prev, ...Array.from(files)]);
    }
    e.target.value = "";
  };

  // Remove attachment
  const removeEmailAttachment = (index: number) => {
    setEmailAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Send email
  const handleSendEmail = () => {
    if (!emailSubject.trim() || !emailMessage.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setEmailSubject("");
      setEmailMessage("");
      setEmailAttachments([]);
      addNotification({
        type: "success",
        title: "Email Sent",
        message: `Your email to ${recipient.firstName} ${recipient.lastName} has been sent successfully.`,
      });
      handleClose();
    }, 1500);
  };

  // Handle close
  const handleClose = () => {
    setEmailSubject("");
    setEmailMessage("");
    setEmailAttachments([]);
    onClose();
  };

  // Navigate to messages page for this recipient
  const handleViewAllMessages = () => {
    handleClose();
    if (messagesPageUrl) {
      const url = messagesPageUrl.includes("?")
        ? `${messagesPageUrl}&recipient=${recipient.id}`
        : `${messagesPageUrl}?recipient=${recipient.id}`;
      router.push(url);
    }
  };

  const fullName = `${recipient.firstName} ${recipient.lastName}`;
  const initials = `${recipient.firstName.charAt(0)}${recipient.lastName.charAt(0)}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Send Message"
      subtitle={`Email to ${fullName}`}
      icon={<Mail className="w-5 h-5" />}
      maxWidth="lg"
    >
      <div className="flex flex-col h-[400px]">
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
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white">{fullName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {recipient.email}
                {recipient.phone && ` • ${recipient.phone}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {recipient.role && (
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                  {recipient.role}
                </span>
              )}
              {messagesPageUrl && (
                <button
                  onClick={handleViewAllMessages}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                  title={`View all messages with this ${recipientType}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">View All</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Email Form */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Subject */}
          <div>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Subject"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>

          {/* Message Body */}
          <div className="flex-1">
            <textarea
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              placeholder="Write your message..."
              className="w-full h-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>

          {/* Email Attachments Preview */}
          {emailAttachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {emailAttachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <span>{getFileIcon(file)}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-300 max-w-[100px] truncate">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeEmailAttachment(index)}
                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Email Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => emailFileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
              >
                <Paperclip className="w-4 h-4" />
                Attach
              </button>
              <input
                ref={emailFileInputRef}
                type="file"
                multiple
                onChange={handleEmailFileSelect}
                className="hidden"
              />
            </div>

            <FormButton
              type="button"
              variant="primary"
              onClick={handleSendEmail}
              disabled={!emailSubject.trim() || !emailMessage.trim() || isSending}
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </FormButton>
          </div>
        </div>
      </div>
    </Modal>
  );
}
