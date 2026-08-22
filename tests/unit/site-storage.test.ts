import { describe, it, expect, beforeEach } from "vitest";
import {
  siteStorage,
  createSite,
  createSection,
  createPage,
  createSiteFromTemplate,
  SITE_TEMPLATES,
  resolveSiteTheme,
  APP_THEME_BASE,
  SECTION_CATALOG,
  DEFAULT_THEME,
  type SectionType,
} from "@/lib/site-storage";

beforeEach(() => {
  localStorage.clear();
});

describe("site-storage — section templates (content-driven)", () => {
  it("every catalog section type produces a valid content-driven section", () => {
    for (const { type } of SECTION_CATALOG) {
      const sec = createSection(type);
      expect(sec.id).toMatch(/^sec-/);
      expect(sec.type).toBe(type);
      expect(sec.name.length).toBeGreaterThan(0);
      expect(typeof sec.content).toBe("object");
    }
  });

  it("catalog covers every SectionType exactly once", () => {
    const types = SECTION_CATALOG.map((c) => c.type);
    expect(new Set(types).size).toBe(types.length);
    const expected: SectionType[] = ["hero", "about", "features", "stats", "gallery", "testimonials", "cta", "contact", "custom"];
    for (const t of expected) expect(types).toContain(t);
  });

  it("catalog entries carry an icon name for the picker", () => {
    for (const c of SECTION_CATALOG) expect(typeof c.icon).toBe("string");
  });

  it("hero content has a heading and a primary CTA", () => {
    const hero = createSection("hero");
    expect(hero.content.heading).toBeTruthy();
    expect(hero.content.ctaPrimary?.label).toBeTruthy();
  });

  it("features and stats carry an items array", () => {
    expect(createSection("features").content.items?.length).toBeGreaterThan(0);
    expect(createSection("stats").content.items?.length).toBeGreaterThan(0);
  });

  it("section ids are unique across repeated creation", () => {
    const ids = Array.from({ length: 20 }, () => createSection("hero").id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("site-storage — page factory", () => {
  it("creates a page with name, path, and empty sections by default", () => {
    const p = createPage("About", "/about");
    expect(p.id).toMatch(/^page-/);
    expect(p.name).toBe("About");
    expect(p.path).toBe("/about");
    expect(p.sections).toEqual([]);
  });

  it("honours the isHome and withHero options", () => {
    const p = createPage("Home", "/", { isHome: true, withHero: true });
    expect(p.isHome).toBe(true);
    expect(p.sections[0].type).toBe("hero");
  });
});

describe("site-storage — site factory", () => {
  it("creates a site with a home page (hero/features/stats/cta), theme, nav, timestamps", () => {
    const site = createSite("Greenfield Academy");
    expect(site.id).toMatch(/^site-/);
    expect(site.name).toBe("Greenfield Academy");
    const home = site.pages[0];
    expect(home.isHome).toBe(true);
    expect(home.sections.map((s) => s.type)).toEqual(["hero", "features", "stats", "cta"]);
    expect(site.theme).toEqual(DEFAULT_THEME);
    expect(site.nav).toEqual([{ pageId: home.id, label: "Home" }]);
    expect(new Date(site.createdAt).toISOString()).toBe(site.createdAt);
  });

  it("applies a brand theme override (new sites start on-brand)", () => {
    const site = createSite("Brand Co", { primary: "#ff0000", accent: "#00ff00" });
    expect(site.theme.primary).toBe("#ff0000");
    expect(site.theme.accent).toBe("#00ff00");
    // untouched tokens keep defaults
    expect(site.theme.background).toBe(DEFAULT_THEME.background);
  });
});

describe("site-storage — templates", () => {
  it("each template builds a home page with its declared sections", () => {
    for (const tpl of SITE_TEMPLATES) {
      const site = createSiteFromTemplate("T", tpl.key, { primary: "#123456" });
      expect(site.pages[0].sections.map((s) => s.type)).toEqual(tpl.sections);
      expect(site.theme.primary).toBe("#123456"); // brand override applied
    }
  });

  it("the blank template has no sections", () => {
    const blank = createSiteFromTemplate("T", "blank");
    expect(blank.pages[0].sections).toEqual([]);
  });

  it("createSite is the 'classic' template", () => {
    expect(createSite("T").pages[0].sections.map((s) => s.type)).toEqual(["hero", "features", "stats", "cta"]);
  });

  it("siteStorage.createFromTemplate persists", () => {
    const site = siteStorage.createFromTemplate("Persisted", "showcase");
    expect(siteStorage.get(site.id)?.pages[0].sections.map((s) => s.type)).toEqual(["hero", "gallery", "testimonials", "cta"]);
  });
});

describe("site-storage — resolveSiteTheme (base follows app theme, brand stays)", () => {
  it("keeps brand tokens and overrides base from the app theme", () => {
    const site = { ...DEFAULT_THEME, primary: "#ff0000", accent: "#00ff00" };
    const dark = resolveSiteTheme(site, "dark");
    // brand kept
    expect(dark.primary).toBe("#ff0000");
    expect(dark.accent).toBe("#00ff00");
    expect(dark.headingFont).toBe(DEFAULT_THEME.headingFont);
    // base swapped to the dark app-theme base
    expect(dark.background).toBe(APP_THEME_BASE.dark.background);
    expect(dark.text).toBe(APP_THEME_BASE.dark.text);
  });

  it("each app theme yields a distinct base", () => {
    const bgs = ["light", "dark", "midnight", "purple"].map((t) => resolveSiteTheme(DEFAULT_THEME, t).background);
    expect(new Set(bgs).size).toBe(4);
  });

  it("falls back to light base for an unknown theme id", () => {
    expect(resolveSiteTheme(DEFAULT_THEME, "nope").background).toBe(APP_THEME_BASE.light.background);
  });
});

describe("site-storage — persistence (localStorage CRUD)", () => {
  it("list() is empty when nothing is stored", () => {
    expect(siteStorage.list()).toEqual([]);
  });

  it("create() persists a site retrievable by id", () => {
    const site = siteStorage.create("My School");
    expect(siteStorage.get(site.id)?.name).toBe("My School");
    expect(siteStorage.list().length).toBe(1);
  });

  it("create() accepts a brand theme override", () => {
    const site = siteStorage.create("Brand", { primary: "#123456" });
    expect(siteStorage.get(site.id)?.theme.primary).toBe("#123456");
  });

  it("save() updates an existing site and bumps updatedAt", async () => {
    const site = siteStorage.create("School A");
    const original = site.updatedAt;
    await new Promise((r) => setTimeout(r, 5));
    const saved = siteStorage.save({ ...site, name: "School A (renamed)" });
    expect(siteStorage.get(site.id)!.name).toBe("School A (renamed)");
    expect(saved.updatedAt >= original).toBe(true);
    expect(siteStorage.list().length).toBe(1);
  });

  it("remove() deletes a site", () => {
    const site = siteStorage.create("Doomed");
    siteStorage.remove(site.id);
    expect(siteStorage.get(site.id)).toBeNull();
  });

  it("round-trips nested sections/content through JSON", () => {
    const site = siteStorage.create("Nested");
    site.pages[0].sections.push(createSection("features"));
    siteStorage.save(site);
    const reloaded = siteStorage.get(site.id)!;
    const features = reloaded.pages[0].sections.find((s) => s.type === "features");
    expect(features?.content.items?.length).toBeGreaterThan(0);
  });

  it("getOrCreateDefault() returns the existing site or seeds one", () => {
    const first = siteStorage.getOrCreateDefault("Seeded");
    expect(first.name).toBe("Seeded");
    const second = siteStorage.getOrCreateDefault("Ignored");
    expect(second.id).toBe(first.id);
    expect(siteStorage.list().length).toBe(1);
  });

  it("migrates old (pre-content) sections on load so legacy sites keep working", () => {
    // A site saved under the previous freeform model: sections have `elements`, no `content`,
    // and a retired type ("staff").
    const legacy = {
      id: "site-legacy", name: "Legacy", theme: { primary: "#111111", accent: "#222222" },
      nav: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      pages: [{ id: "p1", name: "Home", path: "/", isHome: true, sections: [
        { id: "old1", type: "hero", name: "Hero", height: 460, background: "#fff", elements: [] },
        { id: "old2", type: "staff", name: "Our Staff", height: 480, background: "#eee", elements: [] },
      ] }],
    };
    localStorage.setItem("educo_sites", JSON.stringify([legacy]));

    const site = siteStorage.get("site-legacy")!;
    const secs = site.pages[0].sections;
    // Every section now has content; ids/names preserved.
    expect(secs[0].content).toBeDefined();
    expect(secs[0].content.heading).toBeTruthy();
    expect(secs[0].id).toBe("old1");
    // Retired "staff" type is remapped to a valid modern type.
    expect(secs[1].type).toBe("features");
    expect(secs[1].content.items?.length).toBeGreaterThan(0);
    // Missing theme tokens are backfilled from defaults.
    expect(site.theme.headingFont).toBe(DEFAULT_THEME.headingFont);
    expect(site.theme.primary).toBe("#111111");
  });

  it("list() sorts most-recently-updated first", async () => {
    const a = siteStorage.create("A");
    await new Promise((r) => setTimeout(r, 5));
    siteStorage.create("B");
    await new Promise((r) => setTimeout(r, 5));
    siteStorage.save({ ...a, name: "A2" });
    expect(siteStorage.list()[0].id).toBe(a.id);
  });
});
