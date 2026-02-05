"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@admin/components/layout/AdminLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useTenantSubscription } from "@/hooks/useTenant";
import { CreditCard, CheckCircle2, AlertCircle, Users, UserCog, Sparkles } from "lucide-react";

export default function SubscriptionPage() {
  const isLoading = usePageLoad(800);
  const [isMounted, setIsMounted] = useState(false);
  const subscription = useTenantSubscription();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <AdminLayout>
        <PageLoader isLoading={true} loadingText="Loading Subscription" />
      </AdminLayout>
    );
  }

  const getPlanDisplayName = (plan: string) => {
    const names: Record<string, string> = {
      free: "Free",
      basic: "Basic",
      professional: "Professional",
      enterprise: "Enterprise",
    };
    return names[plan] || plan;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400 bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30";
      case "trial":
        return "text-yellow-600 dark:text-yellow-400 midnight:text-yellow-400 purple:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 midnight:bg-yellow-900/30 purple:bg-yellow-900/30";
      case "expired":
        return "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30";
      case "cancelled":
        return "text-gray-600 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 bg-gray-100 dark:bg-gray-900/30 midnight:bg-gray-900/30 purple:bg-gray-900/30";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  return (
    <AdminLayout>
      {/* Loading Screen */}
      <PageLoader isLoading={isLoading} loadingText="Loading Subscription" />

      {/* Main Content */}
      <div className={`transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}>
        {/* Header */}
        <div className="py-4 mb-2">
          <PageHeader
            title="Subscription & Plans"
            breadcrumbs={[
              { label: "Admin Console", href: "/" },
              { label: "Subscription & Plans", isActive: true },
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
                  <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    Subscription & Plans
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    Manage your subscription plan and usage
                  </p>
                </div>
              </div>
            </div>

            {/* Section Content */}
            <div className="p-6">
              {subscription ? (
                <div className="space-y-6">
                  {/* Current Plan Overview */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                          Current Plan
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                          {getPlanDisplayName(subscription.plan)}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(subscription.status)}`}>
                      {subscription.status}
                    </span>
                  </div>

                  {/* Plan Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Start Date */}
                    <div className="p-4 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-1">
                        Start Date
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                        {new Date(subscription.startDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* End Date */}
                    <div className="p-4 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-1">
                        End Date
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                        {subscription.endDate
                          ? new Date(subscription.endDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "No expiration"}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="p-4 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-1">
                        Status
                      </p>
                      <div className="flex items-center gap-2">
                        {subscription.status === "active" ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                        )}
                        <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 capitalize">
                          {subscription.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Usage Limits */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100 mb-3">
                      Usage Limits
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Max Students */}
                      <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-lg">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                            Maximum Students
                          </p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                            {subscription.maxStudents != null ? subscription.maxStudents.toLocaleString() : "Unlimited"}
                          </p>
                        </div>
                      </div>

                      {/* Max Staff */}
                      <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-lg">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                          <UserCog className="w-5 h-5 text-purple-600 dark:text-purple-400 midnight:text-cyan-400 purple:text-pink-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                            Maximum Staff
                          </p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                            {subscription.maxStaff != null ? subscription.maxStaff.toLocaleString() : "Unlimited"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enabled Features */}
                  {subscription.features && subscription.features.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100 mb-3">
                        Included Features
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {subscription.features.map((feature) => (
                          <div
                            key={feature}
                            className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 midnight:bg-green-900/20 purple:bg-green-900/20 border border-green-200 dark:border-green-700 midnight:border-green-700 purple:border-green-700 rounded-lg"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400 flex-shrink-0" />
                            <span className="text-xs font-medium text-green-800 dark:text-green-300 midnight:text-green-300 purple:text-green-300 capitalize">
                              {feature.replace(/-/g, " ").replace(/_/g, " ")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* No Subscription Data */
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-gray-400 dark:text-gray-500 midnight:text-cyan-500/50 purple:text-pink-500/50" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">
                    No Subscription Found
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 max-w-sm mx-auto">
                    No subscription information is available for the current tenant. Please contact support to set up a subscription plan.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
