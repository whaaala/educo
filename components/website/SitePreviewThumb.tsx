"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Site } from "@/lib/site-storage";
import { resolveSiteTheme } from "@/lib/site-storage";
import { useTheme } from "@/contexts/ThemeContext";
import SiteRenderer from "@/components/website/sections/SiteRenderer";

const DESIGN_WIDTH = 1280;

/**
 * A live, scaled-down preview of a site's home page — a real thumbnail rendered from the same
 * section components as the builder/published site (not a flat swatch). Reusable in cards, the
 * hero mock, etc. Non-interactive (pointer-events none).
 */
export default function SitePreviewThumb({ site, className = "", heightClass = "h-44" }: { site: Site; className?: string; heightClass?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.28);
  const { theme: appTheme } = useTheme();
  const home = site.pages.find((p) => p.isHome) ?? site.pages[0];
  // The preview's base (bg/text) follows the app theme; the site's brand colours stay.
  const renderTheme = useMemo(() => resolveSiteTheme(site.theme, appTheme), [site.theme, appTheme]);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const update = () => setScale(el.clientWidth / DESIGN_WIDTH);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${heightClass} ${className}`} style={{ background: renderTheme.background }} aria-hidden="true">
      <div className="absolute top-0 left-0 origin-top-left pointer-events-none select-none" style={{ width: DESIGN_WIDTH, transform: `scale(${scale})` }}>
        {home && <SiteRenderer site={site} page={home} theme={renderTheme} />}
      </div>
    </div>
  );
}
