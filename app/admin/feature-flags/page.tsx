"use client";

import { useState, useEffect } from "react";
import { DashboardPage } from "@/components/pages";
import { Save, RotateCcw, Search, Filter } from "lucide-react";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { DEFAULT_FEATURE_FLAGS, type FeatureFlagKey } from "@/lib/featureFlags";
export default function FeatureFlagsAdminPage() {
  const { tenantContext } = useFeatureFlags();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [hasChanges, setHasChanges] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Local state for feature flags (in production, this would sync with database)
  const [localFlags, setLocalFlags] = useState(() => {
    const flags: Record<string, boolean> = {};
    Object.keys(DEFAULT_FEATURE_FLAGS).forEach((key) => {
      flags[key] = DEFAULT_FEATURE_FLAGS[key as FeatureFlagKey].enabled;
    });
    return flags;
  });

  // Categorize feature flags
  const categories = {
    "Student Management": ["FF_Student_Profile", "FF_Student_Transfer", "FF_Student_Grading"],
    "Staff Management": ["FF_Staff_HR", "FF_Staff_Payroll", "FF_Staff_Transfer"],
    "Finance": ["FF_Finance_Private", "FF_Finance_Public", "FF_Finance_Tertiary"],
    "Grading": ["FF_Grading_Primary", "FF_Grading_Secondary", "FF_Grading_Tertiary"],
    "LMS & Academics": ["FF_LMS_Zoom", "FF_LMS_GoogleDrive", "FF_LMS_Grading"],
    "Communication": ["FF_Chat_WhatsApp", "FF_Call_Zoom", "FF_GoogleCalendar", "FF_Email_SendGrid", "FF_FacebookIntegration"],
    "Attendance": ["FF_Attendance_Biometric", "FF_Attendance_GPS", "FF_Attendance_Evening_Weekend"],
    "Facilities": ["FF_Library_QR", "FF_Transport_GPS", "FF_Hostel_Management"],
    "Reports & Transcripts": ["FF_Reports_GoogleDataStudio", "FF_Reports_Export", "FF_Transcript_Generation", "FF_Transcript_Payment"],
    "Admissions": ["FF_Admissions_International", "FF_Exams_National"],
    "Notifications": ["FF_Notifications_Push", "FF_Notifications_SMS", "FF_Notifications_Email", "FF_Notifications_WhatsApp", "FF_Notifications_Social"],
    "School & Branch": ["FF_School_Management", "FF_Branch_Hierarchy"],
  };

  const toggleFlag = (flagKey: string) => {
    setLocalFlags((prev) => ({
      ...prev,
      [flagKey]: !prev[flagKey],
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // In production, this would save to database per tenant
    console.log("Saving feature flags for tenant:", tenantContext.tenantId);
    console.log("Updated flags:", localFlags);

    // Simulate API call
    setTimeout(() => {
      alert("Feature flags saved successfully!\n\nNote: In production, this would update the database for tenant: " + tenantContext.tenantId);
      setHasChanges(false);
    }, 500);
  };

  const handleReset = () => {
    const flags: Record<string, boolean> = {};
    Object.keys(DEFAULT_FEATURE_FLAGS).forEach((key) => {
      flags[key] = DEFAULT_FEATURE_FLAGS[key as FeatureFlagKey].enabled;
    });
    setLocalFlags(flags);
    setHasChanges(false);
  };

  const enabledCount = Object.values(localFlags).filter(Boolean).length;
  const totalCount = Object.keys(localFlags).length;

  // Filter flags
  const filteredCategories = Object.entries(categories).filter(([category]) => {
    if (categoryFilter !== "all" && category !== categoryFilter) return false;
    return true;
  });

  // Only render on client to avoid hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <DashboardPage
        title="Feature Flags"
        description="Enable or disable features for this tenant"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Feature Flags", isActive: true },
        ]}
        loadingText="Loading feature flags..."
      />
    );
  }

  return (
    <DashboardPage
      title="Feature Flags"
      description="Enable or disable features for this tenant"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Feature Flags", isActive: true },
      ]}
      loadingText="Loading feature flags..."
      afterStats={
        <div className="mt-6 flex flex-col h-full">
          {/* Actions + Tenant Info */}
          <div className="w-full lg:w-auto lg:flex-shrink-0 p-6 pb-4 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30">
            <div className="flex items-center justify-end mb-4">
              <div className="flex items-center gap-3">
              {hasChanges && (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-white transition-all cursor-pointer ${
                  hasChanges
                    ? "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>

          {/* Tenant Info */}
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 midnight:from-cyan-900/20 midnight:to-blue-900/20 purple:from-pink-900/20 purple:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800 midnight:border-cyan-500/50 purple:border-pink-500/50">
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 font-semibold mb-1">
                  Tenant ID
                </p>
                <p className="text-sm font-mono text-ink">
                  {tenantContext.tenantId}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 font-semibold mb-1">
                  Region
                </p>
                <p className="text-sm font-mono text-ink">
                  {tenantContext.region}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 font-semibold mb-1">
                  Education Level
                </p>
                <p className="text-sm font-mono text-ink">
                  {tenantContext.educationLevel}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 font-semibold mb-1">
                  Institution Type
                </p>
                <p className="text-sm font-mono text-ink">
                  {tenantContext.institutionType}
                </p>
              </div>
            </div>
            <div className="text-center px-4 py-2 bg-surface rounded-lg border border-line">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                {enabledCount}/{totalCount}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                Enabled
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search feature flags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="all">All Categories</option>
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Feature Flags List */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-8">
            {filteredCategories.map(([category, flags]) => {
              const categoryFlags = flags.filter((flag) => {
                if (!searchQuery) return true;
                const config = DEFAULT_FEATURE_FLAGS[flag as FeatureFlagKey];
                return (
                  flag.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  config.description.toLowerCase().includes(searchQuery.toLowerCase())
                );
              });

              if (categoryFlags.length === 0) return null;

              return (
                <div key={category}>
                  <h2 className="text-lg font-bold text-ink mb-4 flex items-center justify-between">
                    <span>{category}</span>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      {categoryFlags.filter((f) => localFlags[f]).length}/{categoryFlags.length} enabled
                    </span>
                  </h2>

                  <div className="grid grid-cols-1 gap-3">
                    {categoryFlags.map((flagKey) => {
                      const config = DEFAULT_FEATURE_FLAGS[flagKey as FeatureFlagKey];
                      const isEnabled = localFlags[flagKey];

                      return (
                        <div
                          key={flagKey}
                          className={`p-4 rounded-lg border transition-all ${
                            isEnabled
                              ? "bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-700 midnight:bg-green-900/10 midnight:border-green-700 purple:bg-green-900/10 purple:border-green-700"
                              : "bg-white dark:bg-[#1a1d24] border-gray-200 dark:border-gray-700 midnight:bg-[#0f1330] midnight:border-gray-700 purple:bg-[#251340] purple:border-gray-700"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <code className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                                  {flagKey}
                                </code>
                                {config.enabledFor && (
                                  <div className="flex gap-2">
                                    {config.enabledFor.educationLevels && (
                                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                        {config.enabledFor.educationLevels.join(", ")}
                                      </span>
                                    )}
                                    {config.enabledFor.institutionTypes && (
                                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                                        {config.enabledFor.institutionTypes.join(", ")}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                                {config.description}
                              </p>
                            </div>

                            {/* Toggle Switch */}
                            <button
                              onClick={() => toggleFlag(flagKey)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer ${
                                isEnabled ? "bg-green-600" : "bg-gray-300 dark:bg-[#2a2d35] midnight:bg-[#0f1330] purple:bg-[#251340]"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  isEnabled ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky Footer with Save Button */}
        {hasChanges && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 midnight:bg-amber-900/20 purple:bg-amber-900/20 border-t border-amber-200 dark:border-amber-800 midnight:border-amber-700 purple:border-amber-700">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <p className="text-sm text-amber-800 dark:text-amber-200 midnight:text-amber-200 purple:text-amber-200">
                You have unsaved changes. Click <strong>Save Changes</strong> to apply them.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      }
    />
  );
}
