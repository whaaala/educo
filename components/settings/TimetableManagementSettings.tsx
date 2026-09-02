"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Plus, Edit2, Trash2, Save, User, FileText, Settings as SettingsIcon } from "lucide-react";
import TimetableSettingsModal from "./TimetableSettingsModal";
import EventManagementModal from "../students/EventManagementModal";
import {
  getCurrentUser,
  setCurrentUser,
  getUserEvents,
  saveUserEvents,
  getUserPermissions,
  MOCK_USERS,
  type CalendarEvent,
  type User as UserType
} from "@/lib/calendarPermissions";
import { getSchoolConfig, type TimetableConfig } from "@/lib/timetableConfig";

export default function TimetableManagementSettings() {
  const [customConfig, setCustomConfig] = useState<TimetableConfig | null>(null);
  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [currentUser, setCurrentUserState] = useState<UserType>(getCurrentUser());

  // Load config and user-specific events from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('customTimetableConfig');
    if (saved) {
      try {
        setCustomConfig(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load custom config:', error);
      }
    }

    // Load events for current user
    const userEvents = getUserEvents(currentUser.id);
    setCustomEvents(userEvents);
  }, [currentUser]);

  const handleSaveSettings = (config: TimetableConfig) => {
    setCustomConfig(config);
    localStorage.setItem('customTimetableConfig', JSON.stringify(config));

    // Dispatch custom event to notify components in the same tab
    window.dispatchEvent(new Event('timetableConfigChanged'));
  };

  const handleSaveEvent = (event: CalendarEvent) => {
    // Ensure event has userId
    const eventWithUser = {
      ...event,
      userId: currentUser.id,
      createdBy: event.createdBy || currentUser.id,
      modifiedBy: currentUser.id,
      modifiedAt: new Date().toISOString(),
    };

    const updatedEvents = customEvents.filter(
      (e) => !(e.dayOfWeek === eventWithUser.dayOfWeek && e.periodIndex === eventWithUser.periodIndex)
    );
    updatedEvents.push(eventWithUser);
    setCustomEvents(updatedEvents);
    saveUserEvents(currentUser.id, updatedEvents);
  };

  const handleDeleteEvent = (eventId: string) => {
    const updatedEvents = customEvents.filter((e) => e.id !== eventId);
    setCustomEvents(updatedEvents);
    saveUserEvents(currentUser.id, updatedEvents);
  };

  const handleUserChange = (userId: string) => {
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(userId);
      setCurrentUserState(user);
    }
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setIsEventModalOpen(true);
  };

  const getCurrentConfig = () => {
    return customConfig || getSchoolConfig("school-1");
  };

  const userPermissions = getUserPermissions(currentUser.id);
  const canCreate = userPermissions.includes("create");
  const canEdit = userPermissions.includes("edit");
  const canDelete = userPermissions.includes("delete");

  return (
    <div className="space-y-6">
      {/* Current User Selector */}
      <div className="bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border border-blue-200 dark:border-blue-700 midnight:border-cyan-700 purple:border-pink-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
              Current User
            </h3>
            <p className="text-xs text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-1">
              Switch users to test different permission levels
            </p>
          </div>
          <select
            value={currentUser.id}
            onChange={(e) => handleUserChange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-blue-300 dark:border-blue-600 bg-white dark:bg-[#1a1d24] text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {MOCK_USERS.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-blue-700 dark:text-blue-400">
          <div>
            <strong>Permissions:</strong> {userPermissions.join(", ")}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            <strong>Email:</strong> {currentUser.email}
          </div>
        </div>
      </div>

      {/* Timetable Configuration */}
      <div className="bg-surface rounded-xl border border-line">
        <div className="px-6 py-4 border-b border-line">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-ink">
                Calendar Configuration
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Configure calendar type, periods, breaks, and free periods
              </p>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              disabled={!canEdit}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <SettingsIcon className="w-4 h-4" />
              Configure Calendar
            </button>
          </div>
        </div>

        <div className="p-6">
          {customConfig ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Active Calendar Type</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">This configuration is displayed to all users</p>
                </div>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                  Custom
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-[#1a1d24]/50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Calendar Type</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{customConfig.calendarType}</div>
                </div>
                <div className="bg-gray-50 dark:bg-[#1a1d24]/50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Week Structure</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{customConfig.weekStructure}</div>
                </div>
                <div className="bg-gray-50 dark:bg-[#1a1d24]/50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Periods Per Day</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{customConfig.periodsPerDay}</div>
                </div>
                <div className="bg-gray-50 dark:bg-[#1a1d24]/50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Period Duration (Time Slot)</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{customConfig.periodDuration} minutes ({customConfig.periodDuration === 60 ? '1 hour' : `${(customConfig.periodDuration / 60).toFixed(1)} hours`})</div>
                </div>
                <div className="bg-gray-50 dark:bg-[#1a1d24]/50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">School Hours</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{customConfig.schoolStartTime} - {customConfig.schoolEndTime}</div>
                </div>
                <div className="bg-gray-50 dark:bg-[#1a1d24]/50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Days of Week</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{customConfig.daysOfWeek.length} days</div>
                </div>
              </div>

              {/* Quick Period Duration Edit */}
              {canEdit && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 rounded-lg border border-blue-200 dark:border-blue-700 midnight:border-cyan-700 purple:border-pink-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
                        Quick Edit: Time Slot Duration
                      </h5>
                      <p className="text-xs text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-1">
                        Adjust how long each period lasts (30-120 minutes)
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="30"
                        max="120"
                        step="5"
                        value={customConfig.periodDuration}
                        onChange={(e) => {
                          const newDuration = parseInt(e.target.value);
                          if (newDuration >= 30 && newDuration <= 120) {
                            const updatedConfig = { ...customConfig, periodDuration: newDuration };
                            handleSaveSettings(updatedConfig);
                          }
                        }}
                        className="w-20 px-3 py-2 rounded-lg border border-blue-300 dark:border-blue-600 bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-white text-sm font-semibold text-center focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-300">minutes</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {[30, 45, 60, 90].map((duration) => (
                      <button
                        key={duration}
                        onClick={() => {
                          const updatedConfig = { ...customConfig, periodDuration: duration };
                          handleSaveSettings(updatedConfig);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          customConfig.periodDuration === duration
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-[#1a1d24] text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                        }`}
                      >
                        {duration}min
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Using default calendar configuration
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Click "Configure Calendar" to create a custom configuration
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Events Management */}
      <div className="bg-surface rounded-xl border border-line">
        <div className="px-6 py-4 border-b border-line">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-ink">
                Custom Events
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Manage custom events and modifications to the timetable
              </p>
            </div>
            <button
              onClick={handleCreateEvent}
              disabled={!canCreate}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          </div>
        </div>

        <div className="p-6">
          {customEvents.length > 0 ? (
            <div className="space-y-3">
              {customEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1a1d24]/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {event.subject}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded capitalize">
                        {event.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{event.dayOfWeek}</span>
                      <span>Period {event.periodIndex + 1}</span>
                      {event.teacher && <span>{event.teacher}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {canEdit && (
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors"
                        title="Edit event"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                        title="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No custom events yet. Click "Add Event" to create one.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <TimetableSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialConfig={getCurrentConfig()}
        onSave={handleSaveSettings}
      />

      {isEventModalOpen && (
        <EventManagementModal
          isOpen={isEventModalOpen}
          onClose={() => {
            setIsEventModalOpen(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent || undefined}
          dayOfWeek={selectedEvent?.dayOfWeek || "Monday"}
          periodIndex={selectedEvent?.periodIndex || 0}
          periodTime="08:00 - 08:45 AM"
          userPermissions={{
            userId: currentUser.id,
            role: currentUser.role,
            permissions: userPermissions,
          }}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          allowTimeSlotSelection={true}
        />
      )}
    </div>
  );
}
