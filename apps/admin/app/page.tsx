"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@admin/components/layout/AdminLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import StatCard from "@/components/shared/StatCard";
import { usePageLoad } from "@/hooks/usePageLoad";
import { getAllTenants } from "@/lib/mockTenants";
import { Building2, Plus, ToggleLeft, Globe } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const isLoading = usePageLoad(600);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <AdminLayout>
        <PageLoader isLoading={true} loadingText="Loading Admin Console" />
      </AdminLayout>
    );
  }

  const tenants = getAllTenants();
  const activeTenants = tenants.filter((t) => t.status === "Active");
  const trialTenants = tenants.filter((t) => t.status === "Trial");

  return (
    <AdminLayout>
      <PageLoader isLoading={isLoading} loadingText="Loading Admin Console" />

      <div className={`transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}>
        <div className="py-4 mb-2">
          <PageHeader
            title="Admin Console"
            breadcrumbs={[{ label: "Admin Console", isActive: true }]}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Schools"
            value={tenants.length}
            icon={Building2}
            color="blue"
          />
          <StatCard
            label="Active"
            value={activeTenants.length}
            icon={Building2}
            color="green"
          />
          <StatCard
            label="Trial"
            value={trialTenants.length}
            icon={Building2}
            color="orange"
          />
          <StatCard
            label="Total Features"
            value={42}
            icon={ToggleLeft}
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/tenants/create"
            className="group p-6 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Create School
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-0.5">
                  Set up a new tenant
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/feature-flags"
            className="group p-6 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                <ToggleLeft className="w-6 h-6 text-purple-600 dark:text-purple-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Feature Flags
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-0.5">
                  Manage tenant features
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/regional-settings"
            className="group p-6 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                <Globe className="w-6 h-6 text-green-600 dark:text-green-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Regional Settings
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-0.5">
                  Country, language, currency
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
