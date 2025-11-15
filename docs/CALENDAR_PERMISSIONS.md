# Calendar Event Management & Permissions System

This document explains the calendar event management and permission system for the timetable feature.

## Overview

The timetable system now includes:
- **Permission-based access control** for creating, editing, and deleting calendar events
- **Custom event management** allowing users to modify timetable periods
- **Role-based permissions** (Admin, Teacher, Student, Parent)
- **Persistent storage** for custom events and configurations

## User Roles and Permissions

### Available Roles

1. **Admin**
   - Permissions: `view`, `create`, `edit`, `delete`
   - Full access to all calendar management features
   - Can modify any event on the timetable

2. **Teacher**
   - Permissions: `view`, `create`, `edit`
   - Can view, create, and edit events
   - Cannot delete events

3. **Student**
   - Permissions: `view` only
   - Can view the timetable
   - Cannot create, edit, or delete events

4. **Parent**
   - Permissions: `view` only
   - Can view the timetable
   - Cannot create, edit, or delete events

## Features

### 1. Timetable Settings Modal

**Access**: Click the Settings icon (gear) in the timetable header

**Features**:
- Configure calendar type (5-day, 6-day, 7-day week)
- Set week structure (standard, rotating, block)
- Define periods per day and period duration
- Configure school start/end times
- Manage break schedules (morning, lunch, evening)
- Set up free periods

**Tabs**:
- **General**: Calendar type, week structure, periods, and timing
- **Breaks**: Break time configuration
- **Free Periods**: Add/remove free periods with custom labels

### 2. Event Management Modal

**Access**: Click on any timetable cell (when you have edit permissions)

**Features**:
- **Create Mode**: Click on an empty or existing cell to create a new event
- **Edit Mode**: Modify existing events
- **Delete**: Remove custom events (admin only)

**Event Properties**:
- **Subject/Title**: Name of the event (required)
- **Event Type**: class, free, study, assembly, custom
- **Teacher**: Teacher name (for class type events)
- **Description**: Additional notes

### 3. Role Selector

**Location**: Timetable header (visible on larger screens)

**Purpose**: Simulate different user roles to test permission-based access

**Options**:
- Admin
- Teacher
- Student
- Parent

## Using the System

### Creating a Custom Event

1. **Select a role** with create/edit permissions (Admin or Teacher)
2. **Click on a timetable cell** for the period you want to modify
3. **Fill in the event details**:
   - Subject/Title (required)
   - Event Type
   - Teacher (if applicable)
   - Description (optional)
4. **Click "Create Event"**

The event will be saved and displayed on the timetable. Custom events are stored in localStorage and persist across sessions.

### Editing an Event

1. **Ensure you have edit permissions** (Admin or Teacher)
2. **Click on the cell** with the event you want to edit
3. **Modify the event details**
4. **Click "Save Changes"**

### Deleting an Event

1. **Ensure you have delete permissions** (Admin only)
2. **Click on the cell** with the event you want to delete
3. **Click "Delete Event"** in the modal
4. **Confirm the deletion**

### Visual Indicators

- **Hover Effect**: Cells with edit permissions show a blue ring on hover
- **Edit Icon**: A small edit icon appears in the top-right corner of editable cells on hover
- **Custom Event Badge**: Custom events may have visual distinctions

## Data Persistence

### LocalStorage Keys

1. **customTimetableConfig**
   - Stores custom timetable configuration
   - Created when saving settings
   - Enables "Custom" option in school selector

2. **customCalendarEvents**
   - Stores all custom calendar events
   - Array of CalendarEvent objects
   - Persists across sessions

### Data Structure

```typescript
// Custom Event Structure
{
  id: string;
  dayOfWeek: string; // "Monday", "Tuesday", etc.
  periodIndex: number; // 0-based index
  subject: string;
  teacher?: string;
  teacherAvatar?: string;
  type: "class" | "break" | "free" | "assembly" | "study" | "custom";
  description?: string;
  isCustom: boolean;
  createdBy?: string;
  modifiedBy?: string;
  createdAt?: string;
  modifiedAt?: string;
}
```

## Permission Checking

### Client-Side Permission Check

```typescript
// Check if user can perform an action
const canEdit = canPerformAction(userRole, "edit");
const canCreate = canPerformAction(userRole, "create");
const canDelete = canPerformAction(userRole, "delete");
```

### Permission Denial

When a user without proper permissions attempts to create or edit an event:
- A "Permission Denied" modal is displayed
- The action is blocked
- The user is informed of the required permission

## Integration with Real Authentication

The current system uses mock permissions. To integrate with a real authentication system:

1. **Replace Mock User**:
```typescript
// Instead of:
const userPermissions = getMockUser(userRole);

// Use:
const userPermissions = useAuth().user.permissions;
```

2. **Backend Validation**:
- Add server-side permission checks
- Validate all create/edit/delete operations
- Store user IDs for audit trails

3. **Database Storage**:
- Replace localStorage with database API calls
- Store events in database with user associations
- Implement proper access control

## Examples

### Example 1: Admin Creating a Special Assembly

1. Role: Admin
2. Action: Click on Monday, Period 1
3. Fill in:
   - Subject: "Morning Assembly"
   - Type: assembly
   - Description: "Weekly school assembly"
4. Result: Assembly appears on timetable for Monday Period 1

### Example 2: Teacher Creating Study Hall

1. Role: Teacher
2. Action: Click on Friday, Period 7
3. Fill in:
   - Subject: "Study Hall"
   - Type: study
   - Description: "End of week study session"
4. Result: Study hall appears on timetable for Friday Period 7

### Example 3: Student Viewing Only

1. Role: Student
2. Action: Click on any cell
3. Result: No modal appears (no edit permission)
4. Experience: Read-only view of timetable

## Security Considerations

### Current Implementation (Development)

- Client-side permission checks only
- localStorage for data persistence
- Mock user authentication
- Suitable for development/testing

### Production Recommendations

1. **Server-Side Validation**:
   - Validate all permissions on the backend
   - Never trust client-side permission checks
   - Implement proper authentication middleware

2. **Data Security**:
   - Store sensitive data in database
   - Use encrypted connections (HTTPS)
   - Implement CSRF protection

3. **Audit Trail**:
   - Log all create/edit/delete operations
   - Track user actions with timestamps
   - Maintain version history of events

4. **Access Control**:
   - Implement row-level security
   - Use JWT tokens or session management
   - Validate permissions on every API call

## Troubleshooting

### Custom Events Not Persisting

**Issue**: Events disappear after page reload

**Solutions**:
- Check browser's localStorage settings
- Ensure localStorage is not disabled
- Check browser console for errors

### Permission Denied When Expected Access

**Issue**: User with proper role cannot edit

**Solutions**:
- Verify role selector is set correctly
- Check permission configuration in [calendarPermissions.ts](../lib/calendarPermissions.ts)
- Clear browser cache and reload

### Modal Not Opening

**Issue**: Clicking cells doesn't open modal

**Solutions**:
- Verify role has edit permissions
- Check browser console for errors
- Ensure isEditable prop is passed correctly

## Future Enhancements

Potential improvements:
- Bulk event operations (copy week, duplicate events)
- Event templates and presets
- Recurring events across multiple weeks
- Export/import functionality
- Calendar sync with external systems
- Conflict detection for overlapping events
- Event approval workflow
- Email notifications for event changes

## Support

For questions or issues with the calendar permission system, please refer to:
- [Timetable Configuration Documentation](./TIMETABLE_CONFIG.md)
- Main application documentation
- Development team contact
