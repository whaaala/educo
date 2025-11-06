// Calendar permissions and event management types

export type Permission = "view" | "create" | "edit" | "delete";

// User information
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "teacher" | "student" | "parent";
}

export interface UserPermissions {
  userId: string;
  role: "admin" | "teacher" | "student" | "parent";
  permissions: Permission[];
}

// User-specific permission override (for granular control)
export interface UserPermissionOverride {
  userId: string;
  userName: string;
  permissions: Permission[];
  overrideRole: boolean; // If true, ignore role-based permissions
}

export interface CalendarEvent {
  id: string;
  dayOfWeek: string; // e.g., "Monday"
  periodIndex: number; // Which period slot (0-based)
  subject: string;
  teacher?: string;
  teacherAvatar?: string;
  type: "class" | "break" | "free" | "assembly" | "study" | "custom";
  description?: string;
  isCustom: boolean; // Whether this is a user-created/modified event
  createdBy?: string; // User ID who created this event
  modifiedBy?: string; // User ID who last modified this event
  createdAt?: string;
  modifiedAt?: string;
  userId?: string; // Owner of this event (for user-specific events)
}

// Role-based permission presets
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: ["view", "create", "edit", "delete"],
  teacher: ["view", "create", "edit"],
  student: ["view"],
  parent: ["view"],
};

// Permission checker
export function hasPermission(
  userPermissions: UserPermissions,
  requiredPermission: Permission
): boolean {
  return userPermissions.permissions.includes(requiredPermission);
}

// Get permissions for a user role
export function getPermissionsForRole(role: UserPermissions["role"]): Permission[] {
  return ROLE_PERMISSIONS[role] || ["view"];
}

// Check if user can perform an action
export function canPerformAction(
  userRole: UserPermissions["role"],
  action: Permission
): boolean {
  const permissions = getPermissionsForRole(userRole);
  return permissions.includes(action);
}

// Mock users for testing (in real app, this would come from database)
export const MOCK_USERS: User[] = [
  {
    id: "user-001",
    name: "John Smith",
    email: "john.smith@school.com",
    avatar: "/avatars/teacher-1.jpg",
    role: "admin",
  },
  {
    id: "user-002",
    name: "Sarah Johnson",
    email: "sarah.johnson@school.com",
    avatar: "/avatars/teacher-2.jpg",
    role: "teacher",
  },
  {
    id: "user-003",
    name: "Michael Brown",
    email: "michael.brown@school.com",
    avatar: "/avatars/teacher-3.jpg",
    role: "teacher",
  },
  {
    id: "user-004",
    name: "Emily Davis",
    email: "emily.davis@school.com",
    avatar: "/avatars/student-1.jpg",
    role: "student",
  },
  {
    id: "user-005",
    name: "David Wilson",
    email: "david.wilson@school.com",
    avatar: "/avatars/student-2.jpg",
    role: "student",
  },
];

// Get user-specific permissions (checks overrides first, then role-based)
export function getUserPermissions(userId: string): Permission[] {
  const overrides = loadUserPermissionOverrides();
  const override = overrides.find((o) => o.userId === userId);

  if (override && override.overrideRole) {
    return override.permissions;
  }

  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) return ["view"];

  return getPermissionsForRole(user.role);
}

// Load user permission overrides from localStorage
export function loadUserPermissionOverrides(): UserPermissionOverride[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem("userPermissionOverrides");
  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("Failed to load user permission overrides:", error);
    return [];
  }
}

// Save user permission overrides to localStorage
export function saveUserPermissionOverrides(overrides: UserPermissionOverride[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("userPermissionOverrides", JSON.stringify(overrides));
}

// Get events for a specific user
export function getUserEvents(userId: string): CalendarEvent[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(`customCalendarEvents_${userId}`);
  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("Failed to load user events:", error);
    return [];
  }
}

// Save events for a specific user
export function saveUserEvents(userId: string, events: CalendarEvent[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`customCalendarEvents_${userId}`, JSON.stringify(events));
}

// Example mock user (in real app, this would come from auth context)
export function getMockUser(role: UserPermissions["role"] = "admin"): UserPermissions {
  const user = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
  return {
    userId: user.id,
    role: user.role,
    permissions: getUserPermissions(user.id),
  };
}

// Get current user (mock - in real app, this would come from auth context)
export function getCurrentUser(): User {
  if (typeof window === "undefined") return MOCK_USERS[0];

  const savedUserId = localStorage.getItem("currentUserId");
  if (savedUserId) {
    const user = MOCK_USERS.find((u) => u.id === savedUserId);
    if (user) return user;
  }

  return MOCK_USERS[0];
}

// Set current user (mock - in real app, this would be handled by auth)
export function setCurrentUser(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("currentUserId", userId);
}
