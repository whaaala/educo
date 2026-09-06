"use client";

import { useEffect, useMemo, useState } from "react";

interface StoredDashboardLayoutV1 {
  version: string;
  customized: boolean;
  order: string[];
}

function isStoredDashboardLayoutV1(value: unknown): value is StoredDashboardLayoutV1 {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.version === "string" &&
    typeof v.customized === "boolean" &&
    Array.isArray(v.order) &&
    v.order.every((x) => typeof x === "string")
  );
}

function safeParseJsonUnknown(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function arraysEqual(a: string[], b: string[]) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function reconcileOrder(saved: string[] | null, available: string[], fallback: string[]) {
  const availableSet = new Set(available);
  const out: string[] = [];
  const seen = new Set<string>();

  const seed = (saved && saved.length ? saved : fallback).filter((id) => availableSet.has(id));
  for (const id of seed) {
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  for (const id of available) {
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

export function useDashboardLayout(
  storageKey: string,
  availableIds: string[],
  defaultOrder: string[],
  options?: {
    /** Bump this to roll out new defaults for non-customized users */
    defaultVersion: string;
    /** Default order used by the previous version (to detect "never customized" legacy arrays) */
    legacyDefaultOrder?: string[];
  }
) {
  const defaultVersion = options?.defaultVersion ?? "v1";
  const stableAvailableIds = useMemo(() => availableIds, [availableIds.join("|")]); // stable reference
  const stableDefaultOrder = useMemo(() => defaultOrder, [defaultOrder.join("|")]); // stable reference
  const stableLegacyDefaultOrder = useMemo(
    () => options?.legacyDefaultOrder,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options?.legacyDefaultOrder?.join("|") ?? ""]
  );

  const [order, setOrder] = useState<string[]>(() => reconcileOrder(null, stableAvailableIds, stableDefaultOrder));
  const [customized, setCustomized] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    const parsed = safeParseJsonUnknown(raw);

    // New format: { version, customized, order }
    if (isStoredDashboardLayoutV1(parsed)) {
      const savedOrder = reconcileOrder(parsed.order, stableAvailableIds, stableDefaultOrder);

      // If the user customized, keep their order regardless of default version bumps.
      // If not customized, always apply the latest default order.
      setCustomized(parsed.customized);
      setOrder(parsed.customized ? savedOrder : reconcileOrder(null, stableAvailableIds, stableDefaultOrder));
      setIsHydrated(true);
      return;
    }

    // Legacy format: stored JSON array
    const legacySaved = Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : null;
    const legacyFallback = stableLegacyDefaultOrder ?? stableDefaultOrder;
    const legacyBaseline = reconcileOrder(null, stableAvailableIds, legacyFallback);
    const legacyResolved = reconcileOrder(legacySaved, stableAvailableIds, legacyFallback);
    const legacyCustomized = !arraysEqual(legacyResolved, legacyBaseline);

    setCustomized(legacyCustomized);
    setOrder(legacyCustomized ? legacyResolved : reconcileOrder(null, stableAvailableIds, stableDefaultOrder));
    setIsHydrated(true);
  }, [storageKey, stableAvailableIds, stableDefaultOrder, stableLegacyDefaultOrder, defaultVersion]);

  useEffect(() => {
    if (!isHydrated) return;
    const payload: StoredDashboardLayoutV1 = {
      version: defaultVersion,
      customized,
      order,
    };
    localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [customized, defaultVersion, isHydrated, order, storageKey]);

  const setOrderAndMarkCustomized = (next: string[]) => {
    setCustomized(true);
    setOrder(reconcileOrder(next, stableAvailableIds, stableDefaultOrder));
  };

  const reset = () => {
    setCustomized(false);
    setOrder(reconcileOrder(null, stableAvailableIds, stableDefaultOrder));
  };

  return { order, setOrder: setOrderAndMarkCustomized, reset, customized };
}


