"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@admin/components/layout/AdminLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import SchoolProfileSettings from "@/components/settings/SchoolProfileSettings";
import { usePageLoad } from "@/hooks/usePageLoad";
import { Building2 } from "lucide-react";

export default function SchoolProfilePage() {
  const isLoading = usePageLoad(800);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <AdminLayout>
        <PageLoader isLoading={true} loadingText="Loading School Profile" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Loading Screen */}
      <PageLoader isLoading={isLoading} loadingText="Loading School Profile" />

      {/* Main Content */}
      <div className={`transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}>
        {/* Header */}
        <div className="py-4 mb-2">
          <PageHeader
            title="School Profile"
            breadcrumbs={[
              { label: "Admin Console", href: "/" },
              { label: "School Profile", isActive: true },
            ]}
          />
        </div>

        {/* Content */}
        <div className="pb-20 space-y-6">
          <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Section Header */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 px-6 py-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    School Profile
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    Configure your institution type - affects the entire application
                  </p>
                </div>
              </div>
            </div>

            {/* Section Content */}
            <div className="p-6">
              <SchoolProfileSettings />
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
