"use client";

import { useState, useRef, useMemo } from "react";
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
  ChevronDown,
  Mail,
  AlertCircle,
} from "lucide-react";

export default function ComposeMessagePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Form state
  const [recipients, setRecipients] = useState<AdminParent[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [priority, setPriority] = useState<"normal" | "high">("normal");
  const [category, setCategory] = useState<string>("General");

  // UI state
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
  const [recipientSearch, setRecipientSearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Get all parents for recipient selection
  const allParents = useMemo(() => getAllParents(), []);

  // Filter parents based on search
  const filteredParents = useMemo(() => {
    if (!recipientSearch.trim()) return allParents;
    const search = recipientSearch.toLowerCase();
    return allParents.filter(
      (parent) =>
        `${parent.firstName} ${parent.lastName}`.toLowerCase().includes(search) ||
        parent.email.toLowerCase().includes(search)
    );
  }, [allParents, recipientSearch]);

  // Categories
  const categories = ["Academic", "Fee", "Event", "General", "Complaint", "Inquiry"];

  // Handle recipient selection
  const handleSelectRecipient = (parent: AdminParent) => {
    if (!recipients.find((r) => r.id === parent.id)) {
      setRecipients([...recipients, parent]);
    }
    setRecipientSearch("");
    setShowRecipientDropdown(false);
  };

  // Handle removing recipient
  const handleRemoveRecipient = (parentId: string) => {
    setRecipients(recipients.filter((r) => r.id !== parentId));
  };

  // Handle select all recipients
  const handleSelectAll = () => {
    setRecipients([...allParents]);
    setShowRecipientDropdown(false);
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
    if (file.type.includes("word") || file.type.includes("document"))
      return <FileText className="w-4 h-4 text-blue-500" />;
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
    const textarea = textareaRef.current;
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
    if (!recipients.length || !subject.trim() || !message.trim()) return;

    setIsSending(true);
    // Simulate sending
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      // Redirect after showing success
      setTimeout(() => {
        router.push("/admin/parents/messages");
      }, 2000);
    }, 1500);
  };

  // Check if form is valid
  const isFormValid = recipients.length > 0 && subject.trim() && message.trim();

  return (
    <DashboardPage
      title="Compose Message"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Admin" },
        { label: "Parents", href: "/admin/parents" },
        { label: "Messages", href: "/admin/parents/messages" },
        { label: "Compose", isActive: true },
      ]}
      loadingText="Loading Compose"
      afterStats={
        <>
          {/* Success State */}
          {isSent ? (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-ink mb-2">Message Sent!</h2>
              <p className="text-muted mb-2">
                Your message has been sent to {recipients.length} recipient{recipients.length > 1 ? "s" : ""}.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">Redirecting to messages...</p>
            </div>
          ) : (
            /* Compose Form */
            <div className="bg-surface rounded-2xl border border-line shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out">
            {/* Recipients Section */}
            <div className="p-4 lg:p-6 border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  To <span className="text-red-500">*</span>
                </label>

                {/* Selected Recipients */}
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {recipients.map((parent) => (
                    <div
                      key={parent.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 border border-blue-200 dark:border-blue-700 midnight:border-cyan-500 purple:border-pink-500 rounded-full"
                    >
                      <div className="relative w-5 h-5 rounded-full overflow-hidden bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] flex-shrink-0">
                        {parent.profilePhoto ? (
                          <Image src={parent.profilePhoto} alt={parent.firstName} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-3 h-3 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
                        {parent.firstName} {parent.lastName}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRecipient(parent.id)}
                        className="p-0.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-500 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Add Recipient Input */}
                  <div className="relative flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={recipientSearch}
                        onChange={(e) => {
                          setRecipientSearch(e.target.value);
                          setShowRecipientDropdown(true);
                        }}
                        onFocus={() => setShowRecipientDropdown(true)}
                        placeholder="Search parents..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-canvas border border-line focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 text-sm outline-none"
                      />
                    </div>

                    {/* Recipient Dropdown */}
                    {showRecipientDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-line rounded-xl shadow-xl z-50 max-h-[300px] overflow-y-auto">
                        {/* Select All Option */}
                        <button
                          type="button"
                          onClick={handleSelectAll}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-ink">Select All Parents</p>
                            <p className="text-xs text-gray-500">{allParents.length} parents</p>
                          </div>
                        </button>

                        {/* Parent List */}
                        {filteredParents.slice(0, 10).map((parent) => {
                          const isSelected = recipients.find((r) => r.id === parent.id);
                          return (
                            <button
                              key={parent.id}
                              type="button"
                              onClick={() => handleSelectRecipient(parent)}
                              disabled={!!isSelected}
                              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 cursor-pointer ${
                                isSelected ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] flex-shrink-0">
                                {parent.profilePhoto ? (
                                  <Image src={parent.profilePhoto} alt={parent.firstName} fill className="object-cover" unoptimized />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-gray-500" />
                                  </div>
                                )}
                              </div>
                              <div className="text-left flex-1 min-w-0">
                                <p className="text-sm font-medium text-ink truncate">
                                  {parent.firstName} {parent.lastName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{parent.email}</p>
                              </div>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                            </button>
                          );
                        })}

                        {filteredParents.length === 0 && (
                          <div className="px-4 py-6 text-center text-sm text-gray-500">No parents found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {recipients.length > 0 && (
                  <p className="text-xs text-muted">
                    {recipients.length} recipient{recipients.length > 1 ? "s" : ""} selected
                  </p>
                )}
              </div>
            </div>

            {/* Subject & Category Row */}
            <div className="p-4 lg:p-6 border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Subject */}
              <div className="lg:col-span-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-2 block flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter message subject..."
                  className="w-full px-4 py-3 rounded-xl bg-canvas border border-line focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 text-sm outline-none"
                />
              </div>

              {/* Category & Priority */}
              <div className="flex gap-3">
                {/* Category */}
                <div className="flex-1 relative">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-2 block">Category</label>
                  <button
                    type="button"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-canvas border border-line hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30 text-sm cursor-pointer"
                  >
                    <span className="text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">{category}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {showCategoryDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-line rounded-xl shadow-xl z-50">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setCategory(cat);
                            setShowCategoryDropdown(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 cursor-pointer ${
                            category === cat ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-medium" : "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-2 block">Priority</label>
                  <button
                    type="button"
                    onClick={() => setPriority(priority === "normal" ? "high" : "normal")}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${
                      priority === "high"
                        ? "bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400"
                        : "bg-canvas border-line text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"
                    }`}
                  >
                    <AlertCircle className={`w-4 h-4 ${priority === "high" ? "text-red-500" : "text-gray-400"}`} />
                    {priority === "high" ? "High" : "Normal"}
                  </button>
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div className="p-4 lg:p-6">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-2 block">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={8}
                className="w-full px-4 py-3 rounded-xl bg-canvas border border-line focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 text-sm outline-none resize-y"
              />

              {/* Attachments Preview */}
              {attachments.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-muted mb-2">
                    Attachments ({attachments.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="group relative flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"
                      >
                        {file.type.startsWith("image/") ? (
                          <div className="w-8 h-8 rounded overflow-hidden bg-gray-200 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 flex-shrink-0">
                            <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded bg-gray-100 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 flex items-center justify-center flex-shrink-0">
                            {getFileIcon(file)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 truncate max-w-[120px]">
                            {file.name}
                          </p>
                          <p className="text-[0.625rem] text-gray-400">{formatFileSize(file.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 lg:p-6 border-t border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50/50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Left Actions */}
                <div className="flex items-center gap-2">
                  <EmojiPickerPopover onEmojiSelect={handleEmojiSelect} position="top" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/admin/parents/messages")}
                    className="px-5 py-2.5 rounded-xl font-medium text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!isFormValid || isSending}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-blue-500/25 transition-all"
                  >
                    {isSending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            </div>
          )}

          {/* Click outside to close dropdowns */}
          {(showRecipientDropdown || showCategoryDropdown) && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => {
                setShowRecipientDropdown(false);
                setShowCategoryDropdown(false);
              }}
            />
          )}
        </>
      }
    />
  );
}
