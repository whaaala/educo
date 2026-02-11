"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Page loading hook with minimal delay for smooth transitions.
 * - Shows a brief loading state on page navigation (pathname changes only)
 * - Does NOT trigger on search param changes (e.g., view toggle, filters)
 *
 * @param delay - Loading delay in ms (default: 150ms)
 */
export function usePageLoad(delay: number = 150) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Show loader on route change
    setIsLoading(true);

    // Short delay for smooth transition, then show content
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [pathname, delay]);

  return isLoading;
}
