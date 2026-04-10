"use client";

import { useState } from "react";
import {
  Shield,
  ChevronUp,
  Lock,
  CheckSquare,
  Smartphone,
} from "lucide-react";
import FormDropdown from "@/components/shared/FormDropdown";
import TagInput from "@/components/shared/TagInput";
import { ValidationErrors } from "@/lib/validation";

interface RolePermissionsSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: ValidationErrors;
}

export default function RolePermissionsSection({
  formData,
  onChange,
  errors = {},
}: RolePermissionsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const systemRoles = [
    { value: "Teacher", label: "Teacher" },
    { value: "Head of Department", label: "Head of Department" },
    { value: "Admin", label: "Admin" },
    { value: "Super Admin", label: "Super Admin" },
    { value: "Finance Officer", label: "Finance Officer" },
    { value: "Exam Officer", label: "Exam Officer" },
    { value: "Librarian", label: "Librarian" },
    { value: "IT Support", label: "IT Support" },
    { value: "Custom", label: "Custom" },
  ];

  const moduleOptions = [
    "Students Management",
    "Teachers Management",
    "Class Management",
    "Subjects Management",
    "Timetable Management",
    "Attendance Management",
    "Grading & Assessments",
    "Exam Management",
    "Report Cards",
    "Library Management",
    "Finance & Accounting",
    "Payroll",
    "Communication",
    "Calendar & Events",
    "Settings & Configuration",
  ];

  const dataAccessLevels = [
    { value: "Own Data Only", label: "Own Data Only" },
    { value: "Department Only", label: "Department Only" },
    { value: "Branch/Campus", label: "Branch/Campus" },
    { value: "All Data", label: "All Data" },
  ];

  const yesNoOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  return (
    <section className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-amber-50/50 dark:bg-amber-900/10 midnight:bg-amber-900/10 purple:bg-amber-900/10 hover:bg-amber-50 dark:hover:bg-amber-900/20 midnight:hover:bg-amber-900/20 purple:hover:bg-amber-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              System Access & Permissions
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              System roles, module access, and permissions
            </p>
          </div>
        </div>
        <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 cursor-pointer">
          <ChevronUp
            className={`w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isExpanded ? "rotate-0" : "rotate-180"
            }`}
          />
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className={isExpanded ? "overflow-visible" : "overflow-hidden"}>
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 lg:space-y-10">
            {/* System Role Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/20 midnight:bg-amber-900/20 purple:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  System Role
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormDropdown
                  label="System Role"
                  icon={<Shield className="w-full h-full" />}
                  iconBgColor="bg-amber-100 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30"
                  iconColor="text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400"
                  value={formData.systemRole || ""}
                  onChange={(value) => onChange("systemRole", value)}
                  options={systemRoles}
                  placeholder="Select system role"
                  required
                  error={errors.systemRole}
                />
                <FormDropdown
                  label="Data Access Level"
                  icon={<Lock className="w-full h-full" />}
                  iconBgColor="bg-amber-100 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30"
                  iconColor="text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400"
                  value={formData.dataAccessLevel || ""}
                  onChange={(value) => onChange("dataAccessLevel", value)}
                  options={dataAccessLevels}
                  placeholder="Select access level"
                />
              </div>
            </div>

            {/* Module Access Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/20 midnight:bg-amber-900/20 purple:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                  <CheckSquare className="w-4 h-4 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Module Access
                </h3>
              </div>
              <div className="pl-2">
                <TagInput
                  label="Allowed Modules"
                  value={formData.moduleAccess || []}
                  onChange={(tags) => onChange("moduleAccess", tags)}
                  placeholder="Type and press Enter to add modules"
                  suggestions={moduleOptions}
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  Select modules this user can access in the system
                </p>
              </div>
            </div>

            {/* Mobile & Additional Permissions Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/20 midnight:bg-amber-900/20 purple:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-4 h-4 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Additional Permissions
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormDropdown
                  label="Mobile App Access"
                  icon={<Smartphone className="w-full h-full" />}
                  iconBgColor="bg-amber-100 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30"
                  iconColor="text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400"
                  value={formData.mobileAppAccess || "No"}
                  onChange={(value) => onChange("mobileAppAccess", value)}
                  options={yesNoOptions}
                  placeholder="Select option"
                />
                <FormDropdown
                  label="Allow Approvals"
                  icon={<CheckSquare className="w-full h-full" />}
                  iconBgColor="bg-amber-100 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30"
                  iconColor="text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400"
                  value={formData.allowApprovals || "No"}
                  onChange={(value) => onChange("allowApprovals", value)}
                  options={yesNoOptions}
                  placeholder="Select option"
                />
              </div>
            </div>

            {/* Custom Permissions Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/20 midnight:bg-amber-900/20 purple:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Custom Permissions
                </h3>
              </div>
              <div className="pl-2">
                <TagInput
                  label="Custom Permissions"
                  value={formData.customPermissions || []}
                  onChange={(tags) => onChange("customPermissions", tags)}
                  placeholder="Type and press Enter to add custom permissions"
                  suggestions={[]}
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  Add any additional custom permissions for this user
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <div className="pl-2">
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 midnight:bg-amber-900/20 purple:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 midnight:border-amber-800/30 purple:border-amber-800/30">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded bg-amber-100 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" />
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300 midnight:text-amber-300 purple:text-amber-300">
                    <strong className="font-semibold">Security Note:</strong> Permissions
                    and access levels should be assigned based on job responsibilities.
                    Review and update permissions periodically to maintain system security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
