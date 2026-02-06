"use client";

import React, { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyableFieldProps {
  value: string;
  label?: string;
  showExternalLink?: boolean;
  externalLinkUrl?: string;
  truncate?: boolean;
  variant?: "default" | "compact" | "prominent";
  className?: string;
}

export function CopyableField({
  value,
  label,
  showExternalLink = false,
  externalLinkUrl,
  truncate = true,
  variant = "default",
  className = "",
}: CopyableFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const variantStyles = {
    default: cn(
      "bg-gray-50 dark:bg-gray-700/30 midnight:bg-gray-800/50 purple:bg-gray-800/50",
      "p-4 rounded-xl"
    ),
    compact: cn(
      "bg-gray-50 dark:bg-gray-700/30 midnight:bg-gray-800/50 purple:bg-gray-800/50",
      "p-3 rounded-lg"
    ),
    prominent: cn(
      "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/40 dark:to-gray-700/20",
      "midnight:from-gray-800/60 midnight:to-gray-800/30 purple:from-gray-800/60 purple:to-gray-800/30",
      "p-5 rounded-2xl border",
      "border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20"
    ),
  };

  const linkUrl = externalLinkUrl || (value.startsWith("http") ? value : undefined);

  return (
    <div className={cn(variantStyles[variant], className)}>
      {label && (
        <p className={cn(
          "text-xs font-medium uppercase tracking-wider mb-2",
          "text-gray-500 dark:text-gray-400 midnight:text-gray-500 purple:text-gray-500"
        )}>
          {label}
        </p>
      )}
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "font-medium",
              "text-gray-900 dark:text-white midnight:text-white purple:text-white",
              truncate ? "truncate" : "break-all"
            )}
          >
            {value}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {showExternalLink && linkUrl && (
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                "text-gray-500 hover:text-primary-600",
                "midnight:text-gray-400 midnight:hover:text-cyan-400",
                "purple:text-gray-400 purple:hover:text-pink-400",
                "hover:bg-white dark:hover:bg-gray-600 midnight:hover:bg-gray-800 purple:hover:bg-gray-800"
              )}
              title="Open link"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={handleCopy}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              copied
                ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                : cn(
                    "text-gray-500 hover:text-primary-600",
                    "midnight:text-gray-400 midnight:hover:text-cyan-400",
                    "purple:text-gray-400 purple:hover:text-pink-400",
                    "hover:bg-white dark:hover:bg-gray-600 midnight:hover:bg-gray-800 purple:hover:bg-gray-800"
                  )
            )}
            title={copied ? "Copied!" : "Copy to clipboard"}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
