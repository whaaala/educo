"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  X,
  Share2,
  Calendar,
  MapPin,
  Copy,
  Mail,
  Check,
  FileText,
  Link2,
} from "lucide-react";

export interface ShareEventInfo {
  title: string;
  description: string;
  date: string;
  endDate?: string;
  time?: string;
  location?: string;
  image?: string;
}

interface ShareEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ShareEventInfo;
  eventUrl?: string;
}

function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// Custom SVG icons for social platforms
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const XTwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

export default function ShareEventModal({
  isOpen,
  onClose,
  event,
  eventUrl: providedUrl,
}: ShareEventModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedDetails, setCopiedDetails] = useState(false);
  const [sharedVia, setSharedVia] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Scroll modal into view when it opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      setTimeout(() => {
        modalRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCopiedLink(false);
      setCopiedDetails(false);
      setSharedVia(null);
    }
  }, [isOpen]);

  const eventUrl = providedUrl || (typeof window !== "undefined" ? window.location.href : "");

  const eventDetails = `${event.title}
Date: ${formatShortDate(event.date)}${event.endDate ? ` - ${formatShortDate(event.endDate)}` : ""}
${event.time ? `Time: ${event.time}` : ""}
${event.location ? `Location: ${event.location}` : ""}
${event.description}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      console.error("Failed to copy link");
    }
  };

  const handleCopyDetails = async () => {
    try {
      await navigator.clipboard.writeText(eventDetails);
      setCopiedDetails(true);
      setTimeout(() => setCopiedDetails(false), 2000);
    } catch {
      console.error("Failed to copy details");
    }
  };

  const handleShare = (platform: string, url: string) => {
    // Open share URL in a popup window
    const width = 600;
    const height = 400;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      url,
      `share_${platform}`,
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
    );

    // Show success state
    setSharedVia(platform);
    setTimeout(() => setSharedVia(null), 3000);
  };

  const shareOptions = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: WhatsAppIcon,
      gradient: "from-green-500 to-green-600",
      hoverGradient: "hover:from-green-600 hover:to-green-700",
      shadowColor: "shadow-green-500/30",
      url: `https://wa.me/?text=${encodeURIComponent(`${event.title}\n${eventUrl}`)}`,
    },
    {
      id: "telegram",
      label: "Telegram",
      icon: TelegramIcon,
      gradient: "from-sky-500 to-blue-500",
      hoverGradient: "hover:from-sky-600 hover:to-blue-600",
      shadowColor: "shadow-sky-500/30",
      url: `https://t.me/share/url?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(event.title)}`,
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: FacebookIcon,
      gradient: "from-blue-600 to-blue-700",
      hoverGradient: "hover:from-blue-700 hover:to-blue-800",
      shadowColor: "shadow-blue-600/30",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`,
    },
    {
      id: "twitter",
      label: "X",
      icon: XTwitterIcon,
      gradient: "from-gray-800 to-black",
      hoverGradient: "hover:from-gray-900 hover:to-black",
      shadowColor: "shadow-gray-800/30",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(event.title)}&url=${encodeURIComponent(eventUrl)}`,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: LinkedInIcon,
      gradient: "from-blue-700 to-blue-800",
      hoverGradient: "hover:from-blue-800 hover:to-blue-900",
      shadowColor: "shadow-blue-700/30",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`,
    },
    {
      id: "email",
      label: "Email",
      icon: () => <Mail className="w-5 h-5" />,
      gradient: "from-amber-500 to-orange-500",
      hoverGradient: "hover:from-amber-600 hover:to-orange-600",
      shadowColor: "shadow-amber-500/30",
      url: `mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(eventDetails + "\n\n" + eventUrl)}`,
    },
  ];

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/60 backdrop-blur-md pt-4 pb-4 px-4 sm:px-6 overflow-y-auto">
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-surface rounded-xl sm:rounded-2xl shadow-2xl max-h-[calc(100vh-32px)] flex flex-col animate-in fade-in zoom-in duration-200 my-auto"
      >
        {/* Header with Gradient */}
        <div className="flex-shrink-0 relative bg-gradient-to-r from-blue-500/90 via-indigo-500/90 to-purple-500/90 dark:from-blue-500/80 dark:via-indigo-500/80 dark:to-purple-500/80 px-4 sm:px-5 py-3 sm:py-4 rounded-t-xl sm:rounded-t-2xl overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-300/10 rounded-full blur-2xl animate-pulse delay-300" />
          </div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Share Event</h2>
                <p className="text-xs text-white/80 mt-0.5 line-clamp-1 max-w-[200px]">
                  {event.title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-5">
          <div className="space-y-5">
            {/* Event Preview Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 midnight:from-blue-950/30 midnight:to-indigo-900/30 purple:from-blue-950/30 purple:to-indigo-900/30 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50">
              <div className="flex items-start gap-3">
                {event.image && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-ink truncate">
                    {event.title}
                  </h4>
                  <div className="mt-1.5 space-y-1">
                    <p className="text-xs text-muted flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      {formatShortDate(event.date)}
                      {event.time && ` &bull; ${event.time}`}
                    </p>
                    {event.location && (
                      <p className="text-xs text-muted flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        {event.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Share Options */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                  Share via
                </p>
                {sharedVia && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 animate-in fade-in slide-in-from-right-2 duration-200">
                    <Check className="w-3.5 h-3.5" />
                    <span>Opening {sharedVia}...</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {shareOptions.map((option) => {
                  const Icon = option.icon;
                  const isShared = sharedVia === option.label;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleShare(option.label, option.url)}
                      title={option.label}
                      className={`group relative w-12 h-12 rounded-xl bg-gradient-to-br ${option.gradient} ${option.hoverGradient} transition-all duration-200 shadow-md ${option.shadowColor} hover:shadow-lg hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center`}
                    >
                      {isShared ? (
                        <Check className="w-5 h-5 text-white animate-in zoom-in duration-200" />
                      ) : (
                        <div className="text-white">
                          <Icon />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Copy Options */}
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                Or copy
              </p>
              <div className="space-y-2">
                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 group ${
                    copiedLink
                      ? "border-green-400 dark:border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
                      : "border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-blue-200 dark:hover:border-blue-700/50 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      copiedLink
                        ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-md"
                        : "bg-surface-2 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30"
                    }`}
                  >
                    {copiedLink ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Link2 className="w-4 h-4 text-muted group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <span
                      className={`text-sm font-semibold ${
                        copiedLink
                          ? "text-green-700 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                          : "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"
                      }`}
                    >
                      {copiedLink ? "Link copied!" : "Copy link"}
                    </span>
                    <p className="text-xs text-muted">
                      {copiedLink ? "Paste anywhere to share" : "Share the event URL"}
                    </p>
                  </div>
                  {!copiedLink && (
                    <Copy className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  )}
                </button>

                {/* Copy Details Button */}
                <button
                  onClick={handleCopyDetails}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 group ${
                    copiedDetails
                      ? "border-green-400 dark:border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
                      : "border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-blue-200 dark:hover:border-blue-700/50 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      copiedDetails
                        ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-md"
                        : "bg-surface-2 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30"
                    }`}
                  >
                    {copiedDetails ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <FileText className="w-4 h-4 text-muted group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <span
                      className={`text-sm font-semibold ${
                        copiedDetails
                          ? "text-green-700 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                          : "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"
                      }`}
                    >
                      {copiedDetails ? "Details copied!" : "Copy event details"}
                    </span>
                    <p className="text-xs text-muted">
                      {copiedDetails ? "Ready to paste" : "Copy title, date, time & location"}
                    </p>
                  </div>
                  {!copiedDetails && (
                    <Copy className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Done Button */}
        <div className="flex-shrink-0 px-4 sm:px-5 py-4 bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 border-t border-gray-200 dark:border-gray-700 midnight:border-gray-700/30 purple:border-gray-700/30 rounded-b-xl sm:rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium shadow-md hover:shadow-lg shadow-blue-500/25 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
