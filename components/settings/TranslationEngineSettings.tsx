"use client";

import { useEffect, useMemo, useState } from "react";
import { Languages, Save, CheckCircle2, AlertTriangle } from "lucide-react";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import type { TranslationProvider, TenantTranslationConfig } from "@/types/school";

type LoadState = "idle" | "loading" | "ready" | "error";

function uniqProviders(p: TranslationProvider[]): TranslationProvider[] {
  return Array.from(new Set(p.filter((x) => x === "deepl" || x === "google" || x === "google-cloud")));
}

function normalizeConfig(cfg: TenantTranslationConfig | null): TenantTranslationConfig {
  const allowed = uniqProviders(cfg?.allowedProviders || (["google"] as TranslationProvider[]));
  const safeAllowed: TranslationProvider[] = allowed.length ? allowed : ["google"];
  // Prefer DeepL as the primary engine; Google Cloud is paid secondary; unofficial Google is fallback-only.
  const dp = safeAllowed.includes("deepl")
    ? "deepl"
    : safeAllowed.includes("google-cloud")
      ? "google-cloud"
      : (cfg?.defaultProvider || safeAllowed[0]);
  return {
    enabled: Boolean(cfg?.enabled),
    allowedProviders: safeAllowed,
    defaultProvider: safeAllowed.includes(dp) ? dp : safeAllowed[0],
  };
}

export default function TranslationEngineSettings() {
  const { settings } = useSchoolSettings();
  const tenantId = settings.tenantId || "educo-default";

  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [serverConfig, setServerConfig] = useState<TenantTranslationConfig | null>(null);
  const [draftEnabled, setDraftEnabled] = useState(false);
  const [draftAllowed, setDraftAllowed] = useState<TranslationProvider[]>(["deepl", "google"]);
  const [draftDefault, setDraftDefault] = useState<TranslationProvider>("deepl");
  const [hasChanges, setHasChanges] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allowedOptions = useMemo(() => uniqProviders(draftAllowed), [draftAllowed]);

  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");
    setSaved(false);
    setError(null);

    fetch(`/api/tenants/${encodeURIComponent(tenantId)}/translation`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load");
        return (await res.json()) as { translation: TenantTranslationConfig | null };
      })
      .then((data) => {
        if (cancelled) return;
        const normalized = normalizeConfig(data.translation);
        setServerConfig(normalized);
        setDraftEnabled(normalized.enabled);
        setDraftAllowed(normalized.allowedProviders);
        setDraftDefault(normalized.defaultProvider);
        try {
          localStorage.setItem(`tenant_translation_provider:${tenantId}`, normalized.defaultProvider);
        } catch {
          // ignore
        }
        setHasChanges(false);
        setLoadState("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setLoadState("error");
        setError("Could not load tenant translation settings.");
      });

    return () => {
      cancelled = true;
    };
  }, [tenantId]);

  const handleSave = async () => {
    setSaved(false);
    setError(null);
    try {
      const normalized = normalizeConfig({
        enabled: draftEnabled,
        allowedProviders: allowedOptions.length ? allowedOptions : ["google"],
        // Primary engine is DeepL Free when allowed; otherwise allow Google Cloud as primary,
        // and keep unofficial Google as fallback-only.
        defaultProvider: allowedOptions.includes("deepl")
          ? "deepl"
          : allowedOptions.includes("google-cloud")
            ? "google-cloud"
            : draftDefault,
      });

      const res = await fetch(`/api/tenants/${encodeURIComponent(tenantId)}/translation`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ translation: normalized }),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = (await res.json()) as { translation: TenantTranslationConfig };
      const next = normalizeConfig(data.translation);
      setServerConfig(next);
      setDraftEnabled(next.enabled);
      setDraftAllowed(next.allowedProviders);
      setDraftDefault(next.defaultProvider);
      setHasChanges(false);
      setSaved(true);
      try {
        localStorage.setItem(`tenant_translation_provider:${tenantId}`, next.defaultProvider);
      } catch {
        // ignore
      }
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Failed to save translation settings.");
    }
  };

  const disabledByTenant = !serverConfig?.enabled && loadState === "ready";
  const effectiveAllowed = serverConfig?.allowedProviders || ["google"];

  return (
    <section className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 px-6 py-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
              <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Translation engine (tenant)
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                Choose which provider this tenant should use across apps.
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loadState !== "ready" || !hasChanges}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-white transition-all ${
              loadState === "ready" && hasChanges
                ? "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {loadState === "loading" && (
          <div className="text-sm text-gray-600 dark:text-gray-400">Loading…</div>
        )}

        {loadState === "error" && (
          <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
            <AlertTriangle className="w-4 h-4 mt-0.5" />
            {error}
          </div>
        )}

        {saved && (
          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
            <CheckCircle2 className="w-4 h-4" />
            Saved.
          </div>
        )}

        {loadState === "ready" && (
          <>
            <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  Translation enabled for this tenant
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This is controlled by tenant provisioning. If disabled, apps cannot translate.
                </div>
              </div>
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  serverConfig?.enabled
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-[#0f1115]/30 dark:text-gray-400"
                }`}
              >
                {serverConfig?.enabled ? "Enabled" : "Disabled"}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-[#0f1115]/30">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                Allowed providers (from tenant config)
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {effectiveAllowed.map((p) => p.toUpperCase()).join(", ")}
              </div>
            </div>

            <div className={`${disabledByTenant ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Primary engine
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {effectiveAllowed.map((p) => (
                  <label
                    key={p}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                      draftDefault === p
                        ? "border-blue-300 bg-blue-50 dark:bg-blue-900/10"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f1115]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="translation-provider"
                      value={p}
                      checked={draftDefault === p}
                      disabled={p === "google"}
                      onChange={() => {
                        setDraftDefault(p);
                        setHasChanges(true);
                      }}
                      className="cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {p === "deepl"
                        ? "DeepL Free"
                        : p === "google-cloud"
                          ? "Google Cloud (paid)"
                          : "Google (fallback)"}
                    </span>
                  </label>
                ))}
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                DeepL is used first. Google Cloud can be used when enabled. Unofficial Google is fallback-only.
              </div>

              {!serverConfig?.enabled && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Translation is disabled for this tenant by provisioning settings.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

