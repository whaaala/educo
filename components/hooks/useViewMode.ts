"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { UseViewModeReturn } from "@/types/components";

export type ViewMode = "grid" | "list";

export interface UseViewModeOptions {
  /** Default view mode */
  defaultMode?: ViewMode;
  /** Sync with URL params */
  syncWithUrl?: boolean;
  /** URL param name */
  urlParamName?: string;
  /** Animation duration in ms */
  transitionDuration?: number;
  /** Callback when view mode changes */
  onModeChange?: (mode: ViewMode) => void;
}

/**
 * Hook for managing view mode (grid/list) with URL synchronization
 *
 * @example
 * ```tsx
 * const { viewMode, setViewMode, isTransitioning } = useViewMode({
 *   defaultMode: "list",
 *   syncWithUrl: true,
 * });
 * ```
 */
export function useViewMode({
  defaultMode = "list",
  syncWithUrl = true,
  urlParamName = "view",
  transitionDuration = 300,
  onModeChange,
}: UseViewModeOptions = {}): UseViewModeReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get initial mode from URL or default
  const getInitialMode = (): ViewMode => {
    if (syncWithUrl) {
      const urlMode = searchParams.get(urlParamName);
      if (urlMode === "grid" || urlMode === "list") {
        return urlMode;
      }
    }
    return defaultMode;
  };

  const [viewMode, setViewModeState] = useState<ViewMode>(getInitialMode);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Sync with URL on mount and URL changes
  useEffect(() => {
    if (syncWithUrl) {
      const urlMode = searchParams.get(urlParamName);
      if (urlMode === "grid" || urlMode === "list") {
        if (urlMode !== viewMode) {
          setViewModeState(urlMode);
        }
      }
    }
  }, [searchParams, syncWithUrl, urlParamName, viewMode]);

  // Set view mode with transition and URL sync
  const setViewMode = useCallback(
    (mode: ViewMode) => {
      if (mode === viewMode) return;

      setIsTransitioning(true);

      // Update URL if syncing
      if (syncWithUrl) {
        const params = new URLSearchParams(searchParams.toString());
        params.set(urlParamName, mode);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }

      // Delay state update for smooth transition
      setTimeout(() => {
        setViewModeState(mode);
        onModeChange?.(mode);
        setTimeout(() => setIsTransitioning(false), 100);
      }, transitionDuration);
    },
    [
      viewMode,
      syncWithUrl,
      searchParams,
      urlParamName,
      router,
      pathname,
      transitionDuration,
      onModeChange,
    ]
  );

  return {
    viewMode,
    setViewMode,
    isTransitioning,
  };
}

export default useViewMode;
