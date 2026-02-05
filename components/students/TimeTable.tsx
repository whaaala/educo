"use client";

import { useState, useMemo, useEffect } from "react";
import { Clock, ChevronLeft, ChevronRight, Coffee, Utensils, Moon, Calendar } from "lucide-react";
import type { TimetableEntry, Period } from "@/lib/mockStudents";
import TimetableCell from "./TimetableCell";
import BreakCard from "./BreakCard";
import CustomDropdown from "@/components/shared/CustomDropdown";
import MobileDropdown from "@/components/shared/MobileDropdown";
import { getSchoolConfig, generateTimeSlots, getBreakPeriods, type TimetableConfig } from "@/lib/timetableConfig";
import type { CalendarEvent } from "@/lib/calendarPermissions";
import { getCurrentUser, getUserEvents } from "@/lib/calendarPermissions";
import type { EducationLevel } from "@/lib/educationLevelUtils";

interface TimeTableProps {
  timetable?: TimetableEntry[];
  schoolId?: string; // Optional school ID to load specific config
}

// Subject lists by education level
const SUBJECTS_BY_LEVEL: Record<EducationLevel, string[]> = {
  primary: [
    "English",
    "Mathematics",
    "Basic Science",
    "Social Studies",
    "Creative Arts",
    "Physical Education",
    "Religious Studies",
    "Civic Education",
    "Handwriting",
    "Reading",
  ],
  secondary: [
    "Mathematics",
    "English",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "History",
    "Geography",
    "Economics",
    "Literature",
  ],
  tertiary: [
    "Advanced Programming",
    "Data Structures",
    "Database Systems",
    "Web Development",
    "Software Engineering",
    "Operating Systems",
    "Computer Networks",
    "Artificial Intelligence",
    "Machine Learning",
    "Cybersecurity",
  ],
};

// Helper function to generate timetable with custom config
function generateDynamicTimetableWithConfig(week: number, year: string, config: TimetableConfig, educationLevel: EducationLevel): TimetableEntry[] {
  const days = config.daysOfWeek;
  const timeSlots = generateTimeSlots(config);

  const subjects = SUBJECTS_BY_LEVEL[educationLevel];
  const teachers = ["Jacquelin", "Erickson", "Daniel", "Teresa", "Hellana", "Morgan", "Aaron", "Sarah", "Michael", "Emma"];
  const teacherAvatars = [
    "https://i.pravatar.cc/150?img=11",
    "https://i.pravatar.cc/150?img=12",
    "https://i.pravatar.cc/150?img=13",
    "https://i.pravatar.cc/150?img=14",
    "https://i.pravatar.cc/150?img=15",
    "https://i.pravatar.cc/150?img=16",
    "https://i.pravatar.cc/150?img=17",
    "https://i.pravatar.cc/150?img=18",
    "https://i.pravatar.cc/150?img=19",
    "https://i.pravatar.cc/150?img=20",
  ];

  const yearOffset = year === "this-year" ? 0 : year === "last-year" ? 100 : 200;
  const seed = week + yearOffset;

  return days.map((day, dayIndex) => {
    const periods: Period[] = [];
    const dayOverride = config.dayOverrides?.find(override => override.dayOfWeek === day);
    const freePeriodIndexes = new Set<number>();
    const customPeriods = new Map<number, { label: string; type: string }>();

    if (config.includeFree && config.freePeriods) {
      config.freePeriods.forEach(fp => freePeriodIndexes.add(fp.periodIndex));
    }

    if (dayOverride) {
      dayOverride.freePeriods?.forEach(fp => {
        freePeriodIndexes.add(fp.periodIndex);
        customPeriods.set(fp.periodIndex, { label: fp.label, type: fp.type });
      });
      dayOverride.customPeriods?.forEach(cp => {
        customPeriods.set(cp.periodIndex, { label: cp.label, type: cp.type });
      });
    }

    timeSlots.forEach((time, slotIndex) => {
      if (customPeriods.has(slotIndex)) {
        const custom = customPeriods.get(slotIndex)!;
        periods.push({
          time,
          subject: custom.label,
          teacher: "",
          teacherAvatar: undefined,
          type: custom.type as "class" | "break",
        });
      } else if (freePeriodIndexes.has(slotIndex)) {
        const freePeriod = config.freePeriods?.find(fp => fp.periodIndex === slotIndex) ||
                          dayOverride?.freePeriods?.find(fp => fp.periodIndex === slotIndex);
        periods.push({
          time,
          subject: freePeriod?.label || "Free Period",
          teacher: "",
          teacherAvatar: undefined,
          type: freePeriod?.type as "class" | "break" || "free",
        });
      } else {
        const subjectIndex = (seed * 7 + dayIndex * 13 + slotIndex * 17) % subjects.length;
        const teacherIndex = (seed * 11 + dayIndex * 19 + slotIndex * 23) % teachers.length;
        periods.push({
          time,
          subject: subjects[subjectIndex],
          teacher: teachers[teacherIndex],
          teacherAvatar: teacherAvatars[teacherIndex],
          type: "class",
        });
      }
    });

    const breaks = getBreakPeriods(config);
    breaks.forEach((breakInfo) => {
      periods.push({
        time: breakInfo.time,
        subject: breakInfo.label,
        teacher: "",
        type: "break",
      });
    });

    return { day, periods };
  });
}

// Helper function to generate dynamic timetable based on week, year, and school config
function generateDynamicTimetable(week: number, year: string, schoolId: string = "school-1", educationLevel: EducationLevel = "secondary"): TimetableEntry[] {
  const config = getSchoolConfig(schoolId);
  const days = config.daysOfWeek;
  const timeSlots = generateTimeSlots(config);

  const subjects = SUBJECTS_BY_LEVEL[educationLevel];
  const teachers = ["Jacquelin", "Erickson", "Daniel", "Teresa", "Hellana", "Morgan", "Aaron", "Sarah", "Michael", "Emma"];
  const teacherAvatars = [
    "https://i.pravatar.cc/150?img=11",
    "https://i.pravatar.cc/150?img=12",
    "https://i.pravatar.cc/150?img=13",
    "https://i.pravatar.cc/150?img=14",
    "https://i.pravatar.cc/150?img=15",
    "https://i.pravatar.cc/150?img=16",
    "https://i.pravatar.cc/150?img=17",
    "https://i.pravatar.cc/150?img=18",
    "https://i.pravatar.cc/150?img=19",
    "https://i.pravatar.cc/150?img=20",
  ];

  // Use week and year as seed for consistent but different data
  const yearOffset = year === "this-year" ? 0 : year === "last-year" ? 100 : 200;
  const seed = week + yearOffset;

  return days.map((day, dayIndex) => {
    const periods: Period[] = [];

    // Get day-specific overrides
    const dayOverride = config.dayOverrides?.find(override => override.dayOfWeek === day);

    // Create a set of free period indexes for this day
    const freePeriodIndexes = new Set<number>();
    const customPeriods = new Map<number, { label: string; type: string }>();

    // Add global free periods
    if (config.includeFree && config.freePeriods) {
      config.freePeriods.forEach(fp => freePeriodIndexes.add(fp.periodIndex));
    }

    // Add day-specific free periods and custom periods
    if (dayOverride) {
      dayOverride.freePeriods?.forEach(fp => {
        freePeriodIndexes.add(fp.periodIndex);
        customPeriods.set(fp.periodIndex, { label: fp.label, type: fp.type });
      });
      dayOverride.customPeriods?.forEach(cp => {
        customPeriods.set(cp.periodIndex, { label: cp.label, type: cp.type });
      });
    }

    // Add class periods
    timeSlots.forEach((time, slotIndex) => {
      // Check if this period has a custom override
      if (customPeriods.has(slotIndex)) {
        const custom = customPeriods.get(slotIndex)!;
        periods.push({
          time,
          subject: custom.label,
          teacher: "",
          teacherAvatar: undefined,
          type: custom.type as "class" | "break",
        });
      }
      // Check if this is a free period
      else if (freePeriodIndexes.has(slotIndex)) {
        const freePeriod = config.freePeriods?.find(fp => fp.periodIndex === slotIndex) ||
                          dayOverride?.freePeriods?.find(fp => fp.periodIndex === slotIndex);

        periods.push({
          time,
          subject: freePeriod?.label || "Free Period",
          teacher: "",
          teacherAvatar: undefined,
          type: freePeriod?.type as "class" | "break" || "free",
        });
      }
      // Regular class period
      else {
        const subjectIndex = (seed * 7 + dayIndex * 13 + slotIndex * 17) % subjects.length;
        const teacherIndex = (seed * 11 + dayIndex * 19 + slotIndex * 23) % teachers.length;

        periods.push({
          time,
          subject: subjects[subjectIndex],
          teacher: teachers[teacherIndex],
          teacherAvatar: teacherAvatars[teacherIndex],
          type: "class",
        });
      }
    });

    // Add breaks at the end
    const breaks = getBreakPeriods(config);
    breaks.forEach((breakInfo) => {
      periods.push({
        time: breakInfo.time,
        subject: breakInfo.label,
        teacher: "",
        type: "break",
      });
    });

    return {
      day,
      periods,
    };
  });
}

export default function TimeTable({ timetable: propTimetable, schoolId = "school-1" }: TimeTableProps) {
  const [selectedYear, setSelectedYear] = useState("this-year");
  const [currentWeek, setCurrentWeek] = useState(1);
  const [customConfig, setCustomConfig] = useState<TimetableConfig | null>(null);
  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>([]);
  const [selectedMobileDay, setSelectedMobileDay] = useState(0); // Index of selected day for mobile view

  // Education level state - reads from School Profile settings
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(() => {
    if (typeof window !== "undefined") {
      const settingsEducationLevel = localStorage.getItem("educationLevel");
      if (settingsEducationLevel === "tertiary") return "tertiary";
      if (settingsEducationLevel === "primary") return "primary";
      if (settingsEducationLevel === "multi-level") return "secondary"; // Default multi-level to secondary
    }
    return "secondary";
  });

  // Load custom config and user-specific events from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('customTimetableConfig');
    console.log('🔍 [TimeTable] Loading configuration from localStorage...');
    console.log('📦 [TimeTable] Raw localStorage data:', saved);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log('✅ [TimeTable] Custom config loaded successfully:', parsed);
        console.log('📋 [TimeTable] Config details:', {
          periodsPerDay: parsed.periodsPerDay,
          periodDuration: parsed.periodDuration,
          schoolStartTime: parsed.schoolStartTime,
          schoolEndTime: parsed.schoolEndTime,
          daysOfWeek: parsed.daysOfWeek,
          includeBreaks: parsed.includeBreaks,
          breakSchedule: parsed.breakSchedule
        });
        setCustomConfig(parsed);
      } catch (error) {
        console.error('❌ [TimeTable] Failed to load custom config:', error);
      }
    } else {
      console.log('ℹ️ [TimeTable] No custom config found in localStorage, using default');
    }

    // Load events for current user
    const currentUser = getCurrentUser();
    const userEvents = getUserEvents(currentUser.id);
    setCustomEvents(userEvents);
  }, []);

  // Listen for School Profile changes
  useEffect(() => {
    const handleSchoolProfileChange = (event: CustomEvent<{ educationLevel: string; institutionType: string }>) => {
      const { educationLevel: settingsEducationLevel } = event.detail;

      if (settingsEducationLevel === "tertiary") setEducationLevel("tertiary");
      else if (settingsEducationLevel === "secondary") setEducationLevel("secondary");
      else if (settingsEducationLevel === "primary") setEducationLevel("primary");
      else if (settingsEducationLevel === "multi-level") setEducationLevel("secondary"); // Default multi-level to secondary
    };

    window.addEventListener("schoolProfileChanged" as any, handleSchoolProfileChange);
    return () => window.removeEventListener("schoolProfileChanged" as any, handleSchoolProfileChange);
  }, []);

  // Get school config (use custom if available, otherwise use default)
  const schoolConfig = useMemo(() => {
    if (customConfig) {
      return customConfig;
    }
    return getSchoolConfig(schoolId);
  }, [customConfig, schoolId]);

  // Always generate dynamic timetable based on selections and custom config
  const activeTimetable = useMemo(() => {
    console.log('🔄 [TimeTable] Generating timetable...');
    console.log('📝 [TimeTable] Current state:', {
      hasCustomConfig: !!customConfig,
      currentWeek,
      selectedYear,
      schoolId,
      educationLevel
    });

    // Create a temporary config ID that includes custom settings
    const effectiveSchoolId = customConfig ? 'custom' : schoolId;
    const timetable = generateDynamicTimetable(currentWeek, selectedYear, effectiveSchoolId, educationLevel);

    // If using custom config, regenerate with custom days
    if (customConfig) {
      console.log('✅ [TimeTable] Using CUSTOM configuration');
      const timeSlots = generateTimeSlots(customConfig);
      console.log('🕐 [TimeTable] Generated time slots:', timeSlots);
      const generatedTimetable = generateDynamicTimetableWithConfig(currentWeek, selectedYear, customConfig, educationLevel);
      console.log('📅 [TimeTable] Generated timetable with', generatedTimetable.length, 'days');
      if (generatedTimetable.length > 0) {
        console.log('🔍 [TimeTable] First day periods:', generatedTimetable[0].periods.map(p => p.time));
      }
      return generatedTimetable;
    }

    console.log('ℹ️ [TimeTable] Using DEFAULT school configuration');
    return timetable;
  }, [currentWeek, selectedYear, schoolId, customConfig, educationLevel]);

  const yearOptions = [
    { label: "This Year", value: "this-year" },
    { label: "Last Year", value: "last-year" },
    { label: "2 Years Ago", value: "2-years-ago" },
  ];

  // Calculate total weeks in a year (52 weeks)
  const totalWeeks = 52;

  const handlePreviousWeek = () => {
    if (currentWeek > 1) {
      setCurrentWeek(currentWeek - 1);
    }
  };

  const handleNextWeek = () => {
    if (currentWeek < totalWeeks) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  const handleWeekChange = (value: string | number) => {
    setCurrentWeek(Number(value));
  };

  // Generate week options for dropdown
  const weekOptions = Array.from({ length: totalWeeks }, (_, i) => ({
    label: `Week ${i + 1}`,
    value: i + 1,
  }));

  if (!activeTimetable || activeTimetable.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 midnight:border-cyan-500/30 purple:border-pink-500/30 p-8">
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 midnight:from-cyan-950/30 midnight:to-blue-950/30 purple:from-pink-950/30 purple:to-purple-950/30 mb-6 mx-auto">
            <Clock className="w-12 h-12 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">
            No Timetable Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 max-w-sm mx-auto">
            Student timetable will be displayed here once available
          </p>
        </div>
      </div>
    );
  }

  // Color palettes for different subjects
  const subjectColors: Record<string, { bg: string; text: string }> = {
    // Secondary subjects
    Mathematics: {
      bg: "bg-pink-50 dark:bg-pink-900/30 midnight:bg-pink-900/30 purple:bg-pink-900/30",
      text: "text-pink-700 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400",
    },
    Maths: {
      bg: "bg-pink-50 dark:bg-pink-900/30 midnight:bg-pink-900/30 purple:bg-pink-900/30",
      text: "text-pink-700 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400",
    },
    Spanish: {
      bg: "bg-cyan-50 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30",
      text: "text-cyan-700 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400",
    },
    Computer: {
      bg: "bg-green-50 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30",
      text: "text-green-700 dark:text-green-400 midnight:text-green-400 purple:text-green-400",
    },
    "Computer Science": {
      bg: "bg-green-50 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30",
      text: "text-green-700 dark:text-green-400 midnight:text-green-400 purple:text-green-400",
    },
    Physics: {
      bg: "bg-amber-50 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
    },
    English: {
      bg: "bg-purple-50 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30",
      text: "text-purple-700 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400",
    },
    Science: {
      bg: "bg-blue-50 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400",
    },
    Chemistry: {
      bg: "bg-gray-50 dark:bg-gray-800/30 midnight:bg-gray-800/30 purple:bg-gray-800/30",
      text: "text-gray-700 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400",
    },
    History: {
      bg: "bg-orange-50 dark:bg-orange-900/30 midnight:bg-orange-900/30 purple:bg-orange-900/30",
      text: "text-orange-700 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400",
    },
    Geography: {
      bg: "bg-teal-50 dark:bg-teal-900/30 midnight:bg-teal-900/30 purple:bg-teal-900/30",
      text: "text-teal-700 dark:text-teal-400 midnight:text-teal-400 purple:text-teal-400",
    },
    Biology: {
      bg: "bg-lime-50 dark:bg-lime-900/30 midnight:bg-lime-900/30 purple:bg-lime-900/30",
      text: "text-lime-700 dark:text-lime-400 midnight:text-lime-400 purple:text-lime-400",
    },
    Economics: {
      bg: "bg-emerald-50 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30",
      text: "text-emerald-700 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400",
    },
    Literature: {
      bg: "bg-violet-50 dark:bg-violet-900/30 midnight:bg-violet-900/30 purple:bg-violet-900/30",
      text: "text-violet-700 dark:text-violet-400 midnight:text-violet-400 purple:text-violet-400",
    },
    // Primary subjects
    "Basic Science": {
      bg: "bg-sky-50 dark:bg-sky-900/30 midnight:bg-sky-900/30 purple:bg-sky-900/30",
      text: "text-sky-700 dark:text-sky-400 midnight:text-sky-400 purple:text-sky-400",
    },
    "Social Studies": {
      bg: "bg-amber-50 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400",
    },
    "Creative Arts": {
      bg: "bg-fuchsia-50 dark:bg-fuchsia-900/30 midnight:bg-fuchsia-900/30 purple:bg-fuchsia-900/30",
      text: "text-fuchsia-700 dark:text-fuchsia-400 midnight:text-fuchsia-400 purple:text-fuchsia-400",
    },
    "Physical Education": {
      bg: "bg-rose-50 dark:bg-rose-900/30 midnight:bg-rose-900/30 purple:bg-rose-900/30",
      text: "text-rose-700 dark:text-rose-400 midnight:text-rose-400 purple:text-rose-400",
    },
    "Religious Studies": {
      bg: "bg-indigo-50 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30",
      text: "text-indigo-700 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400",
    },
    "Civic Education": {
      bg: "bg-yellow-50 dark:bg-yellow-900/30 midnight:bg-yellow-900/30 purple:bg-yellow-900/30",
      text: "text-yellow-700 dark:text-yellow-400 midnight:text-yellow-400 purple:text-yellow-400",
    },
    Handwriting: {
      bg: "bg-slate-50 dark:bg-slate-900/30 midnight:bg-slate-900/30 purple:bg-slate-900/30",
      text: "text-slate-700 dark:text-slate-400 midnight:text-slate-400 purple:text-slate-400",
    },
    Reading: {
      bg: "bg-red-50 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30",
      text: "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
    },
    // Tertiary subjects
    "Advanced Programming": {
      bg: "bg-emerald-50 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30",
      text: "text-emerald-700 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400",
    },
    "Data Structures": {
      bg: "bg-cyan-50 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30",
      text: "text-cyan-700 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400",
    },
    "Database Systems": {
      bg: "bg-blue-50 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400",
    },
    "Web Development": {
      bg: "bg-orange-50 dark:bg-orange-900/30 midnight:bg-orange-900/30 purple:bg-orange-900/30",
      text: "text-orange-700 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400",
    },
    "Software Engineering": {
      bg: "bg-purple-50 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30",
      text: "text-purple-700 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400",
    },
    "Operating Systems": {
      bg: "bg-gray-50 dark:bg-gray-800/30 midnight:bg-gray-800/30 purple:bg-gray-800/30",
      text: "text-gray-700 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400",
    },
    "Computer Networks": {
      bg: "bg-teal-50 dark:bg-teal-900/30 midnight:bg-teal-900/30 purple:bg-teal-900/30",
      text: "text-teal-700 dark:text-teal-400 midnight:text-teal-400 purple:text-teal-400",
    },
    "Artificial Intelligence": {
      bg: "bg-pink-50 dark:bg-pink-900/30 midnight:bg-pink-900/30 purple:bg-pink-900/30",
      text: "text-pink-700 dark:text-pink-400 midnight:text-pink-400 purple:text-pink-400",
    },
    "Machine Learning": {
      bg: "bg-violet-50 dark:bg-violet-900/30 midnight:bg-violet-900/30 purple:bg-violet-900/30",
      text: "text-violet-700 dark:text-violet-400 midnight:text-violet-400 purple:text-violet-400",
    },
    Cybersecurity: {
      bg: "bg-red-50 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30",
      text: "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
    },
    // Special period types
    "Free Period": {
      bg: "bg-slate-50 dark:bg-slate-800/30 midnight:bg-slate-800/30 purple:bg-slate-800/30 border-2 border-dashed border-slate-300 dark:border-slate-600 midnight:border-slate-600 purple:border-slate-600",
      text: "text-slate-600 dark:text-slate-400 midnight:text-slate-400 purple:text-slate-400 italic",
    },
    "Study Hall": {
      bg: "bg-indigo-50 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30 border-2 border-indigo-200 dark:border-indigo-700 midnight:border-indigo-700 purple:border-indigo-700",
      text: "text-indigo-700 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400",
    },
    "Assembly": {
      bg: "bg-violet-50 dark:bg-violet-900/30 midnight:bg-violet-900/30 purple:bg-violet-900/30 border-2 border-violet-200 dark:border-violet-700 midnight:border-violet-700 purple:border-violet-700",
      text: "text-violet-700 dark:text-violet-400 midnight:text-violet-400 purple:text-violet-400",
    },
    "Activity Period": {
      bg: "bg-fuchsia-50 dark:bg-fuchsia-900/30 midnight:bg-fuchsia-900/30 purple:bg-fuchsia-900/30 border-2 border-fuchsia-200 dark:border-fuchsia-700 midnight:border-fuchsia-700 purple:border-fuchsia-700",
      text: "text-fuchsia-700 dark:text-fuchsia-400 midnight:text-fuchsia-400 purple:text-fuchsia-400",
    },
  };

  const getSubjectColor = (subject: string) => {
    return subjectColors[subject] || subjectColors.Science;
  };

  // Get all class periods (non-break periods)
  const allClassPeriods = activeTimetable[0].periods.filter((p) => p.type !== "break");

  // Get break periods for the legend
  const breaks = activeTimetable[0].periods.filter((p) => p.type === "break");

  return (
    <div className="space-y-6">
      {/* Timetable Grid with integrated header */}
      <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-lg overflow-hidden">
        {/* Desktop Header Section */}
        <div className="hidden md:block px-6 py-2 border-b border-gray-200/50 dark:border-gray-800/50 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-900/5 dark:to-indigo-900/5 midnight:from-cyan-900/5 midnight:to-blue-900/5 purple:from-pink-900/5 purple:to-purple-900/5">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Title */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Timetable
              </h2>
            </div>

            {/* Center: Week Navigation */}
            <div className="flex items-center gap-1.5">
              {/* Previous Week Button */}
              <button
                onClick={handlePreviousWeek}
                disabled={currentWeek === 1}
                className="p-1 rounded-md bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {/* Week Selector */}
              <CustomDropdown
                value={currentWeek}
                options={weekOptions}
                onChange={handleWeekChange}
                variant="blue"
                className="w-28"
              />

              {/* Next Week Button */}
              <button
                onClick={handleNextWeek}
                disabled={currentWeek === totalWeeks}
                className="p-1 rounded-md bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Current Week Info */}
              <div className="text-xs font-bold text-gray-800 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 ml-1 hidden sm:block">
                Week {currentWeek} of {totalWeeks}
              </div>
            </div>

            {/* Right: Year Selector */}
            <CustomDropdown
              value={selectedYear}
              options={yearOptions}
              onChange={(value) => setSelectedYear(value as string)}
              variant="blue"
              className="w-32 flex-shrink-0"
            />
          </div>
        </div>

        {/* Mobile Header Section */}
        <div className="md:hidden px-3 py-3 space-y-2.5 border-b border-gray-200/50 dark:border-gray-800/50 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-gradient-to-br from-blue-50/40 to-indigo-50/40 dark:from-blue-900/10 dark:to-indigo-900/10 midnight:from-cyan-900/10 midnight:to-blue-900/10 purple:from-pink-900/10 purple:to-purple-900/10">
          {/* Title */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
            </div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Timetable
            </h2>
          </div>

          {/* Year Selector */}
          <MobileDropdown
            value={selectedYear}
            options={yearOptions}
            onChange={(value) => setSelectedYear(value as string)}
            icon={<Calendar className="w-4 h-4" />}
          />

          {/* Week Navigation with Dropdown */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePreviousWeek}
              disabled={currentWeek === 1}
              className="flex-shrink-0 p-2 rounded-lg bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border-2 border-blue-200/60 dark:border-blue-800/60 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-blue-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <MobileDropdown
              value={currentWeek}
              options={weekOptions}
              onChange={handleWeekChange}
              icon={<Calendar className="w-4 h-4" />}
              className="flex-1"
            />

            <button
              onClick={handleNextWeek}
              disabled={currentWeek === totalWeeks}
              className="flex-shrink-0 p-2 rounded-lg bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border-2 border-blue-200/60 dark:border-blue-800/60 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-blue-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95 shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timetable Content */}
        <div className="px-0 py-3 sm:p-6">
            {/* Week Selection Info Banner - Hidden on Mobile */}
            <div className="hidden md:block mb-4 px-3 py-2 bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 rounded-lg border border-blue-100/30 dark:border-blue-800/20 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
                    Week {currentWeek}
                    <span className="hidden sm:inline"> • {selectedYear === "this-year" ? "This Year" : selectedYear === "last-year" ? "Last Year" : "2 Years Ago"}</span>
                  </span>
                </div>
                <span className="text-[11px] text-blue-600/80 dark:text-blue-400/80 midnight:text-cyan-400/80 purple:text-pink-400/80 font-medium sm:ml-auto">
                  {/* Calculate date range for the week */}
                  {(() => {
                    const now = new Date();
                    const startOfYear = new Date(now.getFullYear(), 0, 1);
                    const weekStart = new Date(startOfYear);
                    weekStart.setDate(startOfYear.getDate() + (currentWeek - 1) * 7);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                  })()}
                </span>
              </div>
            </div>

            {/* Mobile Day Selector with Date Range */}
            <div className="md:hidden px-3 mb-4 space-y-2.5">
              {/* Date Range Info */}
              <div className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50/60 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 rounded-lg border border-blue-100/40 dark:border-blue-800/20 midnight:border-cyan-500/20 purple:border-pink-500/20">
                <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
                  {(() => {
                    const now = new Date();
                    const startOfYear = new Date(now.getFullYear(), 0, 1);
                    const weekStart = new Date(startOfYear);
                    weekStart.setDate(startOfYear.getDate() + (currentWeek - 1) * 7);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                  })()}
                </span>
              </div>

              {/* Day Selector Dropdown */}
              <MobileDropdown
                value={selectedMobileDay}
                options={activeTimetable.map((daySchedule, index) => ({
                  label: daySchedule.day,
                  value: index,
                }))}
                onChange={(value) => setSelectedMobileDay(Number(value))}
                icon={<Calendar className="w-4 h-4" />}
              />
            </div>

            {/* Days Header Row - Hidden on mobile */}
            <div className={`hidden md:grid mb-4 sm:mb-6 ${
              schoolConfig.daysOfWeek.length === 5
                ? "md:grid-cols-5 gap-2 sm:gap-3 lg:gap-4"
                : schoolConfig.daysOfWeek.length === 6
                ? "md:grid-cols-6 gap-2 sm:gap-3 lg:gap-4"
                : "md:grid-cols-4 lg:grid-cols-7 gap-1.5 md:gap-2 lg:gap-3 xl:gap-4"
            }`}>
              {activeTimetable.map((daySchedule) => (
                <div
                  key={daySchedule.day}
                  className="relative"
                >
                  <div className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-900/10 dark:to-indigo-900/10 midnight:from-cyan-900/10 midnight:to-blue-900/10 purple:from-pink-900/10 purple:to-purple-900/10 rounded-lg py-1.5 sm:py-2.5 px-2 sm:px-3 border border-blue-100/50 dark:border-blue-800/20 midnight:border-cyan-500/20 purple:border-pink-500/20">
                    <h3 className="text-[10px] sm:text-xs font-bold text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 text-center uppercase tracking-wider truncate">
                      {daySchedule.day}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Period Rows */}
            {allClassPeriods.map((_, periodIndex) => {
              return (
                <div
                  key={periodIndex}
                  className={`hidden md:grid mb-3 sm:mb-4 last:mb-0 ${
                    schoolConfig.daysOfWeek.length === 5
                      ? "md:grid-cols-5 gap-2 sm:gap-3 lg:gap-4"
                      : schoolConfig.daysOfWeek.length === 6
                      ? "md:grid-cols-6 gap-2 sm:gap-3 lg:gap-4"
                      : "md:grid-cols-4 lg:grid-cols-7 gap-1.5 md:gap-2 lg:gap-3 xl:gap-4"
                  }`}
                >
                  {/* Day Columns */}
                  {activeTimetable.map((daySchedule) => {
                    const classPeriods = daySchedule.periods.filter((p) => p.type !== "break");
                    const period = classPeriods[periodIndex];

                    if (!period) return <div key={daySchedule.day} className=""></div>;

                    // Check if there's a custom event for this slot
                    const customEvent = customEvents.find(
                      (e) => e.dayOfWeek === daySchedule.day && e.periodIndex === periodIndex
                    );

                    // Use custom event data if available
                    const displayPeriod = customEvent ? {
                      ...period,
                      subject: customEvent.subject,
                      teacher: customEvent.teacher || "",
                      teacherAvatar: customEvent.teacherAvatar,
                    } : period;

                    const colors = getSubjectColor(displayPeriod.subject);

                    return (
                      <div key={daySchedule.day}>
                        <TimetableCell
                          time={displayPeriod.time}
                          subject={displayPeriod.subject}
                          teacher={displayPeriod.teacher}
                          teacherAvatar={displayPeriod.teacherAvatar}
                          backgroundColor={colors.bg}
                          textColor={colors.text}
                          totalDays={schoolConfig.daysOfWeek.length}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Mobile View - 2-Column Grid Layout */}
            <div className="md:hidden grid grid-cols-2 gap-2 px-4">
              {allClassPeriods.map((_, periodIndex) => {
                const daySchedule = activeTimetable[selectedMobileDay];
                const classPeriods = daySchedule.periods.filter((p) => p.type !== "break");
                const period = classPeriods[periodIndex];

                if (!period) return null;

                // Check if there's a custom event for this slot
                const customEvent = customEvents.find(
                  (e) => e.dayOfWeek === daySchedule.day && e.periodIndex === periodIndex
                );

                // Use custom event data if available
                const displayPeriod = customEvent ? {
                  ...period,
                  subject: customEvent.subject,
                  teacher: customEvent.teacher || "",
                  teacherAvatar: customEvent.teacherAvatar,
                } : period;

                const colors = getSubjectColor(displayPeriod.subject);

                return (
                  <div key={periodIndex}>
                    <TimetableCell
                      time={displayPeriod.time}
                      subject={displayPeriod.subject}
                      teacher={displayPeriod.teacher}
                      teacherAvatar={displayPeriod.teacherAvatar}
                      backgroundColor={colors.bg}
                      textColor={colors.text}
                    />
                  </div>
                );
              })}
            </div>
        </div>
      </div>

      {/* Break Times */}
      {breaks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {breaks.map((breakPeriod, index) => {
            // Assign colors and icons based on break type
            let variant: "blue" | "orange" | "purple" = "blue";
            let icon = Coffee;
            const label = breakPeriod.subject;

            if (label === "Morning Break") {
              variant = "blue";
              icon = Coffee;
            } else if (label === "Lunch") {
              variant = "orange";
              icon = Utensils;
            } else if (label === "Evening Break") {
              variant = "purple";
              icon = Moon;
            }

            return (
              <BreakCard
                key={index}
                label={label}
                time={breakPeriod.time}
                icon={icon}
                variant={variant}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
