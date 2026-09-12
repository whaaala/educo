"use client";

import { useState, useEffect } from "react";
import AdminPageShell from "@admin/components/pages/AdminPageShell";
import CountrySelector from "@/components/shared/CountrySelector";
import LanguageSelector from "@/components/shared/LanguageSelector";
import { usePageLoad } from "@/hooks/usePageLoad";
import { Globe, Languages, Bell } from "lucide-react";

export default function RegionalSettingsPage() {
  const isLoading = usePageLoad(800);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <AdminPageShell
        title="Regional Settings"
        breadcrumbs={[
          { label: "Admin Console", href: "/" },
          { label: "Regional Settings", isActive: true },
        ]}
        isLoading={true}
        loadingText="Loading Regional Settings"
      >
        <div />
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="Regional Settings"
      breadcrumbs={[
        { label: "Admin Console", href: "/" },
        { label: "Regional Settings", isActive: true },
      ]}
      isLoading={isLoading}
      loadingText="Loading Regional Settings"
    >
      <div className="pb-20 space-y-6">
        <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Section Header */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 px-6 py-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    Regional Settings
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    Configure country, language, currency, and educational system
                  </p>
                </div>
              </div>
            </div>

            {/* Section Content */}
            <div className="p-6 space-y-6">
              <CountrySelector
                label="Country/Region"
                showCurrencyInfo={true}
              />

              {/* Language Selector */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                    Application Language
                  </label>
                </div>
                <LanguageSelector />
                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-2">
                  Select your preferred language from the common languages spoken in{" "}
                  <span className="font-medium">the selected country</span>
                </p>
              </div>

              {/* Important Note Banner */}
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 midnight:bg-yellow-900/20 purple:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 midnight:border-yellow-700 purple:border-yellow-700 rounded-lg">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-yellow-600 dark:text-yellow-400 midnight:text-yellow-400 purple:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-300 midnight:text-yellow-300 purple:text-yellow-300">
                      Important Note
                    </p>
                    <p className="text-xs text-yellow-800 dark:text-yellow-400 midnight:text-yellow-400 purple:text-yellow-400 mt-1">
                      Changing the country will update available languages, class levels, currencies, and other region-specific settings across the entire application. This setting is saved locally in your browser.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
      </div>
    </AdminPageShell>
  );
}
