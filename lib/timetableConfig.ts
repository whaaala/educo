// Timetable configuration types and utilities

export type CalendarType = "5-day" | "6-day" | "7-day";
export type WeekStructure = "standard" | "rotating" | "block";
export type PeriodType = "class" | "break" | "free" | "assembly" | "study";

export interface FreePeriod {
  periodIndex: number; // Which period slot (0-based)
  label: string; // e.g., "Free Period", "Study Hall", "Assembly"
  type: PeriodType;
}

export interface DayScheduleOverride {
  dayOfWeek: string; // e.g., "Monday"
  freePeriods?: FreePeriod[];
  customPeriods?: {
    periodIndex: number;
    label: string;
    type: PeriodType;
  }[];
}

export interface TimetableConfig {
  calendarType: CalendarType;
  weekStructure: WeekStructure;
  daysOfWeek: string[];
  periodsPerDay: number;
  periodDuration: number; // in minutes
  includeBreaks: boolean;
  includeFree: boolean; // Whether to show free periods
  schoolStartTime: string; // "08:00"
  schoolEndTime: string; // "15:00"
  breakSchedule?: {
    morningBreak?: { start: string; end: string };
    lunch?: { start: string; end: string };
    eveningBreak?: { start: string; end: string };
  };
  freePeriods?: FreePeriod[]; // Global free periods (apply to all days)
  dayOverrides?: DayScheduleOverride[]; // Day-specific overrides
  fixedTimeSlots?: boolean; // If true, use exact time slots, don't auto-generate
  customTimeSlots?: string[]; // Custom time slots if fixedTimeSlots is true
}

// Predefined calendar configurations
export const CALENDAR_CONFIGS: Record<CalendarType, Omit<TimetableConfig, "weekStructure">> = {
  "5-day": {
    calendarType: "5-day",
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
      eveningBreak: { start: "15:00", end: "15:15" },
    },
  },
  "6-day": {
    calendarType: "6-day",
    daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    periodsPerDay: 6,
    periodDuration: 60,
    includeBreaks: true,
    includeFree: false,
    schoolStartTime: "08:00",
    schoolEndTime: "15:00",
    breakSchedule: {
      morningBreak: { start: "10:00", end: "10:15" },
      lunch: { start: "12:00", end: "13:00" },
    },
  },
  "7-day": {
    calendarType: "7-day",
    daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    periodsPerDay: 5,
    periodDuration: 60,
    includeBreaks: true,
    includeFree: false,
    schoolStartTime: "08:00",
    schoolEndTime: "14:00",
    breakSchedule: {
      morningBreak: { start: "10:00", end: "10:15" },
    },
  },
};

// School-specific configurations
export interface SchoolTimetableSettings {
  schoolId: string;
  schoolName: string;
  config: TimetableConfig;
}

// Example school configurations
export const SCHOOL_CONFIGS: Record<string, SchoolTimetableSettings> = {
  "school-1": {
    schoolId: "school-1",
    schoolName: "Greenwood High School",
    config: {
      ...CALENDAR_CONFIGS["5-day"],
      weekStructure: "standard",
    },
  },
  "school-2": {
    schoolId: "school-2",
    schoolName: "St. Mary's Academy",
    config: {
      ...CALENDAR_CONFIGS["6-day"],
      weekStructure: "standard",
      periodsPerDay: 8,
    },
  },
  "school-3": {
    schoolId: "school-3",
    schoolName: "International School",
    config: {
      ...CALENDAR_CONFIGS["5-day"],
      weekStructure: "block",
      periodsPerDay: 4,
      periodDuration: 90,
      breakSchedule: {
        morningBreak: { start: "10:30", end: "10:50" },
        lunch: { start: "12:30", end: "13:15" },
      },
    },
  },
  "school-4": {
    schoolId: "school-4",
    schoolName: "Academy with Free Periods",
    config: {
      ...CALENDAR_CONFIGS["5-day"],
      weekStructure: "standard",
      periodsPerDay: 8,
      periodDuration: 45,
      includeFree: true,
      // Period 4 is always free (index 3, 0-based)
      freePeriods: [
        { periodIndex: 3, label: "Free Period", type: "free" },
      ],
      // Monday has assembly in period 1
      dayOverrides: [
        {
          dayOfWeek: "Monday",
          customPeriods: [
            { periodIndex: 0, label: "Assembly", type: "assembly" },
          ],
        },
        {
          dayOfWeek: "Friday",
          freePeriods: [
            { periodIndex: 6, label: "Study Hall", type: "study" },
          ],
        },
      ],
    },
  },
  "school-5": {
    schoolId: "school-5",
    schoolName: "Fixed Schedule School",
    config: {
      calendarType: "5-day",
      weekStructure: "standard",
      daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      periodsPerDay: 8,
      periodDuration: 45,
      includeBreaks: true,
      includeFree: true,
      schoolStartTime: "08:00",
      schoolEndTime: "16:00",
      fixedTimeSlots: true,
      customTimeSlots: [
        "08:00 - 08:45 AM",
        "08:50 - 09:35 AM",
        "09:40 - 10:25 AM",
        "10:30 - 11:15 AM",
        "11:20 - 12:05 PM",
        "01:00 - 01:45 PM",
        "01:50 - 02:35 PM",
        "02:40 - 03:25 PM",
      ],
      breakSchedule: {
        morningBreak: { start: "10:25", end: "10:30" },
        lunch: { start: "12:05", end: "01:00" },
      },
      freePeriods: [
        { periodIndex: 4, label: "Free Period", type: "free" },
      ],
      dayOverrides: [
        {
          dayOfWeek: "Wednesday",
          customPeriods: [
            { periodIndex: 2, label: "Activity Period", type: "free" },
          ],
        },
      ],
    },
  },
};

// Utility functions
export function getSchoolConfig(schoolId: string): TimetableConfig {
  return SCHOOL_CONFIGS[schoolId]?.config || SCHOOL_CONFIGS["school-1"].config;
}

export function generateTimeSlots(config: TimetableConfig): string[] {
  // If fixed time slots are provided, use them
  if (config.fixedTimeSlots && config.customTimeSlots) {
    return config.customTimeSlots;
  }

  const slots: string[] = [];
  const [startHour, startMinute] = config.schoolStartTime.split(":").map(Number);

  let currentTime = startHour * 60 + startMinute; // Convert to minutes
  const breakTimes = new Set<string>();

  // Collect break times
  if (config.includeBreaks && config.breakSchedule) {
    if (config.breakSchedule.morningBreak) {
      breakTimes.add(config.breakSchedule.morningBreak.start);
    }
    if (config.breakSchedule.lunch) {
      breakTimes.add(config.breakSchedule.lunch.start);
    }
    if (config.breakSchedule.eveningBreak) {
      breakTimes.add(config.breakSchedule.eveningBreak.start);
    }
  }

  for (let i = 0; i < config.periodsPerDay; i++) {
    const startHours = Math.floor(currentTime / 60);
    const startMins = currentTime % 60;
    const endTime = currentTime + config.periodDuration;
    const endHours = Math.floor(endTime / 60);
    const endMins = endTime % 60;

    const startFormatted = `${String(startHours).padStart(2, "0")}:${String(startMins).padStart(2, "0")}`;
    const endFormatted = `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;

    const startPeriod = startHours >= 12 ? "PM" : "AM";
    const endPeriod = endHours >= 12 ? "PM" : "AM";
    const startHour12 = startHours > 12 ? startHours - 12 : startHours === 0 ? 12 : startHours;
    const endHour12 = endHours > 12 ? endHours - 12 : endHours === 0 ? 12 : endHours;

    slots.push(
      `${String(startHour12).padStart(2, "0")}:${String(startMins).padStart(2, "0")} ${startPeriod} - ${String(endHour12).padStart(2, "0")}:${String(endMins).padStart(2, "0")} ${endPeriod}`
    );

    currentTime = endTime;

    // Check if there's a break after this period
    const nextStartFormatted = `${String(Math.floor(currentTime / 60)).padStart(2, "0")}:${String(currentTime % 60).padStart(2, "0")}`;

    if (config.includeBreaks && config.breakSchedule) {
      // Morning break check
      if (
        config.breakSchedule.morningBreak &&
        nextStartFormatted === config.breakSchedule.morningBreak.start
      ) {
        const [breakEndHour, breakEndMin] = config.breakSchedule.morningBreak.end.split(":").map(Number);
        currentTime = breakEndHour * 60 + breakEndMin;
      }
      // Lunch break check
      if (
        config.breakSchedule.lunch &&
        nextStartFormatted === config.breakSchedule.lunch.start
      ) {
        const [breakEndHour, breakEndMin] = config.breakSchedule.lunch.end.split(":").map(Number);
        currentTime = breakEndHour * 60 + breakEndMin;
      }
      // Evening break check
      if (
        config.breakSchedule.eveningBreak &&
        nextStartFormatted === config.breakSchedule.eveningBreak.start
      ) {
        const [breakEndHour, breakEndMin] = config.breakSchedule.eveningBreak.end.split(":").map(Number);
        currentTime = breakEndHour * 60 + breakEndMin;
      }
    }
  }

  return slots;
}

export function getBreakPeriods(config: TimetableConfig): Array<{ time: string; label: string }> {
  const breaks: Array<{ time: string; label: string }> = [];

  if (!config.includeBreaks || !config.breakSchedule) {
    return breaks;
  }

  const formatTime = (timeStr: string) => {
    const [hour, min] = timeStr.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${String(hour12).padStart(2, "0")}:${String(min).padStart(2, "0")} ${period}`;
  };

  // Only add morning break if it has both start and end times configured
  if (config.breakSchedule.morningBreak &&
      config.breakSchedule.morningBreak.start &&
      config.breakSchedule.morningBreak.end) {
    breaks.push({
      time: `${formatTime(config.breakSchedule.morningBreak.start)} to ${formatTime(config.breakSchedule.morningBreak.end)}`,
      label: "Morning Break",
    });
  }

  // Only add lunch if it has both start and end times configured
  if (config.breakSchedule.lunch &&
      config.breakSchedule.lunch.start &&
      config.breakSchedule.lunch.end) {
    breaks.push({
      time: `${formatTime(config.breakSchedule.lunch.start)} to ${formatTime(config.breakSchedule.lunch.end)}`,
      label: "Lunch",
    });
  }

  // Only add evening break if it has both start and end times configured
  if (config.breakSchedule.eveningBreak &&
      config.breakSchedule.eveningBreak.start &&
      config.breakSchedule.eveningBreak.end) {
    breaks.push({
      time: `${formatTime(config.breakSchedule.eveningBreak.start)} to ${formatTime(config.breakSchedule.eveningBreak.end)}`,
      label: "Evening Break",
    });
  }

  return breaks;
}

// Get calendar type display name
export function getCalendarTypeLabel(type: CalendarType): string {
  const labels: Record<CalendarType, string> = {
    "5-day": "5-Day Week (Mon-Fri)",
    "6-day": "6-Day Week (Mon-Sat)",
    "7-day": "7-Day Week (Mon-Sun)",
  };
  return labels[type];
}

// Default export for easy access
export default {
  CALENDAR_CONFIGS,
  SCHOOL_CONFIGS,
  getSchoolConfig,
  generateTimeSlots,
  getBreakPeriods,
  getCalendarTypeLabel,
};
