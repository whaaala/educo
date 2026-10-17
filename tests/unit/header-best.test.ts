/**
 * BATCH LE-11 · the header, best-grade. Scenarios: tests/features/components/website/box-builder-header.feature.
 */
import { describe, it, expect } from "vitest";
import { createContainer, createElement, makeRowBand, findBox, updateBox, pinCSS, headerMarkers, headerScriptNeeded, awayGone, addAnnouncementBar, insertSlot, underOverHeaderPad, hasAnnouncement, type BoxNode } from "@/lib/box-model";
import { heldTooMuch } from "@/lib/space-check";
import { setPageRoot, addPage, emptyPageRoot, siteFromRoot, setRegionShown, type BoxSite } from "@/lib/box-site";
import PAGE_CHECK from "@/config/page-check.json";

const link = (id: string) => createElement("link", { id, text: id, href: "#" });
const hdr = (extra: Partial<BoxNode> = {}) => createContainer("row", { id: "hdr", tag: "header", shared: true, pin: "top", children: [link("l1"), link("l2")], ...extra });
const page = (...kids: BoxNode[]) => { const r = emptyPageRoot(); r.children = kids; return r; };

describe("PO-7 / PN-3 · a held header that gets out of the way", () => {
  it("its marker says how it goes — only on a bar held at the top", () => {
    expect(headerMarkers(hdr({ pinAway: "slide" }))).toMatchObject({ "data-eu-away": "slide" });
    expect(headerMarkers(hdr({ pinAway: "fade" }))).toMatchObject({ "data-eu-away": "fade" });
    expect(headerMarkers(hdr({ pinAway: "slide", pin: undefined }))).toEqual({});
    expect(headerMarkers(hdr({ pinAway: "slide", pin: "bottom" }))).toEqual({});
  });
  it("gone while scrolling DOWN past it; back on scroll up, with the focus inside, and at the page's end", () => {
    const at = { h: 80, vh: 640, docH: 3000, focus: false };
    expect(awayGone({ ...at, y: 400, lastY: 300 })).toBe(true); // down, past it
    expect(awayGone({ ...at, y: 60, lastY: 20 })).toBe(false); // down, but not yet past it
    expect(awayGone({ ...at, y: 300, lastY: 400 })).toBe(false); // up
    expect(awayGone({ ...at, y: 400, lastY: 300, focus: true })).toBe(false);
    expect(awayGone({ ...at, y: 2360, lastY: 2300 })).toBe(false); // the end of the page
  });
});

describe("PS-7 · a header over the first section", () => {
  it("pulls the next section up under itself by its own measured height", () => {
    expect(pinCSS(hdr({ pinOver: true })).marginBottom).toBe("calc(-1 * var(--eu-over, 0rem))");
    expect(pinCSS(hdr()).marginBottom).toBeUndefined();
    expect(headerMarkers(hdr({ pinOver: true }))).toMatchObject({ "data-eu-over": "" });
  });
});

describe("PS-6 · a two-row header keeps only its last row", () => {
  it("is held higher by the height of the rows above its last (measured into --eu-pin-skip)", () => {
    expect(String(pinCSS(hdr({ pinLastRow: true })).top)).toContain("var(--eu-pin-skip, 0rem)");
    expect(String(pinCSS(hdr()).top)).not.toContain("--eu-pin-skip");
    expect(headerMarkers(hdr({ pinLastRow: true }))).toMatchObject({ "data-eu-lastrow": "" });
  });
  it("the page ships the header script only when something needs it", () => {
    expect(headerScriptNeeded(page(hdr()))).toBe(false);
    for (const k of [{ pinAway: "fade" }, { pinOver: true }, { pinLastRow: true }] as Partial<BoxNode>[]) expect(headerScriptNeeded(page(makeRowBand([hdr(k)])))).toBe(true);
  });
});

describe("PS-10 · an announcement bar", () => {
  it("is the header's first row: an Alert banner a visitor can close, and it stays closed", () => {
    const r = addAnnouncementBar(page(makeRowBand([hdr({ direction: "column" })])), "hdr"); // a Stack header: the bar is its first row
    const h = findBox(r, "hdr")!;
    expect(h.children![0]).toMatchObject({ type: "component", component: "alert", alertForm: "banner", alertDismiss: true, alertPersist: true });
    expect(h.children!.length).toBe(3);
  });
});

describe("PS-14 · the shared header left off one page", () => {
  const three = (): BoxSite => { let s = siteFromRoot(page(makeRowBand([hdr()]), createContainer("column", { id: "b" }))); s = addPage(s, "Page 2", emptyPageRoot()).site; return addPage(s, "Page 3", emptyPageRoot()).site; };
  it("gone from that page only; changes made meanwhile come with it when it is shown again", () => {
    let s = three(); const p2 = s.pages[1].id;
    s = setRegionShown(s, p2, "header", false);
    expect(findBox(s.pages[1].root, "hdr")).toBeFalsy();
    expect(findBox(s.pages[0].root, "hdr")).toBeTruthy();
    expect(findBox(s.pages[2].root, "hdr")).toBeTruthy();
    const home = s.pages[0];
    s = setPageRoot(s, home.id, updateBox(home.root, "l1", { text: "Changed" }));
    expect(findBox(s.pages[1].root, "hdr")).toBeFalsy(); // still off there
    s = setRegionShown(s, p2, "header", true);
    expect(findBox(s.pages[1].root, "l1")?.text).toBe("Changed");
  });
  it("a page added while every page has it off still arrives with it (it is left off one page, not the site)", () => {
    let s = siteFromRoot(page(makeRowBand([hdr()])));
    s = setRegionShown(s, s.pages[0].id, "header", false);
    s = addPage(s, "Page 2", emptyPageRoot()).site;
    expect(findBox(s.pages[1].root, "hdr")).toBeTruthy();
  });
  it("shown again on a site whose every page had it off still has it (the copy set aside)", () => {
    let s = siteFromRoot(page(makeRowBand([hdr()])));
    s = setRegionShown(s, s.pages[0].id, "header", false);
    expect(findBox(s.pages[0].root, "hdr")).toBeFalsy();
    s = setRegionShown(s, s.pages[0].id, "header", true);
    expect(findBox(s.pages[0].root, "hdr")).toBeTruthy();
  });
});

describe("AX-6 · held bars at most a quarter of the screen", () => {
  it("over the share in config/page-check.json is too much; at or under it is fine", () => {
    const max = PAGE_CHECK.heldBars.maxShare;
    expect(heldTooMuch([{ h: 640 * max - 10, skip: 0 }], 640)).toBe(false);
    expect(heldTooMuch([{ h: 100, skip: 0 }, { h: 80, skip: 0 }], 640)).toBe(180 / 640 > max);
    expect(heldTooMuch([{ h: 200, skip: 120 }], 640)).toBe(80 / 640 > max); // the rows that scroll away do not count
  });
});

describe("LE11-1 · nothing is put above the header or below the footer by Before / After", () => {
  it("Before the header lands just under it; After the footer lands just above it; inside the content nothing changes", () => {
    const ftr = createContainer("column", { id: "ftr", tag: "footer", children: [link("f1")] });
    const r = page(makeRowBand([hdr()]), createContainer("column", { id: "b1" }), createContainer("column", { id: "b2" }), makeRowBand([ftr]));
    expect(insertSlot(r, "hdr", "before")).toEqual({ parentId: r.id, index: 1 });
    expect(insertSlot(r, "ftr", "after")).toEqual({ parentId: r.id, index: 3 });
    expect(insertSlot(r, "b2", "before")).toEqual({ parentId: r.id, index: 2 });
    expect(insertSlot(r, "b2", "after")).toEqual({ parentId: r.id, index: 3 });
  });
});

describe("LE11-3 · the announcement bar is a row of its own, above a Side by side header's content", () => {
  it("a row header becomes a column: the bar first, then the old row with its own children, gap and alignment", () => {
    const r = addAnnouncementBar(page(makeRowBand([hdr({ gap: 12, align: "center" })])), "hdr");
    const h = findBox(r, "hdr")!;
    expect(h.direction).toBe("column");
    expect(h.children!.map((c) => c.component ?? c.direction)).toEqual(["alert", "row"]);
    expect(h.children![1]).toMatchObject({ gap: 12, align: "center" });
    expect(h.children![1].children!.map((c) => c.id)).toEqual(["l1", "l2"]);
    expect(h).toMatchObject({ tag: "header", shared: true, pin: "top" }); // the header itself stays the header
  });
});

describe("LE11-4 · the section under a header that lies over it keeps its words clear of the header", () => {
  it("adds the header's measured height (--eu-over-h) to its own top inner space; only right after an over header", () => {
    const over = makeRowBand([hdr({ pinOver: true })]); const plain = makeRowBand([hdr()]);
    const hero = createContainer("column", { id: "hero" }); const next = createContainer("column", { id: "next" });
    const r = page(over, hero, next);
    expect(underOverHeaderPad(r, hero, "1rem").paddingTop).toBe("calc(1rem + var(--eu-over-h, 0rem))");
    expect(underOverHeaderPad(r, hero, undefined).paddingTop).toBe("calc(0rem + var(--eu-over-h, 0rem))");
    expect(underOverHeaderPad(r, next, "1rem")).toEqual({});
    expect(underOverHeaderPad(page(plain, hero), hero, "1rem")).toEqual({});
  });
});

describe("LE11-4 (2) · the space goes on the section's own block, so its background still runs up under the header", () => {
  it("a band holding ONE block: the block gets it, the band does not", () => {
    const over = makeRowBand([hdr({ pinOver: true })]);
    const hero = createContainer("column", { id: "hero", background: "#eef" }); const band = makeRowBand([hero]);
    const r = page(over, band);
    expect(underOverHeaderPad(r, band, undefined)).toEqual({});
    expect(underOverHeaderPad(band, hero, "1rem", r).paddingTop).toBe("calc(1rem + var(--eu-over-h, 0rem))");
  });
});

describe("LE11-6 · the header knows it already has an announcement bar — through the line the builder wraps it in", () => {
  it("found as a child or as the one block of a child band; not found otherwise", () => {
    const bar = createElement("text", { id: "x" }) as BoxNode; const alert = { ...bar, type: "component", component: "alert" } as BoxNode;
    expect(hasAnnouncement(hdr({ children: [makeRowBand([alert])] }))).toBe(true);
    expect(hasAnnouncement(hdr({ children: [alert] }))).toBe(true);
    expect(hasAnnouncement(hdr())).toBe(false);
  });
});

describe("LE11-7 · a header held only on a phone (its pin set while Mobile was edited) still gets out of the way there", () => {
  it("the markers are written when the top pin is at ANY screen — on the band that carries it", () => {
    const h = hdr({ pin: undefined, responsive: { phone: { pin: "top" } }, pinAway: "slide", pinOver: true });
    expect(headerMarkers(h)).toMatchObject({ "data-eu-away": "slide", "data-eu-over": "" });
    const band = makeRowBand([h]);
    expect(headerMarkers(band, page(band))).toMatchObject({ "data-eu-away": "slide" });
    expect(headerScriptNeeded(page(band))).toBe(true);
  });
});
