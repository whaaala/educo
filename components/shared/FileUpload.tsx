"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  value: File | null;
  onChange: (file: File | null) => void;
  helpText?: string;
  preview?: boolean;
}

export default function FileUpload({
  label,
  accept = "image/jpeg,image/png,image/svg+xml",
  maxSize = 4,
  value,
  onChange,
  helpText = "Upload image size 4MB, Format JPG, PNG, SVG",
  preview = true,
}: FileUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
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

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
          {label}
        </label>
      )}

      <div className="flex items-center gap-3">
        {/* Preview/Icon */}
        <div className="relative w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 flex items-center justify-center bg-gray-50 dark:bg-gray-800/30 midnight:bg-gray-900/30 purple:bg-gray-900/30 overflow-hidden flex-shrink-0">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          )}
        </div>

        {/* Upload/Remove Buttons */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleUploadClick}
            className="px-4 py-2 rounded-lg font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 transition-all duration-200 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>

          {value && (
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 rounded-lg font-medium text-sm text-white bg-red-600 hover:bg-red-700 transition-all duration-200 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Help Text */}
      {helpText && (
        <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
          {helpText}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
