"use client";

import { useEffect, useState } from "react";
import { DashboardPage } from "@/components/pages";
import TranslationEngineSettings from "@/components/settings/TranslationEngineSettings";
import { Settings as SettingsIcon } from "lucide-react";

export default function GeneralSettingsPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <DashboardPage
        title="General Settings"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Settings", href: "/settings" },
          { label: "General", isActive: true },
        ]}
        loadingText="Loading Settings"
      />
    );
  }

  return (
    <DashboardPage
      title="General Settings"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Settings", href: "/settings" },
        { label: "General", isActive: true },
      ]}
      loadingText="Loading Settings"
      afterStats={
        <div className="mt-6 pb-20 space-y-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 rounded-xl border border-blue-200 dark:border-blue-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <div className="flex items-center gap-3">
              <SettingsIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
                  Tenant-wide settings
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-0.5">
                  Changes here apply across applications for this tenant.
                </p>
              </div>
            </div>
          </div>

          <TranslationEngineSettings />
        </div>
      }
    />
  );
}

