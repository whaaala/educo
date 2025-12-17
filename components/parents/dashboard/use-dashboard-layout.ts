"use client";

import { useEffect, useMemo, useState } from "react";

function safeParseJsonArray(value: string | null): string[] | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return null;
    const strings = parsed.filter((x): x is string => typeof x === "string");
    return strings.length ? strings : [];
  } catch {
    return null;
  }
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

export function useDashboardLayout(storageKey: string, availableIds: string[], defaultOrder: string[]) {
  const stableAvailableIds = useMemo(() => availableIds, [availableIds.join("|")]); // stable reference
  const stableDefaultOrder = useMemo(() => defaultOrder, [defaultOrder.join("|")]); // stable reference

  const [order, setOrder] = useState<string[]>(() => reconcileOrder(null, stableAvailableIds, stableDefaultOrder));
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = safeParseJsonArray(localStorage.getItem(storageKey));
    setOrder(reconcileOrder(saved, stableAvailableIds, stableDefaultOrder));
    setIsHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, stableAvailableIds, stableDefaultOrder]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(storageKey, JSON.stringify(order));
  }, [isHydrated, order, storageKey]);

  const reset = () => setOrder(reconcileOrder(null, stableAvailableIds, stableDefaultOrder));

  return { order, setOrder, reset };
}


