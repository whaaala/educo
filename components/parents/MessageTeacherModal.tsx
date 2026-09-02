"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Portal from "@/components/shared/Portal";
import EmojiPickerPopover from "@/components/shared/EmojiPickerPopover";
import {
  MessageSquare,
  Send,
  User,
  Paperclip,
  X,
  CheckCircle,
  Search,
  ChevronDown,
  Sparkles,
  GraduationCap,
  BookOpen,
  Clock,
  Calendar,
  HelpCircle,
  Users,
  File,
  ImageIcon,
  FileText,
} from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  photo?: string;
  isClassTeacher?: boolean;
}

interface Attachment {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

interface MessageTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  childName: string;
  childClass: string;
  teachers?: Teacher[];
  preselectedTeacher?: Teacher;
}

// Mock teachers data
const MOCK_TEACHERS: Teacher[] = [
  {
    id: "teacher-001",
    name: "Mrs. Adaobi Eze",
    subject: "Mathematics",
    email: "adaobi.eze@school.edu",
    photo: "https://i.pravatar.cc/150?u=teacher1",
  },
  {
    id: "teacher-002",
    name: "Mr. Chidi Okoro",
    subject: "English Language",
    email: "chidi.okoro@school.edu",
    photo: "https://i.pravatar.cc/150?u=teacher2",
  },
  {
    id: "teacher-003",
    name: "Mrs. Funke Adeyemi",
    subject: "Basic Science",
    email: "funke.adeyemi@school.edu",
    photo: "https://i.pravatar.cc/150?u=teacher3",
  },
  {
    id: "teacher-004",
    name: "Mr. Emeka Nwosu",
    subject: "Class Teacher",
    email: "emeka.nwosu@school.edu",
    photo: "https://i.pravatar.cc/150?u=teacher4",
    isClassTeacher: true,
  },
];

const MESSAGE_CATEGORIES = [
  { value: "academic", label: "Academic Performance", icon: GraduationCap, color: "blue" },
  { value: "homework", label: "Homework & Assignments", icon: BookOpen, color: "purple" },
  { value: "attendance", label: "Attendance", icon: Calendar, color: "amber" },
  { value: "behavior", label: "Behavior & Conduct", icon: Users, color: "emerald" },
  { value: "meeting", label: "Request Meeting", icon: Clock, color: "rose" },
  { value: "general", label: "General Inquiry", icon: HelpCircle, color: "gray" },
];

const categoryColors: Record<string, string> = {
  blue: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 border-blue-200 dark:border-blue-800",
  purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400 border-amber-200 dark:border-amber-800",
  emerald: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  rose: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  gray: "bg-gray-100 dark:bg-[#22262e]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20",
};

export default function MessageTeacherModal({
  isOpen,
  onClose,
  childName,
  childClass,
  teachers = MOCK_TEACHERS,
  preselectedTeacher,
}: MessageTeacherModalProps) {
  const [selectedTeacherId, setSelectedTeacherId] = useState(preselectedTeacher?.id || "");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showTeacherDropdown, setShowTeacherDropdown] = useState(false);
  const [teacherSearch, setTeacherSearch] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedTeacher = teachers.find((t) => t.id === selectedTeacherId);
  const selectedCategory = MESSAGE_CATEGORIES.find((c) => c.value === category);

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.subject.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
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
  }, [isOpen]);

  // Handle emoji insertion
  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = message.substring(0, start) + emoji + message.substring(end);
      setMessage(newMessage);
      // Set cursor position after emoji
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    } else {
      setMessage(message + emoji);
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = [];
    Array.from(files).forEach((file) => {
      // Limit file size to 10MB
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return;
      }

      const attachment: Attachment = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      };

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachments((prev) =>
            prev.map((att) =>
              att.id === attachment.id ? { ...att, preview: e.target?.result as string } : att
            )
          );
        };
        reader.readAsDataURL(file);
      }

      newAttachments.push(attachment);
    });

    setAttachments((prev) => [...prev, ...newAttachments]);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove attachment
  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon;
    if (type.includes("pdf")) return FileText;
    return File;
  };

  const handleSend = async () => {
    if (!selectedTeacherId || !subject || !message) return;

    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSending(false);
    setIsSent(true);

    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setSelectedTeacherId(preselectedTeacher?.id || "");
    setCategory("");
    setSubject("");
    setMessage("");
    setIsSending(false);
    setIsSent(false);
    setShowTeacherDropdown(false);
    setTeacherSearch("");
    setAttachments([]);
    onClose();
  };

  const isValid = selectedTeacherId && subject.trim() && message.trim();

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={handleClose}
      >
        <div
          className="bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {isSent ? (
            /* Success State */
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-2xl animate-pulse scale-150" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">
                Message Sent!
              </h3>
              <p className="text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 text-center max-w-sm">
                {selectedTeacher?.name} will receive your message and respond shortly.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span>Closing automatically...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Header - Subtle Modern Style */}
              <div className="relative bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 px-6 py-5 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                {/* Subtle decorative accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">New Message</h2>
                      <p className="text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 text-sm flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 text-xs font-medium">
                          <User className="w-3 h-3" />
                          {childName}
                        </span>
                        <span className="text-gray-300 dark:text-gray-600 midnight:text-cyan-500 purple:text-pink-500">•</span>
                        <span>{childClass}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] hover:bg-gray-200 dark:hover:bg-[#2a2d35] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:text-gray-700 dark:hover:text-white midnight:hover:text-cyan-50 purple:hover:text-pink-50 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Teacher Selection - Custom Styled */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                      <User className="w-3 h-3 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                    </span>
                    To
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTeacherDropdown(!showTeacherDropdown)}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                        selectedTeacher
                          ? "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20"
                          : "border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30 bg-gray-50/50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50"
                      }`}
                    >
                      {selectedTeacher ? (
                        <>
                          <div className="relative">
                            <Image
                              src={selectedTeacher.photo || `https://i.pravatar.cc/150?u=${selectedTeacher.id}`}
                              alt={selectedTeacher.name}
                              width={44}
                              height={44}
                              className="rounded-xl object-cover ring-2 ring-white dark:ring-gray-800"
                              unoptimized
                            />
                            {selectedTeacher.isClassTeacher && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                                <GraduationCap className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{selectedTeacher.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">{selectedTeacher.subject}</p>
                          </div>
                          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showTeacherDropdown ? "rotate-180" : ""}`} />
                        </>
                      ) : (
                        <>
                          <div className="w-11 h-11 rounded-xl bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                          <span className="flex-1 text-left text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">Select a teacher...</span>
                          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showTeacherDropdown ? "rotate-180" : ""}`} />
                        </>
                      )}
                    </button>

                    {/* Teacher Dropdown */}
                    {showTeacherDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 z-50 overflow-hidden">
                        {/* Search */}
                        <div className="p-3 border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={teacherSearch}
                              onChange={(e) => setTeacherSearch(e.target.value)}
                              placeholder="Search teachers..."
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm border-0 focus:ring-2 focus:ring-blue-500/30 outline-none"
                              autoFocus
                            />
                          </div>
                        </div>
                        {/* Teacher List */}
                        <div className="max-h-64 overflow-y-auto p-2">
                          {filteredTeachers.map((teacher) => (
                            <button
                              key={teacher.id}
                              onClick={() => {
                                setSelectedTeacherId(teacher.id);
                                setShowTeacherDropdown(false);
                                setTeacherSearch("");
                              }}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                                selectedTeacherId === teacher.id
                                  ? "bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30"
                                  : "hover:bg-gray-50 dark:hover:bg-[#22262e]/50"
                              }`}
                            >
                              <div className="relative">
                                <Image
                                  src={teacher.photo || `https://i.pravatar.cc/150?u=${teacher.id}`}
                                  alt={teacher.name}
                                  width={40}
                                  height={40}
                                  className="rounded-xl object-cover"
                                  unoptimized
                                />
                                {teacher.isClassTeacher && (
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#1a1d24] flex items-center justify-center">
                                    <GraduationCap className="w-2 h-2 text-white" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 text-left">
                                <p className="font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm">{teacher.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">{teacher.subject}</p>
                              </div>
                              {selectedTeacherId === teacher.id && (
                                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Selection - Pill Style */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <BookOpen className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    </span>
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {MESSAGE_CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = category === cat.value;
                      return (
                        <button
                          key={cat.value}
                          onClick={() => setCategory(isSelected ? "" : cat.value)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                            isSelected
                              ? categoryColors[cat.color]
                              : "bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-100 dark:hover:bg-[#22262e]"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" />
                    </span>
                    Subject
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What's this message about?"
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border-2 border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400 midnight:focus:border-cyan-400 purple:focus:border-pink-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <MessageSquare className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    </span>
                    Message
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      rows={5}
                      className="w-full px-4 py-3 pb-14 rounded-2xl bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border-2 border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400 midnight:focus:border-cyan-400 purple:focus:border-pink-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                    />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {/* Emoji Picker */}
                        <EmojiPickerPopover
                          onEmojiSelect={handleEmojiSelect}
                          position="top"
                        />

                        {/* Attachment Button */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-[#22262e] transition-colors cursor-pointer"
                        >
                          <Paperclip className="w-5 h-5" />
                        </button>

                        {/* Hidden File Input */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          multiple
                          accept="image/*,.pdf,.doc,.docx,.txt"
                          className="hidden"
                        />
                      </div>

                      {/* Character count */}
                      <span className="text-xs text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">
                        {message.length} characters
                      </span>
                    </div>
                  </div>

                  {/* Attachment Previews */}
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {attachments.map((attachment) => {
                        const FileIcon = getFileIcon(attachment.type);
                        return (
                          <div
                            key={attachment.id}
                            className="relative group flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
                          >
                            {attachment.preview ? (
                              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={attachment.preview}
                                  alt={attachment.name}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] flex items-center justify-center flex-shrink-0">
                                <FileIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 truncate max-w-[120px]">
                                {attachment.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                                {formatFileSize(attachment.size)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAttachment(attachment.id)}
                              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <p className="text-xs text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 flex items-center gap-1">
                    <Paperclip className="w-3 h-3" />
                    Attach images, PDFs, or documents (max 10MB each)
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 dark:border-[#1a1d24] bg-gray-50/50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50">
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={handleClose}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:text-gray-900 dark:hover:text-white midnight:hover:text-cyan-50 purple:hover:text-pink-50 hover:bg-gray-100 dark:hover:bg-[#22262e] transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!isValid || isSending}
                    className={`group relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer overflow-hidden ${
                      isValid && !isSending
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                        : "bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 cursor-not-allowed"
                    }`}
                  >
                    {isValid && !isSending && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    )}
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
            </>
          )}
        </div>
      </div>
    </Portal>
  );
}
