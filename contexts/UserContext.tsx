"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

/**
 * User Roles as per PRD (Section 6: User Roles & Permissions)
 *
 * | Role         | Scope           | Description                                    |
 * |--------------|-----------------|------------------------------------------------|
 * | Super Admin  | Global          | Manages all tenants & configurations           |
 * | School Admin | Institution     | Oversees academics, finance, operations        |
 * | Branch Admin | Branch          | Localized management                           |
 * | Teacher      | Class/Subject   | Attendance, grading, reporting                 |
 * | Student      | Self            | Access results, fees, transcripts              |
 * | Parent       | Linked Students | Monitor progress, make payments                |
 * | Custom Roles | Configurable    | Vendors, franchise partners                    |
 */
export type UserRole =
  | "super_admin"    // Global - Manages all tenants
  | "school_admin"   // Institution - Oversees academics, finance, operations
  | "branch_admin"   // Branch - Localized management
  | "teacher"        // Class/Subject - Attendance, grading, reporting
  | "student"        // Self - Access results, fees, transcripts
  | "parent"         // Linked Students - Monitor progress, make payments
  | "custom";        // Configurable - Vendors, franchise partners

// Staff types for teachers/lecturers
export type StaffType = "lecturer" | "teaching_assistant";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  tenantId: string; // Which tenant this user belongs to
  branchId?: string; // For branch admins
  // For teachers/lecturers
  staffType?: StaffType; // Whether lecturer or teaching assistant
  department?: string; // Department for staff
  assignedClasses?: string[];
  assignedSubjects?: string[]; // For primary/secondary teachers - subject names
  assignedCourses?: string[]; // For tertiary lecturers - course IDs (e.g., "csc101", "mth101")
  // For students/parents
  linkedStudentIds?: string[];
  // Custom role permissions
  customPermissions?: string[];
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  // Role checks
  isSuperAdmin: boolean;
  isSchoolAdmin: boolean;
  isBranchAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  isParent: boolean;
  // Admin checks (any admin role)
  isAnyAdmin: boolean;
  // Methods
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock user for development (Super Admin by default for testing)
// When role is "teacher", staffType determines if lecturer or TA
const MOCK_USER: User = {
  id: "user-001",
  email: "admin@educo.africa",
  firstName: "System",
  lastName: "Administrator",
  avatar: "https://i.pravatar.cc/150?img=68",
  role: "super_admin",
  tenantId: "educo-default",
  // Staff fields (used when role is "teacher")
  staffType: "lecturer",
  department: "Administration",
  // Classes and subjects assigned to this teacher/TA
  assignedClasses: ["JSS 1", "JSS 2", "SSS 1", "100 Level", "200 Level"], // Classes they can take attendance for
  assignedSubjects: ["Mathematics", "English Language"], // For primary/secondary
  assignedCourses: ["csc101", "csc201", "mth101"], // For tertiary - matches course IDs in tenant config
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount (mock auth)
  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("currentUser");
      const savedRole = localStorage.getItem("userRole");

      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser) as User;
          setUser(parsedUser);
        } catch {
          // Use mock user with saved role if available
          setUser({
            ...MOCK_USER,
            role: (savedRole as UserRole) || MOCK_USER.role,
          });
        }
      } else {
        // Default to mock user for development
        setUser({
          ...MOCK_USER,
          role: (savedRole as UserRole) || MOCK_USER.role,
        });
      }
      setIsLoading(false);
    };

    loadUser();

    // Listen for role changes from settings
    const handleRoleChange = (event: CustomEvent) => {
      const newRole = event.detail?.role as UserRole;
      if (newRole && user) {
        setUser({ ...user, role: newRole });
        localStorage.setItem("userRole", newRole);
      }
    };

    window.addEventListener("userRoleChanged", handleRoleChange as EventListener);
    return () => {
      window.removeEventListener("userRoleChanged", handleRoleChange as EventListener);
    };
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userRole");
  };

  // Role checks
  const isSuperAdmin = user?.role === "super_admin";
  const isSchoolAdmin = user?.role === "school_admin";
  const isBranchAdmin = user?.role === "branch_admin";
  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";
  const isParent = user?.role === "parent";
  const isAnyAdmin = isSuperAdmin || isSchoolAdmin || isBranchAdmin;

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isSuperAdmin,
        isSchoolAdmin,
        isBranchAdmin,
        isTeacher,
        isStudent,
        isParent,
        isAnyAdmin,
        setUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
