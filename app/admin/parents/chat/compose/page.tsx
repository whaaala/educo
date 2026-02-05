"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DashboardPage from "@/components/shared/DashboardPage";
import EmojiPickerPopover from "@/components/shared/EmojiPickerPopover";
import { getAllParents, type AdminParent } from "@/lib/mockParents";
import {
  Send,
  Paperclip,
  X,
  XCircle,
  Search,
  User,
  Users,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  MessageCircle,
  Circle,
  ArrowLeft,
} from "lucide-react";

export default function ComposeNewChatPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Form state
  const [selectedParent, setSelectedParent] = useState<AdminParent | null>(null);
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  // UI state
  const [isSending, setIsSending] = useState(false);
  const [showParentDropdown, setShowParentDropdown] = useState(true);
  const [parentSearch, setParentSearch] = useState("");

  // Get all parents
  const allParents = useMemo(() => getAllParents(), []);

  // Filter parents based on search
  const filteredParents = useMemo(() => {
    if (!parentSearch.trim()) return allParents;
    const search = parentSearch.toLowerCase();
    return allParents.filter(
      (parent) =>
        `${parent.firstName} ${parent.lastName}`.toLowerCase().includes(search) ||
        parent.email.toLowerCase().includes(search)
    );
  }, [allParents, parentSearch]);

  // Focus message input when parent is selected
  useEffect(() => {
    if (selectedParent && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [selectedParent]);

  // Handle parent selection
  const handleSelectParent = (parent: AdminParent) => {
    setSelectedParent(parent);
    setShowParentDropdown(false);
    setParentSearch("");
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Get file icon
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />;
    if (file.type.includes("pdf")) return <FileText className="w-4 h-4 text-red-500" />;
    return <FileText className="w-4 h-4" />;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    const textarea = messageInputRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = message.slice(0, start) + emoji + message.slice(end);
      setMessage(newMessage);
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      }, 0);
    } else {
      setMessage((prev) => prev + emoji);
    }
  };

  // Handle send message
  const handleSend = () => {
    if (!selectedParent || (!message.trim() && attachments.length === 0)) return;

    setIsSending(true);
    // Simulate sending and redirect to chat view
    setTimeout(() => {
      router.push(`/parents/chat?chatId=chat-${selectedParent.id}&from=admin&parentName=${encodeURIComponent(`${selectedParent.firstName} ${selectedParent.lastName}`)}`);
    }, 800);
  };

  // Check if form is valid
  const isFormValid = selectedParent && (message.trim() || attachments.length > 0);

  return (
    <DashboardPage
      title="New Chat"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Admin" },
        { label: "Parents", href: "/admin/parents" },
        { label: "Chat", href: "/admin/parents/chat" },
        { label: "New", isActive: true },
      ]}
      loadingText="Loading..."
      afterStats={
        <>
          <div className="flex justify-end mb-6">
            <button
              onClick={() => router.push("/admin/parents/chat")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Chats
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out h-[calc(100vh-250px)] min-h-[500px] flex flex-col">
          {!selectedParent ? (
            /* Parent Selection View */
            <div className="flex-1 flex flex-col">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Start a Conversation</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Select a parent to start chatting</p>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={parentSearch}
                    onChange={(e) => setParentSearch(e.target.value)}
                    placeholder="Search parents by name or email..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Parent List */}
              <div className="flex-1 overflow-y-auto">
                {filteredParents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">No parents found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredParents.map((parent, index) => {
                      // Use deterministic value based on index to avoid hydration mismatch
                      const isOnline = index % 3 !== 2;
                      return (
                        <button
                          key={parent.id}
                          onClick={() => handleSelectParent(parent)}
                          className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer text-left"
                        >
                          <div className="relative flex-shrink-0">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                              {parent.profilePhoto ? (
                                <Image src={parent.profilePhoto} alt={parent.firstName} fill className="object-cover" unoptimized />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="w-6 h-6 text-gray-500" />
                                </div>
                              )}
                            </div>
                            {isOnline && (
                              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {parent.firstName} {parent.lastName}
                              </p>
                              {isOnline && (
                                <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                  <Circle className="w-2 h-2 fill-current" />
                                  Online
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{parent.email}</p>
                            {parent.children[0] && (
                              <p className="text-xs text-blue-600 dark:text-blue-400 truncate mt-0.5">
                                Parent of {parent.children[0].fullName}
                              </p>
                            )}
                          </div>
                          <MessageCircle className="w-5 h-5 text-gray-400" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Chat View */
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <button
                  onClick={() => setSelectedParent(null)}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="relative flex-shrink-0">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {selectedParent.profilePhoto ? (
                      <Image src={selectedParent.profilePhoto} alt={selectedParent.firstName} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {selectedParent.firstName} {selectedParent.lastName}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">Online</p>
                </div>
              </div>

              {/* Empty Chat Area */}
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50/30 dark:bg-gray-900/30">
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <MessageCircle className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Start a Conversation</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
                  Send your first message to {selectedParent.firstName}. They will be notified instantly.
                </p>
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                {/* Attachments Preview */}
                {attachments.length > 0 && (
                  <div className="px-4 pt-3">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="relative flex-shrink-0 group">
                          {file.type.startsWith("image/") ? (
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                              <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex flex-col items-center justify-center p-1">
                              {getFileIcon(file)}
                              <span className="text-[8px] text-gray-500 truncate w-full text-center mt-1">{file.name.slice(0, 8)}...</span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-end gap-3 p-4">
                  <div className="flex items-center gap-1">
                    <EmojiPickerPopover onEmojiSelect={handleEmojiSelect} position="top" />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  <div className="flex-1">
                    <textarea
                      ref={messageInputRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && isFormValid) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-900 border-0 focus:ring-2 focus:ring-blue-500/50 resize-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none"
                      style={{ minHeight: "48px", maxHeight: "120px" }}
                    />
                  </div>

                  <button
                    onClick={handleSend}
                    disabled={!isFormValid || isSending}
                    className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-blue-500/25"
                  >
                    {isSending ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          </div>
        </>
      }
    />
  );
}
