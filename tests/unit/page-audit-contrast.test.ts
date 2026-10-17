// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from "vitest";
const { auditDoc } = require("../../scripts/uat/page-audit.js") as { auditDoc: (o: object) => { err: string[]; warn: string[] } };

/**
 * RX4-24 — the page audit's contrast check reads a SEE-THROUGH text colour as if it were solid. A colour can carry
 * transparency now (RX4-6), so text at 30 % black over white (≈ #b3b3b3, 2.1:1) passed as black (21:1).
 *
 * jsdom has no canvas pixels, so the one-pixel paint the audit uses to read ANY CSS colour is stubbed with a parser of
 * the rgb()/rgba() strings jsdom hands back — the audit's own arithmetic is what is under test.
 */
const rgba = (c: string) => {
  const m = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)/.exec(c);
  return m ? [+m[1], +m[2], +m[3], Math.round((m[4] == null ? 1 : +m[4]) * 255)] : [0, 0, 0, 255];
};

describe("RX4-24 — the audit's contrast check composes a see-through text colour over its background", () => {
  const saved = { gc: HTMLCanvasElement.prototype.getContext, rect: Element.prototype.getBoundingClientRect };
  beforeEach(() => {
    let fill = "#000";
    HTMLCanvasElement.prototype.getContext = (() => ({
      clearRect() {}, fillRect() {},
      set fillStyle(v: string) { fill = v; }, get fillStyle() { return fill; },
      getImageData: () => ({ data: rgba(fill) }),
    })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
    Element.prototype.getBoundingClientRect = () => ({ left: 10, top: 10, right: 210, bottom: 30, width: 200, height: 20, x: 10, y: 10, toJSON() {} }) as DOMRect;
    window.scrollTo = () => {};
    Range.prototype.getClientRects = (() => []) as unknown as typeof Range.prototype.getClientRects;
    Range.prototype.getBoundingClientRect = Element.prototype.getBoundingClientRect;
    (Element.prototype as unknown as { checkVisibility: () => boolean }).checkVisibility = () => true;
    Object.defineProperty(document.documentElement, "clientWidth", { configurable: true, value: 1280 }); // the page width
    // jsdom has no innerText (it needs layout); the words are enough here
    if (!("innerText" in HTMLElement.prototype)) Object.defineProperty(HTMLElement.prototype, "innerText", { configurable: true, get() { return this.textContent; } });
  });
  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = saved.gc; Element.prototype.getBoundingClientRect = saved.rect;
    delete (document.documentElement as unknown as Record<string, unknown>).clientWidth;
    delete (Element.prototype as unknown as Record<string, unknown>).checkVisibility;
    document.head.innerHTML = ""; document.body.innerHTML = "";
  });

  const audit = (color: string, band = "") => {
    document.head.innerHTML = "<style>* { background-image: none }</style>";
    const p = `<p style="color: ${color}; font-size: 16px">Term dates</p>`;
    document.body.innerHTML = `<div class="bx-a" style="background-color: rgb(255, 255, 255)">${band ? `<div style="background-color: ${band}">${p}</div>` : p}</div>`;
    return auditDoc({}).err.filter((e) => e.startsWith("C29"));
  };

  it("30 % black text on white is too faint, and is reported", () => {
    expect(audit("rgba(0, 0, 0, 0.3)")).toHaveLength(1);
  });

  it("the check runs here at all: solid light grey on white is reported (so a pass below is not vacuous)", () => {
    expect(audit("rgb(187, 187, 187)")).toHaveLength(1);
  });

  it("solid black text on white passes", () => {
    expect(audit("rgb(0, 0, 0)")).toHaveLength(0);
  });

  // the BACKGROUND too (found HEADED 2026-10-17): a 60 % black band over white is grey (102); it was skipped as
  // see-through and the slate text measured against the white under it — 4.8:1, passed — where it is 1.2:1
  it("text on a see-through band is measured against the band composed over what lies under it", () => {
    expect(audit("rgb(100, 116, 139)", "rgba(0, 0, 0, 0.6)")).toHaveLength(1);
  });

  it("white text on that same band passes (≈ 5.9:1), so the band is not simply flagged", () => {
    expect(audit("rgb(255, 255, 255)", "rgba(0, 0, 0, 0.6)")).toHaveLength(0);
  });
});
