"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";

// ── Avatar color from name ──
function getAvatarColor(name: string): string {
  const colors = [
    "bg-violet-500", "bg-blue-500", "bg-green-500", "bg-amber-500",
    "bg-red-500", "bg-pink-500", "bg-cyan-500", "bg-indigo-500",
    "bg-emerald-500", "bg-orange-500", "bg-teal-500", "bg-rose-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export interface AvatarHoverProps {
  /** Image URL */
  src?: string;
  /** Person's name — used for initial fallback and tooltip */
  name: string;
  /** Size class for the small avatar (default "w-7 h-7") */
  size?: string;
  /** Size class for the initial text (default "text-[0.625rem]") */
  initialSize?: string;
}

export default function AvatarHover({
  src,
  name,
  size = "w-7 h-7",
  initialSize = "text-[0.625rem]",
}: AvatarHoverProps) {
  const [hovered, setHovered] = useState(false);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPopupPos({
        top: rect.top + rect.height / 2,
        left: rect.left + rect.width / 2,
      });
    }
    setHovered(true);
  };

  const initial = name[0]?.toUpperCase() || "?";
  const color = getAvatarColor(name);

  return (
    <div
      ref={triggerRef}
      className="flex-shrink-0 cursor-pointer"
      onMouseEnter={handleEnter}
      onMouseLeave={() => setHovered(false)}
      onClick={e => e.stopPropagation()}
    >
      {/* Small avatar */}
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${size} rounded-full object-cover ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-sm`}
        />
      ) : (
        <div className={`${size} rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center ${initialSize} font-bold text-white ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-sm`}>
          {initial}
        </div>
      )}

      {/* Enlarged popup via portal */}
      {hovered && typeof document !== "undefined" && createPortal(
        <div
          className="fixed z-[99999] pointer-events-none animate-in zoom-in-50 fade-in duration-200"
          style={{
            top: `${popupPos.top}px`,
            left: `${popupPos.left}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Glow */}
          <div className="absolute inset-[-6px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 midnight:from-cyan-400 midnight:via-purple-400 midnight:to-cyan-400 purple:from-pink-400 purple:via-purple-400 purple:to-pink-400 rounded-full opacity-40 blur-lg" />
          {/* Large avatar */}
          {src ? (
            <img
              src={src}
              alt={name}
              className="relative w-20 h-20 rounded-full object-cover ring-3 ring-white dark:ring-gray-800 shadow-2xl"
            />
          ) : (
            <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white ring-3 ring-white dark:ring-gray-800 shadow-2xl`}>
              {initial}
            </div>
          )}
          {/* Name label */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 dark:bg-[#1a1d24] text-white text-[0.6875rem] font-semibold rounded-lg shadow-lg whitespace-nowrap border border-gray-700 dark:border-gray-700">
            {name}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
