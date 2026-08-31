import { describe, it, expect } from "vitest";
import { createContainer, type BoxNode } from "@/lib/box-model";
import {
  slugify, uniquePath, siteFromRoot, findPage, setPageRoot, addPage, duplicatePage, renamePage,
  deletePage, setHomePage, coerceSite, pageIdFromHref, emptyPageRoot, type BoxSite,
} from "@/lib/box-site";

const root = () => createContainer("column", { id: "r", children: [] } as Partial<BoxNode>);

describe("box-site — multi-page model", () => {
  it("slugify makes URL-safe paths", () => {
    expect(slugify("About Us")).toBe("about-us");
    expect(slugify("  Hello!!  ")).toBe("hello");
    expect(slugify("")).toBe("page");
  });

  it("siteFromRoot wraps a tree as a one-page site with a home", () => {
    const s = siteFromRoot(root(), "Home");
    expect(s.pages).toHaveLength(1);
    expect(s.homeId).toBe(s.pages[0].id);
    expect(s.pages[0].path).toBe("home");
  });

  it("addPage appends a page with a UNIQUE slug and returns its id", () => {
    let s = siteFromRoot(root());
    const a = addPage(s, "About", emptyPageRoot()); s = a.site;
    const b = addPage(s, "About", emptyPageRoot()); s = b.site; // same name → unique slug
    expect(s.pages.map((p) => p.path)).toEqual(["home", "about", "about-2"]);
    expect(findPage(s, b.id)).toBeTruthy();
  });

  it("uniquePath ignores the page's own slug when renaming", () => {
    let s = siteFromRoot(root());
    s = addPage(s, "About", emptyPageRoot()).site;
    const about = s.pages[1];
    expect(uniquePath(s, "About", about.id)).toBe("about"); // its own slug is free to keep
  });

  it("setPageRoot swaps a page's tree without touching others", () => {
    let s = siteFromRoot(root());
    s = addPage(s, "About", emptyPageRoot()).site;
    const newRoot = createContainer("column", { id: "changed" } as Partial<BoxNode>);
    s = setPageRoot(s, s.pages[0].id, newRoot);
    expect(s.pages[0].root.id).toBe("changed");
    expect(s.pages[1].root.id).not.toBe("changed");
  });

  it("duplicatePage inserts a copy right after with a fresh id + unique slug", () => {
    let s = siteFromRoot(root());
    const d = duplicatePage(s, s.pages[0].id); s = d.site;
    expect(s.pages).toHaveLength(2);
    expect(s.pages[1].id).toBe(d.id);
    expect(s.pages[1].id).not.toBe(s.pages[0].id);
    expect(s.pages[1].name).toMatch(/copy/);
  });

  it("deletePage never removes the last page, and reassigns home if needed", () => {
    let s = siteFromRoot(root());
    s = addPage(s, "About", emptyPageRoot()).site;
    const homeId = s.homeId;
    s = deletePage(s, homeId); // delete the home page
    expect(s.pages).toHaveLength(1);
    expect(s.homeId).toBe(s.pages[0].id); // home reassigned
    const single = deletePage(s, s.pages[0].id); // can't delete the last one
    expect(single.pages).toHaveLength(1);
  });

  it("setHomePage + renamePage", () => {
    let s = siteFromRoot(root());
    s = addPage(s, "About", emptyPageRoot()).site;
    s = setHomePage(s, s.pages[1].id);
    expect(s.homeId).toBe(s.pages[1].id);
    s = renamePage(s, s.pages[1].id, "Company");
    expect(s.pages[1].name).toBe("Company");
    expect(s.pages[1].path).toBe("company");
  });

  it("coerceSite accepts a site as-is and migrates a legacy single tree", () => {
    const s = siteFromRoot(root());
    expect(coerceSite(s)).toBe(s as unknown); // already a site
    const legacy = coerceSite(createContainer("column", { children: [] } as Partial<BoxNode>) as unknown);
    expect(legacy?.pages).toHaveLength(1);
    expect(coerceSite(null)).toBeNull();
    expect(coerceSite({ nonsense: true })).toBeNull();
  });

  it("pageIdFromHref extracts a page id from a page: link", () => {
    expect(pageIdFromHref("page:abc")).toBe("abc");
    expect(pageIdFromHref("https://x.com")).toBeNull();
    expect(pageIdFromHref(undefined)).toBeNull();
  });
});
