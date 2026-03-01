"use client";

import { useState, useCallback } from "react";
import {
  Cloud, CheckCircle2, HardDrive, ExternalLink, Unplug, RefreshCw,
  Database, AlertTriangle,
} from "lucide-react";
import { useStorage, type UserStorageConnection } from "@/contexts/StorageContext";
import type { StorageProviderType } from "@/types/school";

// User context — safe import with try-catch
import { useUser as _useUser } from "@/contexts/UserContext";
function useSafeUser() {
  try { return _useUser(); } catch { return { user: null }; }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function StorageSettings() {
  const { user: currentUser } = useSafeUser();
  const {
    settings,
    updateSettings,
    getUserConnection,
    connectUser,
    disconnectUser,
    isSupabaseConfigured: supabaseReady,
    supabaseQuotaUsed,
    supabaseQuotaTotal,
    isSupabaseQuotaExceeded,
    refreshSupabaseQuota,
    connectDropboxOverflow,
    isDropboxOverflowConnected,
  } = useStorage();

  const [isConnecting, setIsConnecting] = useState(false);
  const [isRefreshingQuota, setIsRefreshingQuota] = useState(false);
  const userId = currentUser?.id || "anonymous";
  const connection = getUserConnection(userId);
  const hasDropboxOverflow = isDropboxOverflowConnected(userId);
  const quotaPercent = supabaseQuotaTotal > 0 ? (supabaseQuotaUsed / supabaseQuotaTotal) * 100 : 0;

  const handleRefreshQuota = useCallback(async () => {
    setIsRefreshingQuota(true);
    await refreshSupabaseQuota();
    setIsRefreshingQuota(false);
  }, [refreshSupabaseQuota]);

  const handleConnectDropbox = useCallback(() => {
    setIsConnecting(true);
    connectDropboxOverflow(userId);
  }, [connectDropboxOverflow, userId]);

  // Handle OAuth callback results (existing Dropbox flow)
  const handleOAuthResult = useCallback(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("connected") === "true" && params.get("tab") === "storage") {
      const provider = (params.get("provider") || "dropbox") as StorageProviderType;
      const accountEmail = params.get("accountEmail") || "";
      const accountName = params.get("accountName") || "";

      const newConnection: UserStorageConnection = {
        provider,
        connected: true,
        accountEmail,
        accountName,
        connectedAt: new Date().toISOString(),
        hasValidToken: true,
      };

      connectUser(userId, newConnection);

      // Clean up URL params
      const url = new URL(window.location.href);
      url.searchParams.delete("connected");
      url.searchParams.delete("provider");
      url.searchParams.delete("accountEmail");
      url.searchParams.delete("accountName");
      url.searchParams.delete("accessToken");
      url.searchParams.delete("refreshToken");
      url.searchParams.delete("expiresIn");
      url.searchParams.delete("tab");
      window.history.replaceState({}, "", url.toString());
    }
  }, [connectUser, userId]);

  // Run once on mount
  useState(() => { handleOAuthResult(); });

  const handleDisconnect = useCallback(() => {
    if (confirm("Disconnect your Dropbox overflow account? You can reconnect at any time.")) {
      disconnectUser(userId);
    }
  }, [disconnectUser, userId]);

  return (
    <div className="space-y-6">
      {/* ── Platform Storage (Supabase) ── */}
      <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 midnight:bg-cyan-500/20 purple:bg-pink-500/20">
            <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400 midnight:text-cyan-400 purple:text-pink-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Platform Storage
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Built-in storage for all users. No setup required.
            </p>
          </div>
        </div>

        {/* Status */}
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
          supabaseReady
            ? "bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20"
            : "bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
        }`}>
          {supabaseReady ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  Active
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Supabase Storage is configured and ready
                </p>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Not configured
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
                </p>
              </div>
            </>
          )}
        </div>

        {/* Quota usage */}
        {supabaseReady && supabaseQuotaTotal > 0 && (
          <div className="mt-4 px-4">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
              <span>Your storage usage</span>
              <div className="flex items-center gap-2">
                <span>{formatBytes(supabaseQuotaUsed)} / {formatBytes(supabaseQuotaTotal)}</span>
                <button
                  onClick={handleRefreshQuota}
                  className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                  title="Refresh quota"
                >
                  <RefreshCw className={`w-3 h-3 text-gray-400 ${isRefreshingQuota ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>
            <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  quotaPercent > 90 ? "bg-red-500" : quotaPercent > 70 ? "bg-amber-500" : "bg-indigo-500"
                }`}
                style={{ width: `${Math.min(100, quotaPercent)}%` }}
              />
            </div>
            {isSupabaseQuotaExceeded && (
              <p className="text-xs text-red-500 mt-1">
                Storage full. Connect Dropbox below for additional space.
              </p>
            )}
          </div>
        )}

        {/* Quota setting (admin) */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Per-user Quota
          </label>
          <select
            value={settings.supabaseUserQuotaMb}
            onChange={(e) => updateSettings({ supabaseUserQuotaMb: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100"
          >
            <option value="50">50 MB</option>
            <option value="100">100 MB (Default)</option>
            <option value="250">250 MB</option>
            <option value="500">500 MB</option>
            <option value="1024">1 GB</option>
            <option value="0">Unlimited</option>
          </select>
        </div>
      </div>

      {/* ── Additional Storage (Dropbox Overflow) ── */}
      <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-500/20">
            <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Additional Storage (Dropbox)
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connect your Dropbox account for extra space when platform storage is full.
            </p>
          </div>
        </div>

        {/* Enable toggle */}
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            id="dropboxOverflow"
            checked={settings.dropboxOverflowEnabled}
            onChange={(e) => updateSettings({ dropboxOverflowEnabled: e.target.checked })}
            className="w-4 h-4 text-indigo-600 rounded"
          />
          <label htmlFor="dropboxOverflow" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            Enable Dropbox overflow when platform storage is full
          </label>
        </div>

        {settings.dropboxOverflowEnabled && (
          <>
            {hasDropboxOverflow && connection?.connected ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                      Connected to Dropbox
                    </p>
                    {connection.accountEmail && (
                      <p className="text-xs text-green-600 dark:text-green-400 truncate">
                        {connection.accountName ? `${connection.accountName} — ` : ""}{connection.accountEmail}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors cursor-pointer"
                  >
                    <Unplug className="w-3.5 h-3.5" />
                    Disconnect
                  </button>
                </div>

                {/* Dropbox quota */}
                {connection.quotaUsed !== undefined && connection.quotaTotal !== undefined && connection.quotaTotal > 0 && (
                  <div className="px-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Dropbox storage used</span>
                      <span>{formatBytes(connection.quotaUsed)} / {formatBytes(connection.quotaTotal)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{ width: `${Math.min(100, (connection.quotaUsed / connection.quotaTotal) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {connection.connectedAt && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 px-4">
                    Connected on {new Date(connection.connectedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <HardDrive className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Not connected. When your platform storage is full, files will overflow to your Dropbox account.
                  </p>
                </div>

                <button
                  onClick={handleConnectDropbox}
                  disabled={isConnecting}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isConnecting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4" />
                  )}
                  Connect to Dropbox
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── File Settings ── */}
      <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
          File Settings
        </h4>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Upload Size
            </label>
            <select
              value={settings.maxUploadSizeMb}
              onChange={(e) => updateSettings({ maxUploadSizeMb: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="10">10 MB</option>
              <option value="25">25 MB</option>
              <option value="50">50 MB</option>
              <option value="100">100 MB</option>
              <option value="150">150 MB</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="enableFileSharing"
              checked={settings.enableFileSharing}
              onChange={(e) => updateSettings({ enableFileSharing: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <label htmlFor="enableFileSharing" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              Allow users to share files via shared links
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="enableFolderSharing"
              checked={settings.enableFolderSharing}
              onChange={(e) => updateSettings({ enableFolderSharing: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <label htmlFor="enableFolderSharing" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              Allow users to share entire folders
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
