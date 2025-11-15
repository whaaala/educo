"use client";

import { useState, useEffect } from "react";
import { X, Save, Calendar, Clock, Plus, Trash2, Settings as SettingsIcon } from "lucide-react";
import type { TimetableConfig, CalendarType, WeekStructure, FreePeriod, DayScheduleOverride } from "@/lib/timetableConfig";

interface TimetableSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialConfig?: TimetableConfig;
  onSave: (config: TimetableConfig) => void;
}

export default function TimetableSettingsModal({
  isOpen,
  onClose,
  initialConfig,
  onSave,
}: TimetableSettingsModalProps) {
  const [config, setConfig] = useState<TimetableConfig>(
    initialConfig || {
      calendarType: "5-day",
      weekStructure: "standard",
      daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      periodsPerDay: 7,
      periodDuration: 60,
      includeBreaks: true,
      includeFree: false,
      schoolStartTime: "08:00",
      schoolEndTime: "16:00",
      breakSchedule: {
        morningBreak: { start: "10:00", end: "10:15" },
        lunch: { start: "12:00", end: "13:00" },
      },
    }
  );

  const [activeTab, setActiveTab] = useState<"general" | "breaks" | "free-periods">("general");

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const updateDaysOfWeek = (calendarType: CalendarType) => {
    const daysMap: Record<CalendarType, string[]> = {
      "5-day": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "6-day": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "7-day": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    };
    setConfig({ ...config, calendarType, daysOfWeek: daysMap[calendarType] });
  };

  const addFreePeriod = () => {
    const newFreePeriod: FreePeriod = {
      periodIndex: 0,
      label: "Free Period",
      type: "free",
    };
    setConfig({
      ...config,
      includeFree: true,
      freePeriods: [...(config.freePeriods || []), newFreePeriod],
    });
  };

  const removeFreePeriod = (index: number) => {
    const updated = config.freePeriods?.filter((_, i) => i !== index);
    setConfig({ ...config, freePeriods: updated });
  };

  const updateFreePeriod = (index: number, field: keyof FreePeriod, value: string | number) => {
    const updated = config.freePeriods?.map((fp, i) =>
      i === index ? { ...fp, [field]: value } : fp
    );
    setConfig({ ...config, freePeriods: updated });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Timetable Settings
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                Configure your school's timetable calendar
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

        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-4 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          {[
            { id: "general", label: "General", icon: Calendar },
            { id: "breaks", label: "Breaks", icon: Clock },
            { id: "free-periods", label: "Free Periods", icon: Plus },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold text-sm transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              {/* Calendar Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                  Calendar Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["5-day", "6-day", "7-day"] as CalendarType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => updateDaysOfWeek(type)}
                      className={`p-4 rounded-xl border-2 font-semibold text-sm transition-all ${
                        config.calendarType === type
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      {type === "5-day" && "5-Day Week"}
                      {type === "6-day" && "6-Day Week"}
                      {type === "7-day" && "7-Day Week"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Week Structure */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                  Week Structure
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["standard", "rotating", "block"] as WeekStructure[]).map((structure) => (
                    <button
                      key={structure}
                      onClick={() => setConfig({ ...config, weekStructure: structure })}
                      className={`p-4 rounded-xl border-2 font-semibold text-sm transition-all capitalize ${
                        config.weekStructure === structure
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      {structure}
                    </button>
                  ))}
                </div>
              </div>

              {/* Periods Per Day */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                    Periods Per Day
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={config.periodsPerDay}
                    onChange={(e) =>
                      setConfig({ ...config, periodsPerDay: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                    Period Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="120"
                    step="5"
                    value={config.periodDuration}
                    onChange={(e) =>
                      setConfig({ ...config, periodDuration: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* School Times */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                    School Start Time
                  </label>
                  <input
                    type="time"
                    value={config.schoolStartTime}
                    onChange={(e) => setConfig({ ...config, schoolStartTime: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                    School End Time
                  </label>
                  <input
                    type="time"
                    value={config.schoolEndTime}
                    onChange={(e) => setConfig({ ...config, schoolEndTime: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "breaks" && (
            <div className="space-y-6">
              {/* Include Breaks Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 midnight:bg-cyan-900/10 purple:bg-pink-900/10">
                <span className="font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                  Include Break Times
                </span>
                <button
                  onClick={() => setConfig({ ...config, includeBreaks: !config.includeBreaks })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    config.includeBreaks ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      config.includeBreaks ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>

              {config.includeBreaks && (
                <>
                  {/* Morning Break */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                      Morning Break
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="time"
                        value={config.breakSchedule?.morningBreak?.start || ""}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            breakSchedule: {
                              ...config.breakSchedule,
                              morningBreak: {
                                ...config.breakSchedule?.morningBreak!,
                                start: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="Start"
                        className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="time"
                        value={config.breakSchedule?.morningBreak?.end || ""}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            breakSchedule: {
                              ...config.breakSchedule,
                              morningBreak: {
                                ...config.breakSchedule?.morningBreak!,
                                end: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="End"
                        className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Lunch */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                      Lunch Break
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="time"
                        value={config.breakSchedule?.lunch?.start || ""}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            breakSchedule: {
                              ...config.breakSchedule,
                              lunch: {
                                ...config.breakSchedule?.lunch!,
                                start: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="Start"
                        className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="time"
                        value={config.breakSchedule?.lunch?.end || ""}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            breakSchedule: {
                              ...config.breakSchedule,
                              lunch: {
                                ...config.breakSchedule?.lunch!,
                                end: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="End"
                        className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Evening Break */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                      Evening Break (Optional)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="time"
                        value={config.breakSchedule?.eveningBreak?.start || ""}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            breakSchedule: {
                              ...config.breakSchedule,
                              eveningBreak: {
                                start: e.target.value,
                                end: config.breakSchedule?.eveningBreak?.end || "",
                              },
                            },
                          })
                        }
                        placeholder="Start"
                        className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="time"
                        value={config.breakSchedule?.eveningBreak?.end || ""}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            breakSchedule: {
                              ...config.breakSchedule,
                              eveningBreak: {
                                start: config.breakSchedule?.eveningBreak?.start || "",
                                end: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="End"
                        className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "free-periods" && (
            <div className="space-y-6">
              {/* Include Free Periods Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 midnight:bg-cyan-900/10 purple:bg-pink-900/10">
                <span className="font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                  Include Free Periods
                </span>
                <button
                  onClick={() => setConfig({ ...config, includeFree: !config.includeFree })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    config.includeFree ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      config.includeFree ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>

              {config.includeFree && (
                <>
                  <button
                    onClick={addFreePeriod}
                    className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 text-gray-600 dark:text-gray-400 hover:text-blue-500 font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Free Period
                  </button>

                  {config.freePeriods?.map((fp, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          Free Period {index + 1}
                        </span>
                        <button
                          onClick={() => removeFreePeriod(index)}
                          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Period Index
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={config.periodsPerDay - 1}
                            value={fp.periodIndex}
                            onChange={(e) =>
                              updateFreePeriod(index, "periodIndex", parseInt(e.target.value))
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Label
                          </label>
                          <input
                            type="text"
                            value={fp.label}
                            onChange={(e) => updateFreePeriod(index, "label", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Type
                          </label>
                          <select
                            value={fp.type}
                            onChange={(e) => updateFreePeriod(index, "type", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            <option value="free">Free</option>
                            <option value="study">Study Hall</option>
                            <option value="assembly">Assembly</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
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
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
