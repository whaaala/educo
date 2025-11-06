# Timetable Configuration System

This document explains how to configure and customize timetables for different schools with varying schedules.

## Overview

The timetable system supports multiple calendar types and configurations to accommodate different school schedules:

- **5-Day Week** (Monday-Friday)
- **6-Day Week** (Monday-Saturday)
- **7-Day Week** (Monday-Sunday)
- **Block Schedules** (longer periods, fewer classes per day)
- **Custom Break Schedules**

## Configuration Files

### Main Configuration File

Location: `lib/timetableConfig.ts`

This file contains:
- Calendar type definitions
- School-specific configurations
- Utility functions for generating time slots

## Calendar Types

### 1. 5-Day Week (Monday-Friday)

```typescript
{
  calendarType: "5-day",
  daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  periodsPerDay: 7,
  periodDuration: 45, // minutes
  schoolStartTime: "08:00",
  schoolEndTime: "15:30",
  breakSchedule: {
    morningBreak: { start: "10:30", end: "10:45" },
    lunch: { start: "12:15", end: "13:30" },
    eveningBreak: { start: "15:00", end: "15:15" }
  }
}
```

**Use Case**: Traditional schools with Monday-Friday schedules

### 2. 6-Day Week (Monday-Saturday)

```typescript
{
  calendarType: "6-day",
  daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  periodsPerDay: 6,
  periodDuration: 45,
  schoolStartTime: "08:00",
  schoolEndTime: "14:00",
  breakSchedule: {
    morningBreak: { start: "10:30", end: "10:45" },
    lunch: { start: "12:15", end: "13:00" }
  }
}
```

**Use Case**: Schools with Saturday classes (common in some countries)

### 3. Block Schedule

```typescript
{
  calendarType: "5-day",
  weekStructure: "block",
  daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  periodsPerDay: 4,
  periodDuration: 90, // 90-minute blocks
  schoolStartTime: "08:00",
  schoolEndTime: "13:00",
  breakSchedule: {
    morningBreak: { start: "10:30", end: "10:50" },
    lunch: { start: "12:30", end: "13:15" }
  }
}
```

**Use Case**: High schools using block scheduling with longer, fewer periods

## Adding a New School Configuration

### Step 1: Define School Config

In `lib/timetableConfig.ts`, add a new entry to `SCHOOL_CONFIGS`:

```typescript
export const SCHOOL_CONFIGS: Record<string, SchoolTimetableSettings> = {
  // Existing configs...

  "school-4": {
    schoolId: "school-4",
    schoolName: "Your School Name",
    config: {
      ...CALENDAR_CONFIGS["5-day"], // Use predefined or customize
      weekStructure: "standard",
      periodsPerDay: 8, // Override if needed
      // Add custom properties
    },
  },
};
```

### Step 2: Update TimeTable Component

In `components/students/TimeTable.tsx`, add the new school to the dropdown:

```typescript
<CustomDropdown
  value={selectedSchoolId}
  options={[
    { label: "5-Day (Mon-Fri)", value: "school-1" },
    { label: "6-Day (Mon-Sat)", value: "school-2" },
    { label: "Block Schedule", value: "school-3" },
    { label: "Your School", value: "school-4" }, // Add here
  ]}
  onChange={(value) => setSelectedSchoolId(value as string)}
  variant="blue"
  className="w-36 hidden md:block"
/>
```

## Configuration Properties

### TimetableConfig Interface

```typescript
interface TimetableConfig {
  calendarType: CalendarType; // "5-day" | "6-day" | "7-day"
  weekStructure: WeekStructure; // "standard" | "rotating" | "block"
  daysOfWeek: string[]; // Array of day names
  periodsPerDay: number; // Number of class periods per day
  periodDuration: number; // Duration in minutes
  includeBreaks: boolean; // Whether to show break times
  schoolStartTime: string; // "HH:MM" format
  schoolEndTime: string; // "HH:MM" format
  breakSchedule?: {
    morningBreak?: { start: string; end: string };
    lunch?: { start: string; end: string };
    eveningBreak?: { start: string; end: string };
  };
}
```

### Property Descriptions

- **calendarType**: Determines the number of days in the week
- **weekStructure**: Defines how the schedule is organized
- **daysOfWeek**: Array of day names to display
- **periodsPerDay**: Total number of class periods each day
- **periodDuration**: Length of each period in minutes
- **includeBreaks**: Toggle display of break time cards
- **schoolStartTime**: When the first period begins
- **schoolEndTime**: When the last period ends
- **breakSchedule**: Optional break times (morning, lunch, evening)

## Utility Functions

### `generateTimeSlots(config: TimetableConfig): string[]`

Generates an array of time slots based on the configuration.

```typescript
const timeSlots = generateTimeSlots(config);
// Returns: ["09:00 - 09:45 AM", "09:45 - 10:30 AM", ...]
```

### `getBreakPeriods(config: TimetableConfig): Array<{time: string; label: string}>`

Gets the break periods from the configuration.

```typescript
const breaks = getBreakPeriods(config);
// Returns: [
//   { time: "10:30 AM to 10:45 AM", label: "Morning Break" },
//   { time: "12:15 PM to 01:30 PM", label: "Lunch" }
// ]
```

### `getSchoolConfig(schoolId: string): TimetableConfig`

Retrieves the configuration for a specific school.

```typescript
const config = getSchoolConfig("school-1");
```

## Usage in Components

### Using TimeTable Component

```typescript
import TimeTable from "@/components/students/TimeTable";

// Default (5-day week)
<TimeTable />

// Specific school
<TimeTable schoolId="school-2" />
```

### Accessing Configuration

```typescript
import { getSchoolConfig } from "@/lib/timetableConfig";

const config = getSchoolConfig("school-1");
console.log(config.daysOfWeek); // ["Monday", "Tuesday", ...]
console.log(config.periodsPerDay); // 7
```

## Examples

### Example 1: Traditional High School (5-Day)

```typescript
{
  calendarType: "5-day",
  weekStructure: "standard",
  daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  periodsPerDay: 7,
  periodDuration: 45,
  schoolStartTime: "08:00",
  schoolEndTime: "15:30",
  includeBreaks: true,
  breakSchedule: {
    morningBreak: { start: "10:30", end: "10:45" },
    lunch: { start: "12:15", end: "13:30" }
  }
}
```

### Example 2: Saturday School (6-Day)

```typescript
{
  calendarType: "6-day",
  weekStructure: "standard",
  daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  periodsPerDay: 6,
  periodDuration: 45,
  schoolStartTime: "08:00",
  schoolEndTime: "14:00",
  includeBreaks: true,
  breakSchedule: {
    morningBreak: { start: "10:30", end: "10:45" },
    lunch: { start: "12:15", end: "13:00" }
  }
}
```

### Example 3: Block Schedule

```typescript
{
  calendarType: "5-day",
  weekStructure: "block",
  daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  periodsPerDay: 4,
  periodDuration: 90, // 1.5 hour blocks
  schoolStartTime: "08:00",
  schoolEndTime: "13:00",
  includeBreaks: true,
  breakSchedule: {
    morningBreak: { start: "10:30", end: "10:50" },
    lunch: { start: "12:30", end: "13:15" }
  }
}
```

## Responsive Grid Layout

The timetable automatically adjusts its grid layout based on the number of days:

- **5-Day**: `grid-cols-3 sm:grid-cols-5` (3 columns mobile, 5 columns desktop)
- **6-Day**: `grid-cols-3 sm:grid-cols-6` (3 columns mobile, 6 columns desktop)
- **7-Day**: `grid-cols-3 sm:grid-cols-7` (3 columns mobile, 7 columns desktop)

## Customization Tips

1. **Adjust Period Duration**: Change `periodDuration` to match your school's class length
2. **Add/Remove Breaks**: Modify `breakSchedule` to include only the breaks you need
3. **Change Start/End Times**: Update `schoolStartTime` and `schoolEndTime` for your schedule
4. **Custom Days**: Modify `daysOfWeek` array for non-traditional schedules

## Future Enhancements

Potential additions to the system:
- Rotating schedules (A/B day schedules)
- Different schedules per grade level
- Special event days (assemblies, early dismissal)
- Integration with school database for real-time updates
- Teacher-specific schedules
- Room assignments

## Support

For questions or issues with the timetable configuration system, please contact the development team or refer to the main documentation.
