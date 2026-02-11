"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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

  // Ref to track programmatic updates — prevents the URL-sync effect
  // from reverting state before router.replace updates searchParams
  const isProgrammaticUpdate = useRef(false);

  // Sync with URL on external navigation (browser back/forward)
  useEffect(() => {
    if (isProgrammaticUpdate.current) {
      isProgrammaticUpdate.current = false;
      return;
    }
    if (syncWithUrl) {
      const urlMode = searchParams.get(urlParamName);
      if (urlMode === "grid" || urlMode === "list") {
        setViewModeState(urlMode);
      }
    }
  }, [searchParams, syncWithUrl, urlParamName, viewMode]);

  // Set view mode with transition and URL sync
  const setViewMode = useCallback(
    (mode: ViewMode) => {
      if (mode === viewMode) return;

      setIsTransitioning(true);
      isProgrammaticUpdate.current = true;

      // Update state immediately for instant feedback
      setViewModeState(mode);
      onModeChange?.(mode);

      // Update URL as side effect (replace to avoid polluting history)
      if (syncWithUrl) {
        const params = new URLSearchParams(searchParams.toString());
        params.set(urlParamName, mode);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }

      // Clear transition after animation completes
      setTimeout(() => setIsTransitioning(false), transitionDuration);
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
