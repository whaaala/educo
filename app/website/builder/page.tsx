"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { siteStorage, type Site } from "@/lib/site-storage";

// SiteBuilder (via SlideCanvas) drives contentEditable — client-only.
const SiteBuilder = dynamic(() => import("@/components/shared/SiteBuilder/SiteBuilder"), { ssr: false });

/**
 * The website-builder EDITOR — a full-screen, standalone surface with NO admin chrome.
 * The builder is the outer product (the school's front door), not a page inside the admin app,
 * so it deliberately does not use MainLayout / the admin sidebar. A site id is required; without
 * one we send the user to the builder's own entry point at /website.
 */
export default function WebsiteBuilderPage() {
  const router = useRouter();
  const [site, setSite] = useState<Site | null>(null);

  useEffect(() => {
    try {
      const id = new URLSearchParams(window.location.search).get("id");
      const loaded = id ? siteStorage.get(id) : null;
      if (loaded) { setSite(loaded); return; }
      router.replace("/website"); // no/invalid site → front door
    } catch {
      router.replace("/website");
    }
  }, [router]);

  const handleChange = useCallback((next: Site) => setSite(next), []);

  if (!site) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-blue-100 dark:border-blue-900/30 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Opening your site…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden">
      <SiteBuilder value={site} onChange={handleChange} onExit={() => router.push("/website")} />
    </div>
  );
}
