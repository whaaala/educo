"use client";

import { useState, useEffect } from "react";
import AdminPageShell from "@admin/components/pages/AdminPageShell";
import ActionModal from "@/components/shared/ActionModal";
import { Save, RotateCcw, Search, Filter } from "lucide-react";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { DEFAULT_FEATURE_FLAGS, type FeatureFlagKey } from "@/lib/featureFlags";

export default function FeatureFlagsAdminPage() {
  const { tenantContext } = useFeatureFlags();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [hasChanges, setHasChanges] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

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
      setHasChanges(false);
      setIsSavedModalOpen(true);
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
      <AdminPageShell
        title="Feature Flags Management"
        subtitle="Enable or disable features for this tenant"
        breadcrumbs={[
          { label: "Admin Console", href: "/" },
          { label: "Feature Flags", isActive: true },
        ]}
        isLoading={true}
        loadingText="Loading feature flags..."
      >
        <div />
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="Feature Flags Management"
      subtitle="Enable or disable features for this tenant"
      breadcrumbs={[
        { label: "Admin Console", href: "/" },
        { label: "Feature Flags", isActive: true },
      ]}
      headerActions={
        <div className="flex items-center gap-3">
          {hasChanges && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all cursor-pointer"
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
      }
    >
      <div className="pb-20 space-y-6">
        {/* Tenant Info */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 midnight:from-cyan-900/20 midnight:to-blue-900/20 purple:from-pink-900/20 purple:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800 midnight:border-cyan-500/50 purple:border-pink-500/50">
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 font-semibold mb-1">
                Tenant ID
              </p>
              <p className="text-sm font-mono text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {tenantContext.tenantId}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 font-semibold mb-1">
                Region
              </p>
              <p className="text-sm font-mono text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {tenantContext.region}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 font-semibold mb-1">
                Education Level
              </p>
              <p className="text-sm font-mono text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {tenantContext.educationLevel}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 font-semibold mb-1">
                Institution Type
              </p>
              <p className="text-sm font-mono text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {tenantContext.institutionType}
              </p>
            </div>
          </div>
          <div className="text-center px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
              {enabledCount}/{totalCount}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
              Enabled
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="pb-4 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search feature flags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
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
        <div>
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
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4 flex items-center justify-between">
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
                              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 midnight:bg-gray-800 midnight:border-gray-700 purple:bg-gray-800 purple:border-gray-700"
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
                                isEnabled ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"
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
                  className="px-4 py-2 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all cursor-pointer"
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

      <ActionModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        title="Feature flags saved"
        variant="success"
        message="Your feature flag changes have been saved (mock). In production, this would update the database for the current tenant."
        details={[
          { label: "Tenant ID", value: tenantContext.tenantId },
          { label: "Enabled", value: `${enabledCount}/${totalCount}` },
        ]}
        confirmLabel="Done"
        cancelLabel="Close"
        onConfirm={() => setIsSavedModalOpen(false)}
      />
    </AdminPageShell>
  );
}
