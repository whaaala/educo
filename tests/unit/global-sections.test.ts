import { describe, it, expect } from "vitest";
import { makeGlobal, detachGlobal, globalsInSite, globalCopy, removeGlobal, syncGlobals } from "@/lib/global-sections";
import { setPageRoot, type BoxSite } from "@/lib/box-site";
import { createContainer, createElement, makeRowBand, updateBox, findBox, type BoxNode } from "@/lib/box-model";
import { renderSiteFiles } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/** PS-5 (2) · a global section, edited once — box-builder-sections.feature (D3 signed 2026-10-19). */

const banner = (words = "Admissions open") => { const s = createContainer("column", { tag: "section" }); s.children = [createElement("heading", { text: words })]; return s; };
const pageRoot = (...secs: BoxNode[]) => { const r = createContainer("column"); r.children = secs.map((s) => makeRowBand([s])); return r; };
const site = (): BoxSite => ({ homeId: "home", pages: [
  { id: "home", name: "Home", path: "home", root: pageRoot(banner(), banner("Welcome")) },
  { id: "dates", name: "Term dates", path: "term-dates", root: pageRoot(banner("Dates")) },
] });
const words = (n: BoxNode): string[] => [...(n.text ? [n.text] : []), ...(n.children ?? []).flatMap(words)];
const sectionOf = (root: BoxNode, i: number) => root.children![i].children![0];

describe("global sections", () => {
  it("making a section global names it; the list says how many pages use it", () => {
    let s = site();
    const sec = sectionOf(s.pages[0].root, 0);
    s = { ...s, pages: s.pages.map((p) => (p.id === "home" ? { ...p, root: makeGlobal(p.root, sec.id, "Admissions banner") } : p)) };
    expect(globalsInSite(s)).toEqual([expect.objectContaining({ name: "Admissions banner", pages: 1, copies: 1 })]);
  });

  it("it can go on several pages, and more than once on one page (D3)", () => {
    let s = site();
    const sec = sectionOf(s.pages[0].root, 0);
    s = { ...s, pages: s.pages.map((p) => (p.id === "home" ? { ...p, root: makeGlobal(p.root, sec.id, "Admissions banner") } : p)) };
    const gid = globalsInSite(s)[0].id;
    const dates = s.pages[1];
    const twice = { ...dates.root, children: [...dates.root.children!, makeRowBand([globalCopy(s, gid)!]), makeRowBand([globalCopy(s, gid)!])] };
    s = setPageRoot(s, "dates", twice);
    expect(globalsInSite(s)[0]).toEqual(expect.objectContaining({ pages: 2, copies: 3 }));
  });

  it("ONE edit changes every copy, on every page — and the ids stay unique on each page", () => {
    let s = site();
    const sec = sectionOf(s.pages[0].root, 0);
    s = { ...s, pages: s.pages.map((p) => (p.id === "home" ? { ...p, root: makeGlobal(p.root, sec.id, "Admissions banner") } : p)) };
    const gid = globalsInSite(s)[0].id;
    s = setPageRoot(s, "dates", { ...s.pages[1].root, children: [...s.pages[1].root.children!, makeRowBand([globalCopy(s, gid)!]), makeRowBand([globalCopy(s, gid)!])] });
    const home = s.pages[0].root;
    const heading = sectionOf(home, 0).children![0].children?.[0] ?? sectionOf(home, 0).children![0];
    s = setPageRoot(s, "home", updateBox(home, heading.id, { text: "Admissions close Friday" }));
    const dates = s.pages[1].root;
    expect(words(sectionOf(dates, 1))).toEqual(["Admissions close Friday"]);
    expect(words(sectionOf(dates, 2))).toEqual(["Admissions close Friday"]);
    expect(words(sectionOf(dates, 0)), "an ordinary section is untouched").toEqual(["Dates"]);
    const ids: string[] = []; (function walk(n: BoxNode) { ids.push(n.id); n.children?.forEach(walk); })(dates);
    expect(new Set(ids).size, "unique ids on the page").toBe(ids.length);
  });

  it("Detach makes one copy ordinary: changing it no longer changes the others", () => {
    let s = site();
    const sec = sectionOf(s.pages[0].root, 0);
    s = { ...s, pages: s.pages.map((p) => (p.id === "home" ? { ...p, root: makeGlobal(p.root, sec.id, "Admissions banner") } : p)) };
    const gid = globalsInSite(s)[0].id;
    s = setPageRoot(s, "dates", { ...s.pages[1].root, children: [...s.pages[1].root.children!, makeRowBand([globalCopy(s, gid)!])] });
    s = setPageRoot(s, "home", detachGlobal(s.pages[0].root, sectionOf(s.pages[0].root, 0).id));
    const home = s.pages[0].root;
    const h = findBox(sectionOf(home, 0), sectionOf(home, 0).children![0].id)!;
    const target = h.type === "heading" ? h : h.children![0];
    s = setPageRoot(s, "home", updateBox(home, target.id, { text: "Only here" }));
    expect(words(sectionOf(s.pages[1].root, 1))).toEqual(["Admissions open"]);
    expect(globalsInSite(s)[0]).toEqual(expect.objectContaining({ pages: 1, copies: 1 }));
  });

  it("deleting a global section from the list keeps every copy, as an ordinary section", () => {
    let s = site();
    const sec = sectionOf(s.pages[0].root, 0);
    s = { ...s, pages: s.pages.map((p) => (p.id === "home" ? { ...p, root: makeGlobal(p.root, sec.id, "Admissions banner") } : p)) };
    const gid = globalsInSite(s)[0].id;
    s = removeGlobal(s, gid);
    expect(globalsInSite(s)).toEqual([]);
    expect(words(sectionOf(s.pages[0].root, 0))).toEqual(["Admissions open"]);
  });

  it("an edit elsewhere on the page carries nothing (syncGlobals leaves the site as it is)", () => {
    const s = site();
    expect(syncGlobals(s, "home", s.pages[0].root)).toBe(s);
  });

  it("the published page is plain HTML: nothing names the global section", () => {
    let s = site();
    const sec = sectionOf(s.pages[0].root, 0);
    s = { ...s, pages: s.pages.map((p) => (p.id === "home" ? { ...p, root: makeGlobal(p.root, sec.id, "Admissions banner") } : p)) };
    const html = renderSiteFiles(s, DEFAULT_THEME)["index.html"];
    expect(html).toContain("Admissions open");
    expect(html).not.toMatch(/global/i);
  });
});
