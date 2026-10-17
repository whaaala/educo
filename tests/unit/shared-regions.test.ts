/**
 * BATCH LE-8 · PS-2 — ONE header and ONE footer for every page, edited once; PS-9 — a short page's footer sits at the
 * bottom of the screen. Scenarios: tests/features/components/website/box-builder-shared-regions.feature.
 */
import { describe, it, expect } from "vitest";
import { createContainer, createElement, makeRowBand, updateBox, deleteBox, findBox, insertSlot, type BoxNode } from "@/lib/box-model";
import { setPageRoot, addPage, emptyPageRoot, siteFromRoot, duplicatePage, movePage, type BoxSite } from "@/lib/box-site";
import { pageFillCss, footerPushCss, pageCheck } from "@/lib/semantics";
import { SHARED_KEYS } from "@/lib/per-screen-note";

const link = (id: string, text: string) => createElement("link", { id, text, href: "#" });
const header = (shared = true) => createContainer("row", { id: "hdr", tag: "header", shared, children: [link("l1", "Home"), link("l2", "News")] });
const footer = (shared = true) => createContainer("column", { id: "ftr", tag: "footer", shared, children: [link("f1", "Contact")] });
const body = (id: string) => createContainer("column", { id, children: [createElement("text", { id: `${id}-t`, text: "Hello" })] });
const page = (...kids: BoxNode[]) => { const r = emptyPageRoot(); r.children = kids; return r; };

/** Home with a shared header + footer, and two pages added with "+" (as the builder adds them). */
function threePages(sharedHeader = true, sharedFooter = true): BoxSite {
  let s = siteFromRoot(page(makeRowBand([header(sharedHeader)]), body("b1"), makeRowBand([footer(sharedFooter)])));
  s = addPage(s, "Page 2", emptyPageRoot()).site;
  s = addPage(s, "Page 3", emptyPageRoot()).site;
  return s;
}
const textOf = (root: BoxNode, id: string) => findBox(root, id)?.text;

describe("LE-8 · PS-2 — the shared header and footer", () => {
  it("a page added with \"+\" arrives with the shared header (first) and footer (last)", () => {
    const s = threePages();
    for (const p of s.pages.slice(1)) {
      expect(findBox(p.root, "hdr")).toBeTruthy();
      expect(findBox(p.root, "ftr")).toBeTruthy();
      const kids = p.root.children ?? [];
      expect(findBox(kids[0], "hdr")).toBeTruthy();
      expect(findBox(kids[kids.length - 1], "ftr")).toBeTruthy();
    }
  });

  it("a page added while nothing is shared arrives empty", () => {
    const s = threePages(false, false);
    expect(findBox(s.pages[1].root, "hdr")).toBeFalsy();
    expect(findBox(s.pages[1].root, "ftr")).toBeFalsy();
  });

  it("an edit to the shared header on one page is the edit on every page — and the page's own body is untouched", () => {
    let s = threePages();
    const p3 = s.pages[2];
    s = setPageRoot(s, p3.id, updateBox(p3.root, "l2", { text: "Term dates" }));
    for (const p of s.pages) expect(textOf(p.root, "l2")).toBe("Term dates");
    expect(findBox(s.pages[0].root, "b1")).toBeTruthy(); // Home keeps its own content
    expect(findBox(s.pages[1].root, "b1")).toBeFalsy(); // …which never travels
  });

  it("a header that is NOT on every page is that page's alone", () => {
    let s = threePages(false, false);
    const home = s.pages[0];
    s = setPageRoot(s, home.id, updateBox(home.root, "l2", { text: "Term dates" }));
    expect(textOf(s.pages[0].root, "l2")).toBe("Term dates");
    expect(findBox(s.pages[1].root, "l2")).toBeFalsy();
  });

  it("deleting the shared footer on one page deletes it on every page", () => {
    let s = threePages();
    const p2 = s.pages[1];
    s = setPageRoot(s, p2.id, deleteBox(p2.root, "ftr"));
    for (const p of s.pages) expect(findBox(p.root, "ftr")).toBeFalsy();
    for (const p of s.pages) expect(findBox(p.root, "hdr")).toBeTruthy(); // the header is not touched
  });

  it("turning \"On every page\" off leaves every page its own copy, and later edits stay on their page", () => {
    let s = threePages();
    const p2 = s.pages[1];
    s = setPageRoot(s, p2.id, updateBox(p2.root, "hdr", { shared: undefined }));
    for (const p of s.pages) { expect(findBox(p.root, "hdr")).toBeTruthy(); expect(findBox(p.root, "hdr")?.shared).toBeFalsy(); }
    const again = s.pages[1];
    s = setPageRoot(s, again.id, updateBox(again.root, "l1", { text: "Start" }));
    expect(textOf(s.pages[1].root, "l1")).toBe("Start");
    expect(textOf(s.pages[0].root, "l1")).toBe("Home");
    expect(textOf(s.pages[2].root, "l1")).toBe("Home");
  });

  it("turning it on again makes THIS page's header the one on every page (replacing their own)", () => {
    let s = threePages(false, false);
    const p2 = s.pages[1];
    s = setPageRoot(s, p2.id, page(makeRowBand([createContainer("row", { id: "own", tag: "header", children: [link("o1", "Mine")] })])));
    const home = s.pages[0];
    s = setPageRoot(s, home.id, updateBox(home.root, "hdr", { shared: true }));
    for (const p of s.pages) expect(textOf(p.root, "l1")).toBe("Home");
    expect(findBox(s.pages[1].root, "own")).toBeFalsy();
  });

  it("a shared header made something else on one page leaves the other pages their copy — only a DELETED one goes everywhere", () => {
    let s = threePages();
    const p2 = s.pages[1];
    s = setPageRoot(s, p2.id, updateBox(p2.root, "hdr", { tag: "section", shared: undefined }));
    expect(findBox(s.pages[0].root, "hdr")?.tag).toBe("header");
    expect(findBox(s.pages[2].root, "hdr")?.tag).toBe("header");
  });

  it("Duplicate keeps the shared header and footer", () => {
    let s = threePages();
    s = duplicatePage(s, s.pages[0].id).site;
    expect(findBox(s.pages[1].root, "hdr")?.shared).toBe(true);
  });

  it("LE8-1 · the page's meaning (and a heading's level, a landmark's name, \"On every page\") is shared by every screen", () => {
    for (const k of ["tag", "level", "landmarkName", "shared"]) expect(SHARED_KEYS.has(k)).toBe(true);
  });
});

describe("LE-8 · PS-9 — a short page's footer sits at the bottom of the screen", () => {
  it("a page that ends with a footer is at least one screen tall, and its footer is pushed to the bottom", () => {
    const r = page(makeRowBand([header()]), body("b1"), makeRowBand([footer()]));
    expect(pageFillCss(r).minHeight).toBe("100svh");
    const last = r.children![2];
    expect(footerPushCss(r, last).marginTop).toBe("auto");
    expect(footerPushCss(r, r.children![1])).toEqual({}); // only the footer moves
  });

  it("a page with no footer changes nothing", () => {
    const r = page(makeRowBand([header()]), body("b1"));
    expect(pageFillCss(r)).toEqual({});
    expect(footerPushCss(r, r.children![1])).toEqual({});
  });

  it("a top space the user gave the footer is theirs — not replaced", () => {
    const r = page(body("b1"), makeRowBand([footer()]));
    const band = { ...r.children![1], marginTop: 20 } as BoxNode;
    r.children = [r.children![0], band];
    expect(footerPushCss(r, band)).toEqual({});
  });
});

describe("LE8-3 · a link to a page that was deleted", () => {
  it("the Page check names it (it would publish as a dead \"#\"), and only it", () => {
    const r = page(makeRowBand([createContainer("row", { id: "h", tag: "header", children: [createElement("link", { id: "gone", text: "News", href: "page:p-old" }), createElement("link", { id: "here", text: "Home", href: "page:p-home" }), createElement("button", { id: "btn", text: "Apply", href: "page:p-old" })] })]));
    const dead = pageCheck(r, undefined, undefined, new Set(["p-home"])).filter((i) => i.kind === "link-page-gone").map((i) => i.id);
    expect(dead).toEqual(["gone", "btn"]);
    expect(pageCheck(r).some((i) => i.kind === "link-page-gone")).toBe(false); // no page list → nothing claimed
  });
});

describe("LE8-4 · \"End\" and \"Start\" put a block in the page's content, never outside its header and footer", () => {
  it("End goes above the footer, Start below the header — and on a page with neither, the very ends", () => {
    const r = page(makeRowBand([header()]), body("b1"), body("b2"), makeRowBand([footer()]));
    expect(insertSlot(r, null, "end")).toEqual({ parentId: r.id, index: 3 });
    expect(insertSlot(r, "b1-t", "end")).toEqual({ parentId: r.id, index: 3 });
    expect(insertSlot(r, null, "start")).toEqual({ parentId: r.id, index: 1 });
    const bare = page(body("b1"), body("b2"));
    expect(insertSlot(bare, null, "end")).toEqual({ parentId: bare.id, index: 2 });
    expect(insertSlot(bare, null, "start")).toEqual({ parentId: bare.id, index: 0 });
  });
});

describe("LE8-2 · pages can be put in a different order", () => {
  it("Move earlier / later swap a page with its neighbour; the ends stay put; the home page and the shared header are untouched", () => {
    const s = threePages(); const [a, b, c] = s.pages.map((p) => p.id);
    expect(movePage(s, c, -1).pages.map((p) => p.id)).toEqual([a, c, b]);
    expect(movePage(s, a, 1).pages.map((p) => p.id)).toEqual([b, a, c]);
    expect(movePage(s, a, -1)).toBe(s); // already first
    expect(movePage(s, c, 1)).toBe(s);  // already last
    const m = movePage(s, a, 1);
    expect(m.homeId).toBe(s.homeId);
    expect(m.pages.every((p) => findBox(p.root, "hdr"))).toBe(true);
  });
});
