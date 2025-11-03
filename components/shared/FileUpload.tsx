"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon, File } from "lucide-react";

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  value: File | null;
  onChange: (file: File | null) => void;
  helpText?: string;
  preview?: boolean;
  compact?: boolean;
  circular?: boolean; // For avatar/profile photo previews
}

export default function FileUpload({
  label,
  accept = "image/jpeg,image/png,image/svg+xml",
  maxSize = 4,
  value,
  onChange,
  helpText = "Upload image size 4MB, Format JPG, PNG, SVG",
  preview = true,
  compact = false,
  circular = false,
}: FileUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setError(null);
    onChange(file);

    // Generate preview for images
    if (preview && file.type.startsWith("image/")) {
      setIsLoadingPreview(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setIsLoadingPreview(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFileChange(file || null);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileChange(file || null);
  };

  if (compact) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
            {label}
          </label>
        )}

        <div
          onClick={handleUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 cursor-pointer
            ${isDragging
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20"
              : value
              ? "border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900"
              : "border-dashed border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-gray-50 dark:bg-gray-800/30 midnight:bg-gray-900/30 purple:bg-gray-900/30 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
            }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
          />

          {/* Preview/Icon */}
          <div className={`relative w-12 h-12 ${circular ? 'rounded-full' : 'rounded-lg'} overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-600`}>
            {isLoadingPreview ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
              </div>
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover animate-in fade-in duration-300"
              />
            ) : (
              <ImageIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {value ? (
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
                    {value.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    {(value.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="flex-shrink-0 w-7 h-7 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Click or drag to upload</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-0.5">
                  {helpText}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 flex items-center gap-1">
            <span className="font-medium">⚠</span> {error}
          </p>
        )}
      </div>
    );
  }

  // Original full-featured design
  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
          {label}
        </label>
      )}

      <div
        onClick={handleUploadClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 transition-all duration-200 cursor-pointer
          ${isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20"
            : value
            ? "border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:border-blue-300 dark:hover:border-blue-600"
            : "border-dashed border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="p-4 flex items-center gap-4">
          {/* Preview/Icon */}
          <div className={`relative w-16 h-16 ${circular ? 'rounded-full' : 'rounded-xl'} overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 flex items-center justify-center shadow-sm ring-2 ring-gray-200 dark:ring-gray-600`}>
            {isLoadingPreview ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-7 h-7 border-2 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
              </div>
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover animate-in fade-in duration-300"
              />
            ) : (
              <ImageIcon className="w-7 h-7 text-gray-400 dark:text-gray-500" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {value ? (
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
                  {value.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-1">
                  {(value.size / 1024).toFixed(1)} KB • Click anywhere to change
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Click to upload or drag and drop</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-1">
                  {helpText}
                </p>
              </div>
            )}
          </div>

          {/* Remove Button */}
          {value && (
            <button
              type="button"
              onClick={handleRemove}
              className="flex-shrink-0 w-9 h-9 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 midnight:bg-red-900/30 midnight:hover:bg-red-900/50 purple:bg-red-900/30 purple:hover:bg-red-900/50 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow"
            >
              <X className="w-5 h-5 text-red-600 dark:text-red-400" />
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 flex items-center gap-1.5">
          <span className="font-bold">⚠</span> {error}
        </p>
      )}
    </div>
  );
}
