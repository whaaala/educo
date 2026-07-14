"use client";

import { ReactNode, useRef, useEffect, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import Tooltip from "./Tooltip";
import { Paperclip, X, FileText, Image as ImageIcon, File, FileSpreadsheet, FileVideo, FileAudio } from "lucide-react";

export interface AttachmentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file?: File;
}

export interface FormTextareaProps {
  label: string;
  icon?: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  optional?: boolean;
  required?: boolean;
  error?: string;
  // Attachment props
  showAttachments?: boolean;
  attachments?: AttachmentFile[];
  onAttachmentsChange?: (attachments: AttachmentFile[]) => void;
  maxAttachments?: number;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string;
  // Character count props
  showCharacterCount?: boolean;
  maxLength?: number;
  characterCountPosition?: "top" | "bottom";
}

export default function FormTextarea({
  label,
  icon,
  iconBgColor = "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50",
  iconColor = "text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400",
  value,
  onChange,
  placeholder = "",
  rows = 4,
  optional = false,
  required = false,
  error,
  showAttachments = false,
  attachments = [],
  onAttachmentsChange,
  maxAttachments = 5,
  maxFileSize = 10, // 10MB default
  acceptedFileTypes = "image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt",
  showCharacterCount = false,
  maxLength,
  characterCountPosition = "top",
}: FormTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate minimum height based on rows (approximately 2.5rem per row including padding)
  const minHeight = rows * 40; // 40px per row (2.5rem base + padding)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to calculate scrollHeight correctly
      textarea.style.height = "auto";
      // Set height to scrollHeight or minimum height, whichever is larger
      const newHeight = Math.max(textarea.scrollHeight, minHeight);
      textarea.style.height = `${newHeight}px`;
    }
  }, [value, minHeight]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || !onAttachmentsChange) return;

    const newAttachments: AttachmentFile[] = [];
    const currentCount = attachments.length;

    Array.from(files).forEach((file) => {
      // Check max attachments
      if (currentCount + newAttachments.length >= maxAttachments) return;

      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        console.warn(`File ${file.name} exceeds ${maxFileSize}MB limit`);
        return;
      }

      newAttachments.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      });
    });

    if (newAttachments.length > 0) {
      onAttachmentsChange([...attachments, ...newAttachments]);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    if (onAttachmentsChange) {
      onAttachmentsChange(attachments.filter((a) => a.id !== id));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (showAttachments) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (showAttachments) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />;
    if (type.includes("pdf")) return <FileText className="w-4 h-4" />;
    if (type.includes("spreadsheet") || type.includes("excel") || type.includes("csv")) return <FileSpreadsheet className="w-4 h-4" />;
    if (type.startsWith("video/")) return <FileVideo className="w-4 h-4" />;
    if (type.startsWith("audio/")) return <FileAudio className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const isOverLimit = maxLength && value.length > maxLength;

  const characterCountDisplay = showCharacterCount && (
    <span className={`text-xs ${isOverLimit ? "text-red-500 font-semibold" : "text-gray-400"}`}>
      {value.length}{maxLength ? `/${maxLength}` : ""}
    </span>
  );

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <Tooltip content={label}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 flex items-center gap-1.5 cursor-help">
            <div className={`w-4 h-4 rounded ${iconBgColor} flex items-center justify-center flex-shrink-0 opacity-70`}>
              <div className={`w-2.5 h-2.5 ${iconColor}`}>{icon}</div>
            </div>
            <span>{label}</span>
            {required && <span className="text-red-500 dark:text-red-400 midnight:text-red-400 purple:text-red-400 ml-1">*</span>}
            {optional && !required && (
              <span className="text-xs text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">(Optional)</span>
            )}
          </label>
        </Tooltip>
        {showCharacterCount && characterCountPosition === "top" && characterCountDisplay}
      </div>
      <div
        className={`relative rounded-xl border transition-all duration-200 ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20"
            : error
            ? "border-red-500 dark:border-red-400"
            : isOverLimit
            ? "border-red-500 dark:border-red-400"
            : "border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:border-gray-400 dark:hover:border-gray-500 midnight:hover:border-cyan-500/40 purple:hover:border-pink-500/40"
        } bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          style={{ minHeight: `${minHeight}px` }}
          className="w-full px-4 py-2.5 bg-transparent text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 midnight:placeholder:text-cyan-400/50 purple:placeholder:text-pink-400/50 placeholder:font-normal focus:ring-0 outline-none resize-y overflow-hidden border-0"
        />

        {/* Attachments List */}
        {showAttachments && attachments.length > 0 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded-lg text-sm group/attachment"
              >
                <span className="text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                  {getFileIcon(attachment.type)}
                </span>
                <span className="text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 max-w-[150px] truncate">
                  {attachment.name}
                </span>
                <span className="text-xs text-gray-400">
                  ({formatFileSize(attachment.size)})
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(attachment.id)}
                  className="p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15 transition-colors opacity-60 group-hover/attachment:opacity-100 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Toolbar */}
        {showAttachments && (
          <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={acceptedFileTypes}
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
              <Tooltip content={`Attach files (max ${maxAttachments}, ${maxFileSize}MB each)`}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={attachments.length >= maxAttachments}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    attachments.length >= maxAttachments
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                  }`}
                >
                  <Paperclip className="w-4 h-4 text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
                </button>
              </Tooltip>
              {attachments.length > 0 && (
                <span className="text-xs text-gray-400">
                  {attachments.length}/{maxAttachments} files
                </span>
              )}
            </div>
            {showCharacterCount && characterCountPosition === "bottom" && characterCountDisplay}
          </div>
        )}
      </div>

      {/* Drag hint */}
      {showAttachments && isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-50/90 dark:bg-blue-900/50 rounded-xl border-2 border-dashed border-blue-500 pointer-events-none">
          <div className="text-center">
            <Paperclip className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">Drop files here</p>
          </div>
        </div>
      )}

      <ErrorMessage message={error} />
    </div>
  );
}
