"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Page loading hook with minimal delay for smooth transitions.
 * - Shows a brief loading state on page changes
 * - Reduced from 800ms to 150ms for faster perceived performance
 *
 * @param delay - Loading delay in ms (default: 150ms)
 */
export function usePageLoad(delay: number = 150) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Show loader on route change
    setIsLoading(true);

    // Short delay for smooth transition, then show content
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [pathname, searchParams, delay]);

  return isLoading;
}
