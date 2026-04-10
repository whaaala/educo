"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import DashboardPage from "@/components/shared/DashboardPage";
import EmojiPickerPopover from "@/components/shared/EmojiPickerPopover";
import {
  Send,
  Paperclip,
  XCircle,
  Search,
  User,
  Users,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  Circle,
  ArrowLeft,
  GraduationCap,
  Shield,
  UserCircle,
} from "lucide-react";

// Staff contact type
interface StaffContact {
  id: string;
  name: string;
  role: "Teacher" | "Admin" | "Principal";
  subject?: string;
  avatar?: string;
  email: string;
  isOnline: boolean;
}

// Mock staff contacts
const MOCK_STAFF: StaffContact[] = [
  {
    id: "teacher-001",
    name: "Mrs. Nkechi Eze",
    role: "Teacher",
    subject: "Mathematics",
    avatar: "https://i.pravatar.cc/150?u=nkechi",
    email: "nkechi.eze@school.com",
    isOnline: true,
  },
  {
    id: "teacher-002",
    name: "Mr. Oluwaseun Adeyemi",
    role: "Teacher",
    subject: "English Language",
    avatar: "https://i.pravatar.cc/150?u=oluwaseun",
    email: "oluwaseun.a@school.com",
    isOnline: false,
  },
  {
    id: "teacher-003",
    name: "Mrs. Chidinma Okoro",
    role: "Teacher",
    subject: "Science",
    avatar: "https://i.pravatar.cc/150?u=chidinma",
    email: "chidinma.o@school.com",
    isOnline: true,
  },
  {
    id: "admin-001",
    name: "Mrs. Adaeze Okonkwo",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?u=adaeze",
    email: "admin@school.com",
    isOnline: true,
  },
  {
    id: "admin-002",
    name: "Mr. Emeka Nwosu",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?u=emeka",
    email: "emeka.n@school.com",
    isOnline: false,
  },
  {
    id: "principal-001",
    name: "Dr. Chukwuma Obi",
    role: "Principal",
    avatar: "https://i.pravatar.cc/150?u=chukwuma",
    email: "principal@school.com",
    isOnline: true,
  },
];

export default function ParentComposeNewChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Detect if navigating from admin view
  const fromAdmin = searchParams.get("from") === "admin";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Form state
  const [selectedStaff, setSelectedStaff] = useState<StaffContact | null>(null);
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  // UI state
  const [isSending, setIsSending] = useState(false);
  const [staffSearch, setStaffSearch] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "Teacher" | "Admin" | "Principal">("all");

  // Filter staff based on search and role
  const filteredStaff = useMemo(() => {
    let filtered = MOCK_STAFF;

    if (filterRole !== "all") {
      filtered = filtered.filter((staff) => staff.role === filterRole);
    }

    if (staffSearch.trim()) {
      const search = staffSearch.toLowerCase();
      filtered = filtered.filter(
        (staff) =>
          staff.name.toLowerCase().includes(search) ||
          staff.email.toLowerCase().includes(search) ||
          staff.subject?.toLowerCase().includes(search) ||
          staff.role.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [staffSearch, filterRole]);

  // Focus message input when staff is selected
  useEffect(() => {
    if (selectedStaff && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [selectedStaff]);

  // Handle staff selection
  const handleSelectStaff = (staff: StaffContact) => {
    setSelectedStaff(staff);
    setStaffSearch("");
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
    if (!selectedStaff || (!message.trim() && attachments.length === 0)) return;

    setIsSending(true);
    // Simulate sending and redirect to chat view
    setTimeout(() => {
      const baseUrl = `/parents/chat?chatId=${selectedStaff.id}&staffName=${encodeURIComponent(selectedStaff.name)}`;
      router.push(fromAdmin ? `${baseUrl}&from=admin` : baseUrl);
    }, 800);
  };

  // Check if form is valid
  const isFormValid = selectedStaff && (message.trim() || attachments.length > 0);

  // Get role icon
  const getRoleIcon = (role: StaffContact["role"]) => {
    switch (role) {
      case "Teacher":
        return <GraduationCap className="w-4 h-4" />;
      case "Admin":
        return <Shield className="w-4 h-4" />;
      case "Principal":
        return <UserCircle className="w-4 h-4" />;
    }
  };

  // Get role color
  const getRoleColor = (role: StaffContact["role"]) => {
    switch (role) {
      case "Teacher":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400";
      case "Admin":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "Principal":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400";
    }
  };

  return (
    <DashboardPage
      title="New Chat"
      breadcrumbs={
        fromAdmin
          ? [
              { label: "Dashboard", href: "/" },
              { label: "Admin" },
              { label: "Parents", href: "/admin/parents" },
              { label: "Chat", href: "/parents/chat?from=admin" },
              { label: "New", isActive: true },
            ]
          : [
              { label: "Parent Portal", href: "/parents" },
              { label: "Chat", href: "/parents/chat" },
              { label: "New", isActive: true },
            ]
      }
      loadingText="Loading..."
      afterStats={
        <>
          <div className="flex justify-end mb-6">
            <button
              onClick={() => router.push(fromAdmin ? "/parents/chat?from=admin" : "/parents/chat")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:text-gray-900 dark:hover:text-white midnight:hover:text-cyan-50 purple:hover:text-pink-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Chats
            </button>
          </div>

          <div className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out h-[calc(100vh-250px)] min-h-[500px] flex flex-col">
          {!selectedStaff ? (
            /* Staff Selection View */
            <div className="flex-1 flex flex-col">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">Start a Conversation</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Select a teacher or staff member to start chatting</p>
              </div>

              {/* Search & Filters */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 space-y-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                    placeholder="Search by name, subject, or role..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 text-sm outline-none"
                  />
                </div>

                {/* Role Filter Pills */}
                <div className="flex flex-wrap gap-2">
                  {(["all", "Teacher", "Admin", "Principal"] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => setFilterRole(role)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                        filterRole === role
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                          : "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-200 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15"
                      }`}
                    >
                      {role === "all" ? "All Staff" : `${role}s`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Staff List */}
              <div className="flex-1 overflow-y-auto">
                {filteredStaff.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 midnight:text-cyan-500 purple:text-pink-500 mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">No staff members found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredStaff.map((staff) => (
                      <button
                        key={staff.id}
                        onClick={() => handleSelectStaff(staff)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10/50 transition-colors cursor-pointer text-left"
                      >
                        <div className="relative flex-shrink-0">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]">
                            {staff.avatar ? (
                              <Image src={staff.avatar} alt={staff.name} fill className="object-cover" unoptimized />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className="w-6 h-6 text-gray-500" />
                              </div>
                            )}
                          </div>
                          {staff.isOnline && (
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
                              {staff.name}
                            </p>
                            {staff.isOnline && (
                              <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400">
                                <Circle className="w-2 h-2 fill-current" />
                                Online
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(staff.role)}`}>
                              {getRoleIcon(staff.role)}
                              {staff.role}
                            </span>
                            {staff.subject && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">{staff.subject}</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 truncate mt-0.5">{staff.email}</p>
                        </div>
                        <MessageCircle className="w-5 h-5 text-gray-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Chat View */
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50/50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50">
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
                </button>
                <div className="relative flex-shrink-0">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]">
                    {selectedStaff.avatar ? (
                      <Image src={selectedStaff.avatar} alt={selectedStaff.name} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                  </div>
                  {selectedStaff.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
                      {selectedStaff.name}
                    </p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedStaff.role)}`}>
                      {selectedStaff.role}
                    </span>
                  </div>
                  <p className={`text-xs ${selectedStaff.isOnline ? "text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"}`}>
                    {selectedStaff.isOnline ? "Online" : "Offline"}
                    {selectedStaff.subject && ` • ${selectedStaff.subject}`}
                  </p>
                </div>
              </div>

              {/* Empty Chat Area */}
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50/30 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/30">
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center mb-4">
                  <MessageCircle className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">Start a Conversation</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 text-center max-w-sm">
                  Send your first message to {selectedStaff.name.split(" ")[0]}. They will be notified and respond as soon as possible.
                </p>
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]">
                {/* Attachments Preview */}
                {attachments.length > 0 && (
                  <div className="px-4 pt-3">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="relative flex-shrink-0 group">
                          {file.type.startsWith("image/") ? (
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30">
                              <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 flex flex-col items-center justify-center p-1">
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
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
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
                      className="w-full px-4 py-3 rounded-2xl bg-gray-100 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border-0 focus:ring-2 focus:ring-blue-500/50 resize-none text-sm text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 placeholder-gray-400 outline-none"
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
