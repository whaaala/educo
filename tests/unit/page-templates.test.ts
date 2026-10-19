import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import TEMPLATES from "@/config/page-templates.json";
import SECTIONS from "@/config/sections.json";
import { templatePage, type SectionLookup } from "@/lib/page-templates";
import { myTemplates } from "@/lib/saved-sections";
import { regionBlock, createContainer, createElement, makeRowBand, type BoxNode } from "@/lib/box-model";
import { addPage, type BoxSite } from "@/lib/box-site";
import type { SectionDef } from "@/lib/section-library";

/** PS-5 (3) · a new page from a template — box-builder-sections.feature (built-in templates; my own, up to 40; a copy with the site's header and footer). */

const ROOT = process.cwd();
const ALL: SectionDef[] = (SECTIONS.categories as { id: string }[]).flatMap((c) => { try { return (JSON.parse(readFileSync(join(ROOT, "config", "sections", `${c.id}.json`), "utf8")) as { sections: SectionDef[] }).sections; } catch { return []; } });
const lookup: SectionLookup = (id) => ALL.find((s) => s.id === id);
const words = (n: BoxNode): string[] => [...(n.text ? [n.text] : []), ...(n.children ?? []).flatMap(words)];

describe("page templates", () => {
  beforeEach(() => localStorage.clear());

  it("every built-in template names sections that exist", () => {
    for (const t of TEMPLATES.templates) for (const id of t.sections) expect(lookup(id), `${t.id} → ${id}`).toBeTruthy();
  });

  it("a template builds a page of its sections, in order, each a band; its header and footer are the page's regions", () => {
    const t = TEMPLATES.templates[0];
    const root = templatePage(t.sections, lookup, { finish: "calm", wireframe: false });
    expect(root.children!.length).toBe(t.sections.length);
    for (const b of root.children!) expect(b.rowBand).toBe(true);
    expect(regionBlock(root.children![0])?.tag).toBe("header");
    expect(regionBlock(root.children!.at(-1)!)?.tag).toBe("footer");
  });

  it("a page added from a template takes the SITE's shared header and footer, when the site has them", () => {
    const shared = (tag: "header" | "footer", w: string) => { const s = createContainer("column", { tag, shared: true }); s.children = [createElement("text", { text: w })]; return s; };
    const home = createContainer("column"); home.children = [makeRowBand([shared("header", "Our header")]), makeRowBand([shared("footer", "Our footer")])];
    const site: BoxSite = { homeId: "h", pages: [{ id: "h", name: "Home", path: "home", root: home }] };
    const t = TEMPLATES.templates[0];
    const { site: next, id } = addPage(site, "Open day", templatePage(t.sections, lookup, { finish: "plain", wireframe: false }));
    const page = next.pages.find((p) => p.id === id)!.root;
    expect(words(regionBlock(page.children![0])!)).toEqual(["Our header"]);
    expect(words(regionBlock(page.children!.at(-1)!)!)).toEqual(["Our footer"]);
  });

  it("my templates: saved under a name, in every site, capped by config (Webflow's 40)", () => {
    const root = templatePage(TEMPLATES.templates[0].sections, lookup, { finish: "plain", wireframe: false });
    expect(myTemplates.save(root, "Department page").ok).toBe(true);
    expect(myTemplates.list().map((t) => t.name)).toEqual(["Department page"]);
    const limit = SECTIONS.limits.myTemplates;
    localStorage.setItem(myTemplates.key, JSON.stringify(Array.from({ length: limit }, (_, i) => ({ id: `t${i}`, name: `T${i}`, savedAt: 0, node: root }))));
    expect(myTemplates.save(root, "One more")).toEqual({ ok: false, reason: "limit", limit });
  });
});
