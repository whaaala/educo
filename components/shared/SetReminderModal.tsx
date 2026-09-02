"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Bell,
  BellRing,
  Calendar,
  CalendarDays,
  Clock,
  Check,
  AlarmClock,
} from "lucide-react";
import FormInput from "./FormInput";

export interface ReminderEventInfo {
  title: string;
  date: string;
  time?: string;
  location?: string;
}

interface SetReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ReminderEventInfo;
  onSetReminder?: (reminderType: string, customDate?: string, customTime?: string) => void;
}

function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function SetReminderModal({
  isOpen,
  onClose,
  event,
  onSetReminder,
}: SetReminderModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<string>("1day");
  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("09:00");
  const [isSuccess, setIsSuccess] = useState(false);
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
      setSelectedReminder("1day");
      setCustomDate("");
      setCustomTime("09:00");
      setIsSuccess(false);
    }
  }, [isOpen]);

  const reminderOptions = [
    { id: "30min", label: "30 minutes before", description: "Get notified shortly before", icon: AlarmClock },
    { id: "1hour", label: "1 hour before", description: "Time to prepare", icon: AlarmClock },
    { id: "1day", label: "1 day before", description: "Recommended", icon: Calendar, recommended: true },
    { id: "3days", label: "3 days before", description: "Plan ahead", icon: Calendar },
    { id: "1week", label: "1 week before", description: "Early reminder", icon: CalendarDays },
    { id: "custom", label: "Custom date & time", description: "Choose your own time", icon: Clock },
  ];

  const handleSetReminder = () => {
    if (onSetReminder) {
      onSetReminder(selectedReminder, customDate, customTime);
    }
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/60 backdrop-blur-md pt-4 pb-4 px-4 sm:px-6 overflow-y-auto">
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-surface rounded-xl sm:rounded-2xl shadow-2xl max-h-[calc(100vh-32px)] flex flex-col animate-in fade-in zoom-in duration-200 my-auto overflow-visible"
      >
        {/* Header with Gradient */}
        <div className="flex-shrink-0 relative bg-gradient-to-r from-amber-500/90 via-orange-500/90 to-amber-600/90 dark:from-amber-500/80 dark:via-orange-500/80 dark:to-amber-600/80 px-4 sm:px-5 py-3 sm:py-4 rounded-t-xl sm:rounded-t-2xl overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-yellow-300/10 rounded-full blur-2xl animate-pulse delay-300" />
          </div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <BellRing className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Set Reminder</h2>
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
        <div className="flex-1 overflow-y-auto overflow-x-visible px-4 sm:px-5 py-5">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-xl opacity-40 animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-xl">
                  <Check className="w-10 h-10 text-white animate-in zoom-in duration-300" />
                </div>
              </div>
              <h4 className="text-xl font-bold text-ink mt-5 mb-1">
                Reminder Set!
              </h4>
              <p className="text-sm text-muted text-center max-w-xs">
                You&apos;ll receive a notification to remind you about this event
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Event Info Card */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 midnight:from-amber-950/30 midnight:to-orange-900/30 purple:from-amber-950/30 purple:to-orange-900/30 rounded-xl p-4 border border-amber-200/50 dark:border-amber-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface shadow-sm flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-amber-700/70 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400/70 uppercase tracking-wider">
                      Event Date
                    </p>
                    <p className="text-sm font-bold text-ink">
                      {formatShortDate(event.date)}
                      {event.time && (
                        <span className="font-medium text-muted">
                          {" "}
                          &bull; {event.time}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reminder Options */}
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                  Remind me
                </p>
                <div className="space-y-2">
                  {reminderOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedReminder === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setSelectedReminder(option.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 group ${
                          isSelected
                            ? "border-amber-400 dark:border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 shadow-sm"
                            : "border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-amber-200 dark:hover:border-amber-700/50 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-gradient-to-br from-amber-500 to-orange-600 shadow-md"
                              : "bg-surface-2 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30"
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 transition-colors ${
                              isSelected
                                ? "text-white"
                                : "text-muted group-hover:text-amber-600 dark:group-hover:text-amber-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-semibold transition-colors ${
                                isSelected
                                  ? "text-amber-700 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400"
                                  : "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"
                              }`}
                            >
                              {option.label}
                            </span>
                            {option.recommended && (
                              <span className="px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wider bg-amber-500 text-white rounded">
                                Recommended
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted">
                            {option.description}
                          </span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "border-amber-500 bg-amber-500"
                              : "border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Date/Time Fields */}
              {selectedReminder === "custom" && (
                <div className="bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/30 rounded-xl p-4 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                    Custom Reminder Time
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <FormInput
                      label="Date"
                      icon={<Calendar className="w-full h-full" />}
                      iconBgColor="bg-amber-100 dark:bg-amber-900/30"
                      iconColor="text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400"
                      type="date"
                      value={customDate}
                      onChange={setCustomDate}
                      placeholder="Select date"
                    />
                    <FormInput
                      label="Time"
                      icon={<Clock className="w-full h-full" />}
                      iconBgColor="bg-amber-100 dark:bg-amber-900/30"
                      iconColor="text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400"
                      type="time"
                      value={customTime}
                      onChange={setCustomTime}
                      placeholder="Select time"
                      timeFormat="12h"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - Action Buttons */}
        {!isSuccess && (
          <div className="flex-shrink-0 px-4 sm:px-5 py-4 bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 border-t border-gray-200 dark:border-gray-700 midnight:border-gray-700/30 purple:border-gray-700/30 rounded-b-xl sm:rounded-b-2xl">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] hover:bg-gray-50 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15 text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 font-medium transition-all duration-200 active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSetReminder}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium shadow-md hover:shadow-lg shadow-amber-500/25 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                Set Reminder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
