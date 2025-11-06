"use client";

import { useState, useEffect } from "react";
import { X, Save, Plus, Edit2, Trash2, Calendar, Clock, User, FileText } from "lucide-react";
import type { CalendarEvent, UserPermissions } from "@/lib/calendarPermissions";
import type { PeriodType } from "@/lib/timetableConfig";

interface EventManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent | null; // If provided, edit mode; otherwise, create mode
  dayOfWeek: string;
  periodIndex: number;
  periodTime: string;
  userPermissions: UserPermissions;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
  allowTimeSlotSelection?: boolean; // Allow selecting different time slots when creating
}

export default function EventManagementModal({
  isOpen,
  onClose,
  event,
  dayOfWeek,
  periodIndex,
  periodTime,
  userPermissions,
  onSave,
  onDelete,
  allowTimeSlotSelection = true,
}: EventManagementModalProps) {
  const [formData, setFormData] = useState<Partial<CalendarEvent>>({
    subject: "",
    teacher: "",
    type: "class",
    description: "",
  });

  const [selectedDay, setSelectedDay] = useState(dayOfWeek);
  const [selectedPeriod, setSelectedPeriod] = useState(periodIndex);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const periods = Array.from({ length: 10 }, (_, i) => i); // Support up to 10 periods

  const isEditMode = !!event;
  const canEdit = userPermissions.permissions.includes("edit");
  const canCreate = userPermissions.permissions.includes("create");
  const canDelete = userPermissions.permissions.includes("delete");

  useEffect(() => {
    if (event) {
      setFormData({
        subject: event.subject,
        teacher: event.teacher,
        type: event.type,
        description: event.description,
      });
      setSelectedDay(event.dayOfWeek);
      setSelectedPeriod(event.periodIndex);
    } else {
      setFormData({
        subject: "",
        teacher: "",
        type: "class",
        description: "",
      });
      setSelectedDay(dayOfWeek);
      setSelectedPeriod(periodIndex);
    }
  }, [event, isOpen, dayOfWeek, periodIndex]);

  const handleSave = () => {
    if (!formData.subject) {
      alert("Subject is required");
      return;
    }

    const now = new Date().toISOString();
    const eventToSave: CalendarEvent = {
      id: event?.id || `event-${Date.now()}`,
      dayOfWeek: selectedDay,
      periodIndex: selectedPeriod,
      subject: formData.subject!,
      teacher: formData.teacher,
      type: formData.type as PeriodType,
      description: formData.description,
      isCustom: true,
      createdBy: event?.createdBy || userPermissions.userId,
      modifiedBy: userPermissions.userId,
      createdAt: event?.createdAt || now,
      modifiedAt: now,
    };

    onSave(eventToSave);
    onClose();
  };

  const handleDelete = () => {
    if (!event || !canDelete) return;

    if (confirm("Are you sure you want to delete this event?")) {
      onDelete?.(event.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  // Check permissions
  if (isEditMode && !canEdit) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Permission Denied
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You don't have permission to edit calendar events.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isEditMode && !canCreate) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Permission Denied
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You don't have permission to create calendar events.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
              {isEditMode ? (
                <Edit2 className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              ) : (
                <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {isEditMode ? "Edit Event" : "Create Event"}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                {selectedDay} • Period {selectedPeriod + 1}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Time Slot Selection - Only show when creating new event */}
          {!isEditMode && allowTimeSlotSelection && (
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border border-blue-200 dark:border-blue-700 midnight:border-cyan-700 purple:border-pink-700 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
                  Select Time Slot
                </h3>
              </div>

              {/* Day Selector */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Day of Week
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              {/* Period Selector */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Period Number
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {periods.map((period) => (
                    <option key={period} value={period}>
                      Period {period + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Subject / Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Mathematics, Assembly, Study Hall"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Event Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["class", "free", "study", "assembly", "custom"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFormData({ ...formData, type })}
                  className={`p-3 rounded-xl border-2 font-semibold text-sm transition-all capitalize ${
                    formData.type === type
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Teacher */}
          {formData.type === "class" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Teacher Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.teacher}
                  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                  placeholder="e.g., Mr. Smith"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Description (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add notes or additional information..."
                rows={4}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* Event Info */}
          {isEditMode && event && (
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 midnight:bg-cyan-900/10 purple:bg-pink-900/10 space-y-2">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Created:</span>{" "}
                {event.createdAt ? new Date(event.createdAt).toLocaleString() : "Unknown"}
              </div>
              {event.modifiedAt && (
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Last Modified:</span>{" "}
                  {new Date(event.modifiedAt).toLocaleString()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          {/* Delete Button (only in edit mode) */}
          <div>
            {isEditMode && canDelete && (
              <button
                onClick={handleDelete}
                className="px-4 py-2.5 rounded-xl border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Event
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 transition-colors shadow-lg"
            >
              <Save className="w-4 h-4" />
              {isEditMode ? "Save Changes" : "Create Event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
