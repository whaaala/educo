"use client";

import { useState, useEffect } from "react";
import { DashboardPage } from "@/components/pages";
import TimetableManagementSettings from "@/components/settings/TimetableManagementSettings";
import UserPermissionManagement from "@/components/settings/UserPermissionManagement";
import AttendanceSettings from "@/components/settings/AttendanceSettings";
import FeeSettings from "@/components/settings/FeeSettings";
import BankAccountSettings from "@/components/settings/BankAccountSettings";
import { Settings as SettingsIcon, Palette, Calendar, Clock, Shield, UserCheck, DollarSign, GraduationCap, Landmark, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <DashboardPage
        title="Settings"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Settings", isActive: true },
        ]}
        loadingText="Loading Settings"
      />
    );
  }

  return (
    <DashboardPage
      title="Settings"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Settings", isActive: true },
      ]}
      loadingText="Loading Settings"
      afterStats={
        <div className="mt-6 pb-20 space-y-6">
          {/* Admin Console Banner */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 rounded-xl border border-blue-200 dark:border-blue-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <div className="flex items-center gap-3">
              <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
                  School Profile and Regional Settings have moved to the{" "}
                  <a
                    href="http://localhost:3001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline hover:no-underline"
                  >
                    Admin Console
                  </a>
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-0.5">
                  Manage institution type, education levels, regional settings, feature flags, and subscriptions
                </p>
              </div>
            </div>
          </div>

          {/* Grading Configuration Section */}
          <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Section Header */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 px-6 py-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    Grading System Configuration
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    Configure grading components and weights per subject/module
                  </p>
                </div>
              </div>
            </div>

            {/* Section Content */}
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-4">
                Configure how each subject or module is graded by customizing assessment components and their weights.
              </p>
              <Link
                href="/demo-grading"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <GraduationCap className="w-4 h-4" />
                Configure Grading System
              </Link>
            </div>
          </section>

          {/* Bank Account Settings Section */}
          <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Section Header */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 px-6 py-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                  <Landmark className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    Bank Account Settings
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    Configure bank account details for payment collection
                  </p>
                </div>
              </div>
            </div>

            {/* Section Content */}
            <div className="p-6">
              <BankAccountSettings />
            </div>
          </section>

          {/* Theme Settings Section */}
          <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 px-6 py-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                  <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    Appearance
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    Theme settings available in the sidebar
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                Use the theme switcher in the sidebar to change between Light, Dark, Midnight, and Purple themes.
              </p>
            </div>
          </section>

          {/* User Permissions Section */}
          <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 px-6 py-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    Calendar Permissions
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    Manage who can create, edit, and delete calendar events
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <UserPermissionManagement />
            </div>
          </section>

          {/* Timetable Configuration Section */}
          <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 px-6 py-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    Timetable Management
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    Configure timetable calendar and manage custom events
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <TimetableManagementSettings />
            </div>
          </section>

          {/* Attendance Settings Section */}
          <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 px-6 py-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    Attendance Configuration
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    Configure how attendance is tracked and displayed
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <AttendanceSettings />
            </div>
          </section>

          {/* Fee Configuration Section */}
          <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 px-6 py-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    Fee Configuration
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    Configure school type, payment channels, and fee categories
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <FeeSettings />
            </div>
          </section>

          {/* Academic Year Section */}
          <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 px-6 py-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    Academic Year
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    Academic year settings available in the sidebar
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                Use the academic year selector in the sidebar to switch between different academic years.
              </p>
            </div>
          </section>

          {/* System Information */}
          <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 px-6 py-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                  <SettingsIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    System Information
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    Application details and version
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                    Application Name
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    Educo School ERP
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                    Version
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    1.0.0
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                    Framework
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    Next.js 15
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      }
    />
  );
}
