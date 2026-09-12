"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Clock } from "lucide-react";

export interface ModernTimePickerProps {
  value: string;
  onChange: (time: string) => void;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
  format?: "12h" | "24h";
}

export default function ModernTimePicker({
  value,
  onChange,
  onClose,
  triggerRef,
  format = "12h"
}: ModernTimePickerProps) {
  const [selectedHour, setSelectedHour] = useState<number>(12);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("AM");
  const [isMounted, setIsMounted] = useState(false);
  const [pickerStyle, setPickerStyle] = useState<React.CSSProperties>({});
  const pickerRef = useRef<HTMLDivElement>(null);
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const timeRegex12 = /(\d{1,2}):(\d{2})\s*(AM|PM)/i;
      const timeRegex24 = /(\d{1,2}):(\d{2})/;

      const match12 = value.match(timeRegex12);
      const match24 = value.match(timeRegex24);

      if (match12) {
        setSelectedHour(parseInt(match12[1]));
        setSelectedMinute(parseInt(match12[2]));
        setSelectedPeriod(match12[3].toUpperCase() as "AM" | "PM");
      } else if (match24 && format === "24h") {
        const hour = parseInt(match24[1]);
        setSelectedHour(hour);
        setSelectedMinute(parseInt(match24[2]));
      }
    }
  }, [value, format]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate picker position
  const updatePickerPosition = useCallback(() => {
    if (!triggerRef?.current || typeof window === 'undefined') return;

    const rect = triggerRef.current.getBoundingClientRect();
    const pickerWidth = 280;
    const pickerHeight = pickerRef.current?.offsetHeight || 380;
    const marginFromEdge = 16;

    const style: React.CSSProperties = {
      position: 'fixed',
      zIndex: 10001,
    };

    // Calculate available space
    const spaceAbove = rect.top - marginFromEdge;
    const spaceBelow = window.innerHeight - rect.bottom - marginFromEdge;

    // Prefer showing above when there's enough space, or when below doesn't have enough space
    if (spaceAbove >= pickerHeight || spaceAbove > spaceBelow) {
      // Position above - anchor to bottom of picker
      const topPosition = rect.top - pickerHeight - 8;
      if (topPosition >= marginFromEdge) {
        style.top = `${topPosition}px`;
      } else {
        // Not enough space above, clamp to top edge
        style.top = `${marginFromEdge}px`;
      }
    } else {
      // Position below
      style.top = `${rect.bottom + 8}px`;
    }

    // Determine horizontal position - center on modal/viewport
    const viewportCenter = window.innerWidth / 2;
    const idealLeft = viewportCenter - pickerWidth / 2;

    // Ensure it stays within viewport bounds
    if (idealLeft >= marginFromEdge && idealLeft + pickerWidth <= window.innerWidth - marginFromEdge) {
      style.left = `${idealLeft}px`;
    } else if (idealLeft < marginFromEdge) {
      style.left = `${marginFromEdge}px`;
    } else {
      style.right = `${marginFromEdge}px`;
    }

    setPickerStyle(style);
  }, [triggerRef]);

  useEffect(() => {
    updatePickerPosition();
    window.addEventListener('scroll', updatePickerPosition, true);
    window.addEventListener('resize', updatePickerPosition);

    return () => {
      window.removeEventListener('scroll', updatePickerPosition, true);
      window.removeEventListener('resize', updatePickerPosition);
    };
  }, [updatePickerPosition]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        triggerRef?.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, triggerRef]);

  const formatTime = () => {
    if (format === "24h") {
      return `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    }
    return `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')} ${selectedPeriod}`;
  };

  const handleConfirm = () => {
    onChange(formatTime());
    onClose();
  };

  const hours = format === "24h"
    ? Array.from({ length: 24 }, (_, i) => i)
    : Array.from({ length: 12 }, (_, i) => i + 1);

  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Scroll to selected time on mount
  useEffect(() => {
    if (hourScrollRef.current) {
      const selectedElement = hourScrollRef.current.querySelector(`[data-hour="${selectedHour}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'center' });
      }
    }
    if (minuteScrollRef.current) {
      const selectedElement = minuteScrollRef.current.querySelector(`[data-minute="${selectedMinute}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'center' });
      }
    }
  }, [selectedHour, selectedMinute]);

  if (!isMounted) return null;

  const pickerContent = (
    <div
      ref={pickerRef}
      style={pickerStyle}
      className="bg-surface rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 w-[280px] animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-line bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 midnight:from-cyan-500/5 midnight:to-blue-500/5 purple:from-pink-500/5 purple:to-purple-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-ink">
              Select Time
            </h3>
          </div>
        </div>
      </div>

      {/* Time Display */}
      <div className="px-4 py-4 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-800/50 midnight:from-gray-800/50 purple:from-gray-800/50">
        <div className="flex items-center justify-center gap-2 text-3xl font-bold text-ink">
          <span className="font-mono">{selectedHour.toString().padStart(2, '0')}</span>
          <span className="text-gray-400">:</span>
          <span className="font-mono">{selectedMinute.toString().padStart(2, '0')}</span>
          {format === "12h" && (
            <span className="text-lg font-semibold ml-2">{selectedPeriod}</span>
          )}
        </div>
      </div>

      {/* Time Selectors */}
      <div className="px-4 pb-4">
        <div className="flex gap-3">
          {/* Hours */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Hour
            </label>
            <div
              ref={hourScrollRef}
              className="h-40 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
            >
              {hours.map((hour) => (
                <button
                  key={hour}
                  type="button"
                  data-hour={hour}
                  onClick={() => setSelectedHour(hour)}
                  className={`w-full px-3 py-2 text-sm text-center transition-colors cursor-pointer ${
                    selectedHour === hour
                      ? "bg-blue-500 dark:bg-blue-600 midnight:bg-cyan-600 purple:bg-pink-600 text-white font-semibold"
                      : "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                  }`}
                >
                  {hour.toString().padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>

          {/* Minutes */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Minute
            </label>
            <div
              ref={minuteScrollRef}
              className="h-40 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
            >
              {minutes.map((minute) => (
                <button
                  key={minute}
                  type="button"
                  data-minute={minute}
                  onClick={() => setSelectedMinute(minute)}
                  className={`w-full px-3 py-2 text-sm text-center transition-colors cursor-pointer ${
                    selectedMinute === minute
                      ? "bg-blue-500 dark:bg-blue-600 midnight:bg-cyan-600 purple:bg-pink-600 text-white font-semibold"
                      : "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                  }`}
                >
                  {minute.toString().padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>

          {/* AM/PM */}
          {format === "12h" && (
            <div className="w-16">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Period
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setSelectedPeriod("AM")}
                  className={`w-full px-2 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                    selectedPeriod === "AM"
                      ? "bg-blue-500 dark:bg-blue-600 midnight:bg-cyan-600 purple:bg-pink-600 text-white font-semibold"
                      : "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30"
                  }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPeriod("PM")}
                  className={`w-full px-2 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                    selectedPeriod === "PM"
                      ? "bg-blue-500 dark:bg-blue-600 midnight:bg-cyan-600 purple:bg-pink-600 text-white font-semibold"
                      : "text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30"
                  }`}
                >
                  PM
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-line bg-gray-50/50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50">
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 midnight:from-cyan-600 midnight:to-blue-600 purple:from-pink-600 purple:to-purple-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(pickerContent, document.body);
}
