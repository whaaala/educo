"use client";

import { useEffect, useMemo, useState } from "react";
import AdminPageShell from "@admin/components/pages/AdminPageShell";
import ActionModal from "@/components/shared/ActionModal";
import { getTenantById, updateTenant } from "@/lib/mockTenants";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import type { Tenant, TranslationProvider, TenantTranslationConfig } from "@/types/school";
import { Languages, Save, Info, CheckCircle2 } from "lucide-react";

function normalizeAllowedProviders(input: TranslationProvider[]): TranslationProvider[] {
  const set = new Set<TranslationProvider>();
  for (const p of input) {
    if (p === "deepl" || p === "google" || p === "google-cloud") set.add(p);
  }
  return Array.from(set);
}

function buildTranslationConfig(state: {
  enabled: boolean;
  allowedProviders: TranslationProvider[];
  defaultProvider: TranslationProvider;
}): TenantTranslationConfig {
  const allowed = normalizeAllowedProviders(state.allowedProviders);
  const fallbackAllowed = allowed.length ? allowed : ["google"];
  const defaultProvider = fallbackAllowed.includes(state.defaultProvider)
    ? state.defaultProvider
    : fallbackAllowed[0];

  return {
    enabled: state.enabled,
    allowedProviders: fallbackAllowed,
    defaultProvider,
  };
}

export default function TranslationSettingsPage() {
  const { settings } = useSchoolSettings();
  const tenantId =
    settings.tenantId ||
    (typeof window !== "undefined" ? localStorage.getItem("currentTenantId") || "" : "");

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [allowDeepL, setAllowDeepL] = useState(true);
  const [allowGoogle, setAllowGoogle] = useState(true);
  const [allowGoogleCloud, setAllowGoogleCloud] = useState(false);
  const [defaultProvider, setDefaultProvider] = useState<TranslationProvider>("deepl");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  useEffect(() => {
    if (!tenantId) return;
    const t = getTenantById(tenantId);
    setTenant(t || null);
    const cfg = t?.config.translation;
    setEnabled(Boolean(cfg?.enabled));
    setAllowDeepL((cfg?.allowedProviders || ["deepl", "google"]).includes("deepl"));
    setAllowGoogle((cfg?.allowedProviders || ["deepl", "google"]).includes("google"));
    setAllowGoogleCloud((cfg?.allowedProviders || []).includes("google-cloud"));
    setDefaultProvider(cfg?.defaultProvider || "deepl");
    setHasChanges(false);
  }, [tenantId]);

  const resolvedAllowed = useMemo(() => {
    const out: TranslationProvider[] = [];
    if (allowDeepL) out.push("deepl");
    if (allowGoogleCloud) out.push("google-cloud");
    if (allowGoogle) out.push("google");
    return out;
  }, [allowDeepL, allowGoogle, allowGoogleCloud]);

  const handleSave = () => {
    if (!tenant) return;
    const translation = buildTranslationConfig({
      enabled,
      allowedProviders: resolvedAllowed,
      // Prefer DeepL Free as the primary engine (Google is fallback).
      defaultProvider,
    });
    const updated = updateTenant(tenant.id, {
      config: {
        ...tenant.config,
        translation,
      },
    });
    if (updated) {
      if (typeof window !== "undefined") {
        localStorage.setItem(`tenant_translation_provider:${updated.id}`, translation.defaultProvider);
      }
      setTenant(updated);
      setHasChanges(false);
      setIsSavedModalOpen(true);
    }
  };

  return (
    <AdminPageShell
      title="Translation"
      subtitle="Control document translation per tenant"
      breadcrumbs={[
        { label: "Admin Console", href: "/" },
        { label: "Translation", isActive: true },
      ]}
      headerActions={
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={!tenant || !hasChanges}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-white transition-all cursor-pointer ${
              tenant && hasChanges
                ? "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      }
    >
      <div className="pb-20 space-y-6">
        <ActionModal
          isOpen={isSavedModalOpen}
          onClose={() => setIsSavedModalOpen(false)}
          title="Translation settings saved"
          description="These settings apply to tenant translation requests immediately."
          actionText="OK"
          onAction={() => setIsSavedModalOpen(false)}
        />

        {!tenant ? (
          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <Languages className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  No tenant loaded
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Select/switch a tenant to configure translation.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
            <div className="bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 px-6 py-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                  <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    Translation Settings
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    Enable translation and choose allowed providers for this tenant
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    Enable translation
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-1">
                    When disabled, translation requests are rejected for this tenant.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEnabled((v) => !v);
                    setHasChanges(true);
                  }}
                  className={`w-12 h-7 rounded-full border transition-colors cursor-pointer ${
                    enabled
                      ? "bg-blue-600 border-blue-600"
                      : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  }`}
                  aria-label="Toggle translation"
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
                      enabled ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50/60 dark:bg-gray-900/30">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                  <Info className="w-4 h-4 text-gray-500" />
                  Provider notes
                </div>
                <ul className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>- DeepL requires a `DEEPL_AUTH_KEY` on the server.</li>
                  <li>- Google provider uses a free/unofficial endpoint in this build (good for dev; not guaranteed for production).</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setAllowDeepL((v) => !v);
                    setHasChanges(true);
                  }}
                  className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                    allowDeepL
                      ? "border-blue-300 bg-blue-50 dark:bg-blue-900/10"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">DeepL</div>
                    {allowDeepL && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Higher quality for many languages (free tier limits apply).
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAllowGoogleCloud((v) => !v);
                    setHasChanges(true);
                  }}
                  className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                    allowGoogleCloud
                      ? "border-blue-300 bg-blue-50 dark:bg-blue-900/10"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      Google Cloud
                    </div>
                    {allowGoogleCloud && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Paid Google translation (requires API key).
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAllowGoogle((v) => !v);
                    setHasChanges(true);
                  }}
                  className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                    allowGoogle
                      ? "border-blue-300 bg-blue-50 dark:bg-blue-900/10"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Google</div>
                    {allowGoogle && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Broad language support (dev-friendly).
                  </div>
                </button>
              </div>

              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  Primary engine
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  The system will try this provider first, then fall back to other allowed providers.
                </div>
                <div className="mt-3 flex items-center gap-4">
                  <label className={`inline-flex items-center gap-2 text-sm cursor-pointer ${allowDeepL ? "" : "opacity-50 pointer-events-none"}`}>
                    <input
                      type="radio"
                      name="defaultProvider"
                      value="deepl"
                      checked={defaultProvider === "deepl"}
                      onChange={() => {
                        setDefaultProvider("deepl");
                        setHasChanges(true);
                      }}
                      className="cursor-pointer"
                    />
                    <span className="text-gray-900 dark:text-white">DeepL Free</span>
                  </label>
                  <label className={`inline-flex items-center gap-2 text-sm cursor-pointer ${allowGoogleCloud ? "" : "opacity-50 pointer-events-none"}`}>
                    <input
                      type="radio"
                      name="defaultProvider"
                      value="google-cloud"
                      checked={defaultProvider === "google-cloud"}
                      onChange={() => {
                        setDefaultProvider("google-cloud");
                        setHasChanges(true);
                      }}
                      className="cursor-pointer"
                    />
                    <span className="text-gray-900 dark:text-white">Google Cloud (paid)</span>
                  </label>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Unofficial Google remains fallback-only.
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </AdminPageShell>
  );
}

