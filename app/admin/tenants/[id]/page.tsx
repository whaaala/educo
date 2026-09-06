"use client";

import type { LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Edit,
  Trash2,
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Palette,
  CreditCard,
  Settings,
  Users,
  DollarSign,
  Video,
  MessageSquare,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { DashboardPage } from "@/components/pages";
import Button from "@/components/shared/Button";
import ActionModal from "@/components/shared/ActionModal";
import { getTenantById, deleteTenant } from "@/lib/mockTenants";
import { Tenant } from "@/types/school";

/** The page's tabs, named once so the tab list and the state cannot disagree. */
type TenantTab = "overview" | "config" | "communication" | "branding" | "subscription";

/** Typed from the tenant config, so a type that is not a real communication channel stops compiling. */
const COMMUNICATION_TYPES = ["video", "voice", "chat"] as const;

export default function TenantDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params.id as string;

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [activeTab, setActiveTab] = useState<TenantTab>("overview");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (tenantId) {
      const tenantData = getTenantById(tenantId);
      setTenant(tenantData || null);
    }
  }, [tenantId]);

  const requestDelete = () => {
    if (!tenant) return;
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!tenant) return;
    setIsDeleting(true);
    try {
      const success = deleteTenant(tenant.id);
      if (success) {
        router.push("/admin/tenants");
      }
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (!tenant) {
    return (
      <DashboardPage
        title="Tenant Not Found"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Admin", href: "/admin" },
          { label: "Tenants", href: "/admin/tenants" },
          { label: "Not Found", isActive: true },
        ]}
        loadingText="Loading Tenant"
        afterStats={
          <div className="mt-6 text-center py-12">
            <Building2 className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
            <p className="text-neutral-600 dark:text-neutral-400">Tenant not found</p>
            <Button onClick={() => router.push("/admin/tenants")} className="mt-4">
              Back to Tenants
            </Button>
          </div>
        }
      />
    );
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      Active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400",
      Inactive: "bg-gray-100 text-gray-800 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/30 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300",
      Suspended: "bg-red-100 text-red-800 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
      Trial: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles] || styles.Inactive}`}>
        {status}
      </span>
    );
  };

  return (
    <DashboardPage
      title={tenant.name}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Admin", href: "/admin" },
        { label: "Tenants", href: "/admin/tenants" },
        { label: tenant.name, isActive: true },
      ]}
      loadingText="Loading Tenant"
      afterStats={
        <div className="mt-6 p-6 space-y-6">
          <div className="flex items-center justify-end gap-3">
            <Button
              onClick={() => router.push(`/admin/tenants/${tenant.id}/edit`)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <Button
              onClick={requestDelete}
              variant="outline"
              className="flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>

        {/* School Info Header */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 rounded-lg">
                <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {tenant.name}
                </h2>
                {tenant.shortName && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    {tenant.shortName}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    <span className="font-medium">Slug:</span> {tenant.slug}
                  </span>
                  {tenant.subdomain && (
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="font-medium">Domain:</span> {tenant.subdomain}
                    </span>
                  )}
                  <div>{getStatusBadge(tenant.status)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
          <div className="border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex">
              {([
                { id: "overview", label: "Overview", icon: Building2 },
                { id: "config", label: "Configuration", icon: Settings },
                { id: "communication", label: "Communication", icon: Video },
                { id: "branding", label: "Branding", icon: Palette },
                { id: "subscription", label: "Subscription", icon: CreditCard },
              ] satisfies { id: TenantTab; label: string; icon: LucideIcon }[]).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                      : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-neutral-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Email
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {tenant.contact.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-neutral-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Phone
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {tenant.contact.phone}
                        </p>
                      </div>
                    </div>
                    {tenant.contact.website && (
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-neutral-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Website
                          </p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {tenant.contact.website}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-neutral-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Address
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {tenant.contact.address.line1}
                          {tenant.contact.address.line2 && <>, {tenant.contact.address.line2}</>}
                          <br />
                          {tenant.contact.address.city}, {tenant.contact.address.state}{" "}
                          {tenant.contact.address.postalCode}
                          <br />
                          {tenant.contact.address.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    Quick Stats
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                        <div>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Institution Type
                          </p>
                          <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                            {tenant.config.institutionType}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
                        <div>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">Region</p>
                          <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                            {tenant.config.region}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <div>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Currency
                          </p>
                          <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                            {tenant.config.currency}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Account */}
                {tenant.config.bankAccount && (
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Bank Account
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Bank Name
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          {tenant.config.bankAccount.bankName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Account Number
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          {tenant.config.bankAccount.accountNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Account Name
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          {tenant.config.bankAccount.accountName}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Configuration Tab */}
            {activeTab === "config" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    Education Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Supported Levels
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tenant.config.supportedLevels.map((level) => (
                          <span
                            key={level}
                            className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 rounded-full text-sm"
                          >
                            {level}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Default Level
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                        {tenant.config.defaultEducationLevel}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Term System
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                        {tenant.config.termSystem}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Schedule Type
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 capitalize">
                        {tenant.config.scheduleType}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    Academic Year
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Start Month
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                        {tenant.config.academicYearStart}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        End Month
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                        {tenant.config.academicYearEnd}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    Regional Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Timezone
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                        {tenant.config.timezone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Locale
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                        {tenant.config.locale}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    Enabled Features
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tenant.config.enabledFeatures.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Communication Tab */}
            {activeTab === "communication" && (
              <div className="space-y-6">
                {/* Communication Provider */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Communication Provider
                  </h3>
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Primary Provider
                    </p>
                    <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 capitalize">
                      {tenant.config.communication?.provider || "Educo Meet (Default)"}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                      {tenant.config.communication?.provider === "agora"
                        ? "Using Agora for video/voice calls"
                        : tenant.config.communication?.provider === "whatsapp"
                        ? "Using WhatsApp Business for messaging"
                        : tenant.config.communication?.provider === "external"
                        ? "Using external meeting links (Zoom, Google Meet, Teams)"
                        : tenant.config.communication?.provider === "hybrid"
                        ? "Using multiple communication platforms"
                        : "Using built-in Educo Meet for video conferencing"}
                    </p>
                  </div>
                </div>

                {/* Enabled Communication Types */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Enabled Communication Types
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {COMMUNICATION_TYPES.map((type) => {
                      const isEnabled =
                        tenant.config.communication?.enabledTypes?.includes(type) ??
                        (type === "video" || type === "voice");
                      return (
                        <div
                          key={type}
                          className={`p-4 rounded-lg border-2 ${
                            isEnabled
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600"
                              : "border-neutral-200 bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {type === "video" && <Video className="w-5 h-5" />}
                              {type === "voice" && <Phone className="w-5 h-5" />}
                              {type === "chat" && <MessageSquare className="w-5 h-5" />}
                              <span className="font-medium capitalize">{type}</span>
                            </div>
                            {isEnabled ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
                            ) : (
                              <XCircle className="w-5 h-5 text-neutral-400" />
                            )}
                          </div>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                            {isEnabled ? "Enabled" : "Disabled"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Communication Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    Communication Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Default Meeting Duration
                      </p>
                      <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
                        {tenant.config.communication?.defaultDuration || 30} minutes
                      </p>
                    </div>
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Parent-Initiated Calls
                          </p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Allow parents to start calls
                          </p>
                        </div>
                        {tenant.config.communication?.allowParentInitiatedCalls !== false ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </div>
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Require Approval
                          </p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Meetings need teacher approval
                          </p>
                        </div>
                        {tenant.config.communication?.requireApproval ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-neutral-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Platform-Specific Settings */}
                {tenant.config.communication?.settings && (
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                      Platform Settings
                    </h3>
                    <div className="space-y-4">
                      {tenant.config.communication.settings.educoMeet?.enabled && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Video className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                            <span className="font-medium text-blue-900 dark:text-blue-100">
                              Educo Meet
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">Max Participants:</span>{" "}
                              <span className="font-medium">
                                {tenant.config.communication.settings.educoMeet.maxParticipants || "Unlimited"}
                              </span>
                            </div>
                            <div>
                              <span className="text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">Recording:</span>{" "}
                              <span className="font-medium">
                                {tenant.config.communication.settings.educoMeet.recordingEnabled
                                  ? "Enabled"
                                  : "Disabled"}
                              </span>
                            </div>
                            <div>
                              <span className="text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">Virtual Background:</span>{" "}
                              <span className="font-medium">
                                {tenant.config.communication.settings.educoMeet.virtualBackgroundEnabled
                                  ? "Enabled"
                                  : "Disabled"}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {tenant.config.communication.settings.agora?.enabled && (
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <span className="font-medium text-purple-900 dark:text-purple-100">
                              Agora
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-purple-700 dark:text-purple-300">App ID:</span>{" "}
                            <span className="font-medium font-mono">
                              {tenant.config.communication.settings.agora.appId
                                ? `${tenant.config.communication.settings.agora.appId.substring(0, 8)}...`
                                : "Not configured"}
                            </span>
                          </div>
                        </div>
                      )}

                      {tenant.config.communication.settings.whatsapp?.enabled && (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
                            <span className="font-medium text-green-900 dark:text-green-100">
                              WhatsApp Business
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-green-700 dark:text-green-300">Business Phone:</span>{" "}
                            <span className="font-medium">
                              {tenant.config.communication.settings.whatsapp.businessPhoneNumber || "Not configured"}
                            </span>
                          </div>
                        </div>
                      )}

                      {tenant.config.communication.settings.externalLinks?.enabled && (
                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            <span className="font-medium text-orange-900 dark:text-orange-100">
                              External Meeting Links
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-orange-700 dark:text-orange-300">Default Platform:</span>{" "}
                            <span className="font-medium capitalize">
                              {tenant.config.communication.settings.externalLinks.defaultPlatform || "Zoom"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* No Communication Config */}
                {!tenant.config.communication && (
                  <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-amber-800 dark:text-amber-200 font-medium">
                      Communication settings not configured
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      This tenant is using default communication settings. Edit the tenant to configure
                      communication preferences.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Branding Tab */}
            {activeTab === "branding" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    Brand Identity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tenant.branding.motto && (
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          School Motto
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                          {tenant.branding.motto}
                        </p>
                      </div>
                    )}
                    {tenant.branding.mission && (
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Mission
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                          {tenant.branding.mission}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    Colors
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Primary Color
                      </p>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg border border-neutral-300 dark:border-neutral-600"
                          style={{ backgroundColor: tenant.branding.primaryColor }}
                        />
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {tenant.branding.primaryColor}
                        </span>
                      </div>
                    </div>
                    {tenant.branding.secondaryColor && (
                      <div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Secondary Color
                        </p>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-lg border border-neutral-300 dark:border-neutral-600"
                            style={{ backgroundColor: tenant.branding.secondaryColor }}
                          />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {tenant.branding.secondaryColor}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {tenant.branding.transcriptDesign && (
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                      Transcript Design
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Template
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 capitalize">
                          {tenant.branding.transcriptDesign.template}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Header Style
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 capitalize">
                          {tenant.branding.transcriptDesign.headerStyle}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Border Style
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 capitalize">
                          {tenant.branding.transcriptDesign.borderStyle || "none"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Watermark
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                          {tenant.branding.transcriptDesign.showWatermark
                            ? tenant.branding.transcriptDesign.watermarkText || "Yes"
                            : "No"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {tenant.branding.signatures && (
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                      Signatures
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Registrar
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                          {tenant.branding.signatures.registrarName}
                          <br />
                          <span className="text-xs">{tenant.branding.signatures.registrarTitle}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Principal
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                          {tenant.branding.signatures.principalName}
                          <br />
                          <span className="text-xs">{tenant.branding.signatures.principalTitle}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Subscription Tab */}
            {activeTab === "subscription" && tenant.subscription && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Plan
                    </p>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 capitalize">
                      {tenant.subscription.plan}
                    </p>
                  </div>
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Status
                    </p>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 capitalize">
                      {tenant.subscription.status}
                    </p>
                  </div>
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Start Date
                    </p>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {new Date(tenant.subscription.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    Limits
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Maximum Students
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                        {tenant.subscription.maxStudents?.toLocaleString() || "Unlimited"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Maximum Staff
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                        {tenant.subscription.maxStaff?.toLocaleString() || "Unlimited"}
                      </p>
                    </div>
                  </div>
                </div>

                {tenant.subscription.endDate && (
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                      Billing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          End Date
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                          {new Date(tenant.subscription.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            System Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-neutral-700 dark:text-neutral-300">Tenant ID</p>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">{tenant.id}</p>
            </div>
            <div>
              <p className="font-medium text-neutral-700 dark:text-neutral-300">Created</p>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                {new Date(tenant.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="font-medium text-neutral-700 dark:text-neutral-300">Last Updated</p>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                {new Date(tenant.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <ActionModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            if (isDeleting) return;
            setIsDeleteModalOpen(false);
          }}
          title="Delete School"
          subtitle={tenant?.name}
          variant="danger"
          message="Are you sure you want to delete this school? This action cannot be undone."
          details={
            tenant
              ? [
                  { label: "Tenant ID", value: tenant.id },
                  { label: "Slug", value: tenant.slug },
                  { label: "Status", value: tenant.status },
                ]
              : undefined
          }
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          isConfirming={isDeleting}
        />
      </div>
    }
  />
  );
}
