"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Modal from "./Modal";
import FormButton from "./FormButton";
import ModernCalendar from "./ModernCalendar";
import ModernTimePicker from "./ModernTimePicker";
import {
  Calendar,
  Clock,
  RefreshCw,
  Bell,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Hash,
  Settings,
  ChevronDown,
  ChevronUp,
  Edit3,
  Copy,
  Repeat,
  CalendarDays,
  Timer,
  FileText,
  Sparkles,
} from "lucide-react";

export interface ScheduledReminder {
  id: string;
  date: string;
  time: string;
  message?: string;
  useCustomMessage?: boolean;
}

export interface AutoReminderSchedule {
  id: string;
  feeRecordId: string;
  parentId: string;
  childId: string;
  channels: string[];
  reminders: ScheduledReminder[];
  globalMessage?: string;
  intervalDays?: number;
  defaultTime?: string;
  scheduleMode?: "manual" | "interval";
  isActive: boolean;
  createdAt: string;
}

export interface AutoReminderScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  parentId: string;
  childName: string;
  childId: string;
  feeRecordId: string;
  feeType: string;
  balance: number;
  dueDate: string;
  money: (amount: number) => string;
  existingSchedule?: AutoReminderSchedule | null;
  onSave?: (schedule: Omit<AutoReminderSchedule, "id" | "createdAt">) => void;
  onDelete?: (scheduleId: string) => void;
  // Customization props
  title?: string;
  subtitle?: string;
  saveButtonText?: string;
  deleteButtonText?: string;
}

export default function AutoReminderScheduleModal({
  isOpen,
  onClose,
  parentName,
  parentEmail,
  parentPhone,
  parentId,
  childName,
  childId,
  feeRecordId,
  feeType,
  balance,
  dueDate,
  money,
  existingSchedule,
  onSave,
  onDelete,
  // Customization props with defaults
  title = "Auto-Schedule Reminders",
  subtitle,
  saveButtonText = "Save Schedule",
  deleteButtonText = "Delete Schedule",
}: AutoReminderScheduleModalProps) {
  // Mode: "manual" for picking individual dates, "interval" for auto-generate
  const [scheduleMode, setScheduleMode] = useState<"manual" | "interval">(
    existingSchedule?.scheduleMode || "interval"
  );

  // Channels
  const [channels, setChannels] = useState<string[]>(
    existingSchedule?.channels || ["email"]
  );

  // Global settings
  const [reminderCount, setReminderCount] = useState(
    existingSchedule?.reminders?.length || 3
  );
  const [intervalDays, setIntervalDays] = useState(
    existingSchedule?.intervalDays || 3
  );
  const [defaultTime, setDefaultTime] = useState(
    existingSchedule?.defaultTime || "09:00 AM"
  );
  const [globalMessage, setGlobalMessage] = useState(
    existingSchedule?.globalMessage ||
      `Dear ${parentName},\n\nThis is a friendly reminder about the outstanding ${feeType} payment of ${money(balance)} for ${childName}.\n\nPlease make the payment at your earliest convenience.\n\nThank you.`
  );

  // Individual reminders
  const [reminders, setReminders] = useState<ScheduledReminder[]>(
    existingSchedule?.reminders || []
  );

  // Expanded reminders for customization
  const [expandedReminders, setExpandedReminders] = useState<Set<string>>(
    new Set()
  );

  // UI states
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeDatePicker, setActiveDatePicker] = useState<string | null>(null);
  const [activeTimePicker, setActiveTimePicker] = useState<string | null>(null);
  const [activeDefaultTimePicker, setActiveDefaultTimePicker] = useState(false);
  const [activeStartDatePicker, setActiveStartDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });

  const dateRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const timeRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const defaultTimeRef = useRef<HTMLButtonElement>(null);
  const startDateRef = useRef<HTMLButtonElement>(null);

  const channelOptions = [
    {
      id: "email",
      label: "Email",
      icon: <Mail className="w-4 h-4" />,
      description: parentEmail,
      color: "blue",
    },
    {
      id: "sms",
      label: "SMS",
      icon: <Phone className="w-4 h-4" />,
      description: parentPhone,
      color: "green",
    },
    {
      id: "push",
      label: "Push",
      icon: <Bell className="w-4 h-4" />,
      description: "Mobile App",
      color: "purple",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: <MessageSquare className="w-4 h-4" />,
      description: parentPhone,
      color: "emerald",
    },
  ];

  // Generate reminders based on interval settings
  useEffect(() => {
    if (scheduleMode === "interval" && reminderCount > 0) {
      const generatedReminders: ScheduledReminder[] = [];
      const start = new Date(startDate);

      for (let i = 0; i < reminderCount; i++) {
        const reminderDate = new Date(start);
        reminderDate.setDate(start.getDate() + i * intervalDays);

        // Preserve custom settings if reminder already exists
        const existingReminder = reminders.find((r) => r.id === `reminder-${i + 1}`);

        generatedReminders.push({
          id: `reminder-${i + 1}`,
          date: reminderDate.toISOString().split("T")[0],
          time: existingReminder?.time || defaultTime,
          message: existingReminder?.message,
          useCustomMessage: existingReminder?.useCustomMessage || false,
        });
      }

      setReminders(generatedReminders);
    }
  }, [scheduleMode, reminderCount, intervalDays, startDate, defaultTime]);

  const toggleChannel = (channelId: string) => {
    setChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((c) => c !== channelId)
        : [...prev, channelId]
    );
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const toggleReminderExpanded = (id: string) => {
    setExpandedReminders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const addManualReminder = () => {
    const newId = `manual-${Date.now()}`;
    setReminders([
      ...reminders,
      { id: newId, date: "", time: defaultTime, useCustomMessage: false },
    ]);
  };

  const removeReminder = (id: string) => {
    if (scheduleMode === "manual" && reminders.length > 1) {
      setReminders(reminders.filter((r) => r.id !== id));
    }
  };

  const updateReminder = (
    id: string,
    field: keyof ScheduledReminder,
    value: string | boolean
  ) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const copyGlobalMessageToReminder = (id: string) => {
    setReminders(
      reminders.map((r) =>
        r.id === id ? { ...r, message: globalMessage, useCustomMessage: true } : r
      )
    );
  };

  const handleSave = async () => {
    if (channels.length === 0 || reminders.length === 0) return;
    if (
      scheduleMode === "manual" &&
      reminders.some((r) => !r.date || !r.time)
    )
      return;

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const schedule: Omit<AutoReminderSchedule, "id" | "createdAt"> = {
      feeRecordId,
      parentId,
      childId,
      channels,
      reminders,
      globalMessage,
      intervalDays,
      defaultTime,
      scheduleMode,
      isActive: true,
    };

    onSave?.(schedule);
    setIsSaving(false);
    setIsSaved(true);

    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 2000);
  };

  const handleDelete = () => {
    if (existingSchedule?.id) {
      onDelete?.(existingSchedule.id);
      onClose();
    }
  };

  const handleClose = () => {
    setIsSaved(false);
    setIsSaving(false);
    setActiveDatePicker(null);
    setActiveTimePicker(null);
    setActiveDefaultTimePicker(false);
    setActiveStartDatePicker(false);
    onClose();
  };

  const isOverdue = new Date(dueDate) < new Date();
  const isValid =
    channels.length > 0 &&
    reminders.length > 0 &&
    (scheduleMode === "interval" ||
      reminders.every((r) => r.date && r.time));

  // Sort reminders by date/time for preview
  const sortedReminders = [...reminders]
    .filter((r) => r.date && r.time)
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

  const footerContent = !isSaved ? (
    <div className="flex items-center justify-between">
      <div>
        {existingSchedule && (
          <FormButton type="button" onClick={handleDelete} variant="secondary">
            <Trash2 className="w-4 h-4 mr-1" />
            {deleteButtonText}
          </FormButton>
        )}
      </div>
      <div className="flex items-center gap-3">
        <FormButton type="button" onClick={handleClose} variant="secondary">
          Cancel
        </FormButton>
        <FormButton
          type="button"
          onClick={handleSave}
          variant="primary"
          disabled={!isValid || isSaving}
          icon={isSaving ? undefined : <CheckCircle2 className="w-4 h-4" />}
        >
          {isSaving
            ? "Saving..."
            : existingSchedule
            ? `Update ${saveButtonText.replace("Save ", "")}`
            : saveButtonText}
        </FormButton>
      </div>
    </div>
  ) : undefined;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        isSaved
          ? "Schedule Saved!"
          : existingSchedule
          ? `Edit ${title}`
          : title
      }
      subtitle={
        isSaved
          ? "Automatic reminders have been scheduled"
          : subtitle || `Configure automated reminder schedule for ${feeType}`
      }
      icon={
        isSaved ? (
          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />
        )
      }
      maxWidth="2xl"
      footer={footerContent}
    >
      {isSaved ? (
        <div className="py-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-ink mb-2">
            Reminders Scheduled!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
            {reminders.length} reminder{reminders.length > 1 ? "s" : ""} will be
            sent automatically
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Parent & Student Info - Compact */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 border border-line">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] ring-2 ring-white dark:ring-gray-800">
                <Image
                  src={`https://i.pravatar.cc/150?u=${parentId}`}
                  alt={parentName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div>
                <p className="font-semibold text-ink text-sm">
                  {parentName}
                </p>
                <p className="text-xs text-muted">
                  Parent of {childName}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">
                {money(balance)}
              </p>
              {isOverdue ? (
                <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">
                  <AlertCircle className="w-3 h-3" />
                  Overdue
                </span>
              ) : (
                <span className="text-xs text-muted">
                  Due:{" "}
                  {new Date(dueDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              )}
            </div>
          </div>

          {/* Schedule Mode Toggle */}
          <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl">
            <button
              type="button"
              onClick={() => setScheduleMode("interval")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                scheduleMode === "interval"
                  ? "bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-purple-600 dark:text-purple-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:text-gray-900 dark:hover:text-white midnight:hover:text-cyan-50 purple:hover:text-pink-50"
              }`}
            >
              <Repeat className="w-4 h-4" />
              Interval Based
            </button>
            <button
              type="button"
              onClick={() => setScheduleMode("manual")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                scheduleMode === "manual"
                  ? "bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-purple-600 dark:text-purple-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:text-gray-900 dark:hover:text-white midnight:hover:text-cyan-50 purple:hover:text-pink-50"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Manual Dates
            </button>
          </div>

          {/* Channel Selection - Compact */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-2 uppercase tracking-wide">
              Send Via
            </label>
            <div className="flex flex-wrap gap-2">
              {channelOptions.map((channel) => (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => toggleChannel(channel.id)}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all cursor-pointer ${
                    channels.includes(channel.id)
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                      : "border-line text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30"
                  }`}
                >
                  {channel.icon}
                  <span className="text-sm font-medium">{channel.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Global Settings Section */}
          <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-500/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-ink text-sm">
                Global Settings
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {/* Reminder Count */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-1.5 flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  Number of Reminders
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setReminderCount(Math.max(1, reminderCount - 1))
                    }
                    className="w-9 h-9 rounded-lg bg-surface border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 flex items-center justify-center text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={reminderCount}
                    onChange={(e) =>
                      setReminderCount(
                        Math.min(10, Math.max(1, parseInt(e.target.value) || 1))
                      )
                    }
                    className="w-14 h-9 text-center text-sm font-semibold bg-surface border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setReminderCount(Math.min(10, reminderCount + 1))
                    }
                    className="w-9 h-9 rounded-lg bg-surface border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 flex items-center justify-center text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Interval Days (only for interval mode) */}
              {scheduleMode === "interval" && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-1.5 flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    Days Between Reminders
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setIntervalDays(Math.max(1, intervalDays - 1))
                      }
                      className="w-9 h-9 rounded-lg bg-surface border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 flex items-center justify-center text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 cursor-pointer transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={intervalDays}
                      onChange={(e) =>
                        setIntervalDays(
                          Math.min(
                            30,
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        )
                      }
                      className="w-14 h-9 text-center text-sm font-semibold bg-surface border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setIntervalDays(Math.min(30, intervalDays + 1))
                      }
                      className="w-9 h-9 rounded-lg bg-surface border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 flex items-center justify-center text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 cursor-pointer transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Default Time */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Default Time
                </label>
                <button
                  ref={defaultTimeRef}
                  type="button"
                  onClick={() => {
                    setActiveDefaultTimePicker(!activeDefaultTimePicker);
                    setActiveDatePicker(null);
                    setActiveTimePicker(null);
                  }}
                  className="w-full h-9 text-sm font-medium text-left bg-surface border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:border-gray-400 dark:hover:border-gray-500 midnight:hover:border-cyan-500/40 purple:hover:border-pink-500/40 rounded-lg px-3 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer"
                >
                  <span className="text-ink">
                    {defaultTime}
                  </span>
                </button>
                {activeDefaultTimePicker && (
                  <ModernTimePicker
                    value={defaultTime}
                    onChange={(t) => {
                      setDefaultTime(t);
                      setActiveDefaultTimePicker(false);
                    }}
                    onClose={() => setActiveDefaultTimePicker(false)}
                    triggerRef={
                      defaultTimeRef as React.RefObject<HTMLElement>
                    }
                    format="12h"
                  />
                )}
              </div>
            </div>

            {/* Start Date (only for interval mode) */}
            {scheduleMode === "interval" && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Start Date
                </label>
                <button
                  ref={startDateRef}
                  type="button"
                  onClick={() => {
                    setActiveStartDatePicker(!activeStartDatePicker);
                    setActiveDatePicker(null);
                    setActiveTimePicker(null);
                    setActiveDefaultTimePicker(false);
                  }}
                  className="w-full sm:w-48 h-9 text-sm font-medium text-left bg-surface border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:border-gray-400 dark:hover:border-gray-500 midnight:hover:border-cyan-500/40 purple:hover:border-pink-500/40 rounded-lg px-3 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer"
                >
                  <span className="text-ink">
                    {formatDisplayDate(startDate)}
                  </span>
                </button>
                {activeStartDatePicker && (
                  <ModernCalendar
                    value={startDate}
                    onChange={(d) => {
                      setStartDate(d);
                      setActiveStartDatePicker(false);
                    }}
                    onClose={() => setActiveStartDatePicker(false)}
                    triggerRef={startDateRef as React.RefObject<HTMLElement>}
                  />
                )}
              </div>
            )}

            {/* Global Message */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-1.5 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Default Reminder Message
              </label>
              <textarea
                value={globalMessage}
                onChange={(e) => setGlobalMessage(e.target.value)}
                rows={4}
                className="w-full text-sm bg-surface border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none"
                placeholder="Enter the message that will be sent with each reminder..."
              />
              <p className="text-xs text-muted mt-1">
                This message will be used for all reminders unless individually
                customized.
              </p>
            </div>
          </div>

          {/* Manual Mode: Add Reminder Button */}
          {scheduleMode === "manual" && (
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 uppercase tracking-wide">
                Scheduled Reminders ({reminders.length})
              </label>
              <button
                type="button"
                onClick={addManualReminder}
                disabled={reminders.length >= 10}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Add Reminder
              </button>
            </div>
          )}

          {/* Reminder List */}
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {reminders.map((reminder, index) => (
              <div
                key={reminder.id}
                className="rounded-xl bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-line overflow-hidden"
              >
                {/* Reminder Header */}
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors"
                  onClick={() => toggleReminderExpanded(reminder.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white text-xs flex items-center justify-center font-bold shadow-sm">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        Reminder {index + 1}
                      </p>
                      <p className="text-xs text-muted">
                        {reminder.date
                          ? `${formatDisplayDate(reminder.date)} at ${reminder.time}`
                          : "Date not set"}
                        {reminder.useCustomMessage && (
                          <span className="ml-2 text-purple-600 dark:text-purple-400">
                            • Custom message
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {scheduleMode === "manual" && reminders.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeReminder(reminder.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="p-1.5 rounded-lg bg-surface-2">
                      {expandedReminders.has(reminder.id) ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedReminders.has(reminder.id) && (
                  <div className="px-3 pb-3 pt-0 space-y-3 border-t border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                    {/* Date & Time Row */}
                    <div className="grid grid-cols-2 gap-3 pt-3">
                      {/* Date Picker */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-1.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Date
                        </label>
                        <button
                          ref={(el) => {
                            if (el) dateRefs.current.set(reminder.id, el);
                          }}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDatePicker(
                              activeDatePicker === reminder.id
                                ? null
                                : reminder.id
                            );
                            setActiveTimePicker(null);
                            setActiveDefaultTimePicker(false);
                            setActiveStartDatePicker(false);
                          }}
                          className="w-full h-9 text-sm font-normal text-left bg-surface border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:border-gray-400 dark:hover:border-gray-500 midnight:hover:border-cyan-500/40 purple:hover:border-pink-500/40 rounded-lg px-3 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer"
                        >
                          {reminder.date ? (
                            <span className="text-ink">
                              {formatDisplayDate(reminder.date)}
                            </span>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 italic text-xs">
                              Select date
                            </span>
                          )}
                        </button>
                        {activeDatePicker === reminder.id && (
                          <ModernCalendar
                            value={reminder.date}
                            onChange={(d) => {
                              updateReminder(reminder.id, "date", d);
                              setActiveDatePicker(null);
                            }}
                            onClose={() => setActiveDatePicker(null)}
                            triggerRef={
                              {
                                current:
                                  dateRefs.current.get(reminder.id) || null,
                              } as React.RefObject<HTMLElement>
                            }
                          />
                        )}
                      </div>

                      {/* Time Picker */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-1.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Time
                        </label>
                        <button
                          ref={(el) => {
                            if (el) timeRefs.current.set(reminder.id, el);
                          }}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTimePicker(
                              activeTimePicker === reminder.id
                                ? null
                                : reminder.id
                            );
                            setActiveDatePicker(null);
                            setActiveDefaultTimePicker(false);
                            setActiveStartDatePicker(false);
                          }}
                          className="w-full h-9 text-sm font-normal text-left bg-surface border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:border-gray-400 dark:hover:border-gray-500 midnight:hover:border-cyan-500/40 purple:hover:border-pink-500/40 rounded-lg px-3 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer"
                        >
                          {reminder.time ? (
                            <span className="text-ink">
                              {reminder.time}
                            </span>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 italic text-xs">
                              Select time
                            </span>
                          )}
                        </button>
                        {activeTimePicker === reminder.id && (
                          <ModernTimePicker
                            value={reminder.time}
                            onChange={(t) => {
                              updateReminder(reminder.id, "time", t);
                              setActiveTimePicker(null);
                            }}
                            onClose={() => setActiveTimePicker(null)}
                            triggerRef={
                              {
                                current:
                                  timeRefs.current.get(reminder.id) || null,
                              } as React.RefObject<HTMLElement>
                            }
                            format="12h"
                          />
                        )}
                      </div>
                    </div>

                    {/* Custom Message Toggle & Textarea */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                          <Edit3 className="w-3 h-3" />
                          Custom Message
                        </label>
                        <div className="flex items-center gap-2">
                          {!reminder.useCustomMessage && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyGlobalMessageToReminder(reminder.id);
                              }}
                              className="inline-flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 cursor-pointer"
                            >
                              <Copy className="w-3 h-3" />
                              Use global message
                            </button>
                          )}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={reminder.useCustomMessage || false}
                              onChange={(e) =>
                                updateReminder(
                                  reminder.id,
                                  "useCustomMessage",
                                  e.target.checked
                                )
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500/20 rounded-full peer dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      </div>
                      {reminder.useCustomMessage && (
                        <textarea
                          value={reminder.message || ""}
                          onChange={(e) =>
                            updateReminder(reminder.id, "message", e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                          rows={3}
                          className="w-full text-sm bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-line rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none"
                          placeholder="Enter a custom message for this reminder..."
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Preview */}
          {sortedReminders.length > 0 && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-200 dark:border-blue-500 midnight:border-cyan-500 purple:border-pink-500/20">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Schedule Preview
              </h4>
              <div className="space-y-2">
                {sortedReminders.slice(0, 5).map((reminder, index) => (
                  <div
                    key={reminder.id}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-blue-800 dark:text-blue-200 midnight:text-cyan-200 purple:text-pink-200">
                      <span className="font-semibold">
                        {formatDisplayDate(reminder.date)}
                      </span>
                      {" at "}
                      <span className="font-semibold">{reminder.time}</span>
                      {reminder.useCustomMessage && (
                        <span className="ml-2 text-xs text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                          (custom msg)
                        </span>
                      )}
                    </span>
                  </div>
                ))}
                {sortedReminders.length > 5 && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 pl-8">
                    +{sortedReminders.length - 5} more reminders
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-blue-200 dark:border-blue-500 midnight:border-cyan-500 purple:border-pink-500/20">
                <span className="text-xs text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
                  Via:
                </span>
                {channels.map((ch) => {
                  const channel = channelOptions.find((c) => c.id === ch);
                  return (
                    <span
                      key={ch}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-xs font-medium text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300"
                    >
                      {channel?.icon}
                      {channel?.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
