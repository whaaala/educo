import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { menuItems, UNBUILT } from "@/components/layout/Sidebar";

// S2-i: every link in the app's menu opens a page. A link to a page that was never built was a 404 — and the page
// PREFETCHED it, so every screen with the sidebar logged two console errors (found by side-by-side-resize.spec.ts).
const hasPage = (href: string) => {
  const path = href.split("?")[0].replace(/\/$/, "");
  return existsSync(join(process.cwd(), "app", path, "page.tsx"));
};
type Item = { href?: string; children?: Item[] };
const hrefs = (items: Item[]): string[] => items.flatMap((m) => [...(m.href ? [m.href] : []), ...hrefs(m.children ?? [])]);

describe("the sidebar's links", () => {
  const internal = hrefs(menuItems).filter((h) => h.startsWith("/"));

  it.each(internal)("%s opens a page that exists", (href) => {
    expect(hasPage(href), `${href} has no app/…/page.tsx`).toBe(true);
  });

  it.each([...UNBUILT])("%s is hidden because it is not built — once its page exists, delete it from UNBUILT", (href) => {
    expect(hasPage(href)).toBe(false);
    expect(internal).not.toContain(href);
  });
});
