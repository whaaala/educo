/**
 * Static HTML export for the box builder — the publish GROUNDWORK. Renders a BoxSite to one self-contained
 * HTML document: every page becomes a <section id="slug">, a sticky nav links between them, and "page:<id>"
 * links resolve to "#slug" so navigation works in the exported file. Styles are inlined from the same pure
 * box-model helpers the editor uses (desktop / base breakpoint). Hosting + per-breakpoint CSS come later.
 */

import type { CSSProperties } from "react";
import {
  type BoxNode, type Breakpoint, containerStyle, childStyle, marginCSS, sizeToCSS, radiusCSS, SHADOW_CSS, u, baseUnit,
  resolveResponsive, floatStacksOnMobile, videoEmbedSrc, isContainer, sanitizeCssDeclarations, componentTextCss, componentBoxCss,
} from "@/lib/box-model";
import { isRegistryComponent, renderComponent } from "@/lib/educo-ui/registry";
import type { BoxSite } from "@/lib/box-site";
import type { SiteTheme } from "@/lib/site-storage";
import { colorToCSS } from "@/components/shared/ColorPalettePicker";
import { stylesheet } from "@/lib/educo-ui/base";

const UNITLESS = new Set(["opacity", "zIndex", "lineHeight", "fontWeight", "flexGrow", "flexShrink", "order", "flex"]);

/** Serialize a React style object to an inline CSS string (px added to bare numbers except unitless props). */
export function styleString(css: CSSProperties): string {
  return Object.entries(css)
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => {
      const prop = k.startsWith("--") ? k : k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
      const raw = typeof v === "number" && !UNITLESS.has(k) ? `${v}px` : String(v);
      // Escape double quotes so a value that legitimately contains them — a font stack like
      // "Playfair Display", serif or a background-image url("data:…") — can't close the HTML style="…"
      // attribute early and corrupt the rest of the document. Browsers decode &quot; back to " in the value.
      const val = raw.replace(/"/g, "&quot;");
      return `${prop}:${val}`;
    })
    .join(";");
}

const esc = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Layered background (base fill → image → overlay), mirroring the editor's backgroundStyle. */
function bgCss(node: BoxNode): CSSProperties {
  const s: CSSProperties = {};
  const layers: string[] = [];
  const asGrad = (c: string) => { const css = colorToCSS(c); return css.startsWith("linear-gradient") ? css : `linear-gradient(${css}, ${css})`; };
  if (node.bgOverlay) layers.push(asGrad(node.bgOverlay));
  if (node.bgImage) layers.push(`url("${node.bgImage}")`);
  const baseGrad = node.background?.startsWith("gradient:");
  if (baseGrad && !node.bgImage) layers.push(colorToCSS(node.background!));
  if (layers.length) { s.backgroundImage = layers.join(", "); s.backgroundSize = node.bgImage ? (node.bgSize ?? "cover") : undefined; s.backgroundPosition = "center"; s.backgroundRepeat = "no-repeat"; }
  if (node.background && !baseGrad) s.backgroundColor = node.background;
  return s;
}

function decorCss(node: BoxNode): CSSProperties {
  const s: CSSProperties = {};
  const br = radiusCSS(node); if (br) s.borderRadius = br;
  if (node.borderWidth && node.type !== "divider") s.border = `${node.borderWidth}px ${node.borderStyle ?? "solid"} ${node.borderColor ? colorToCSS(node.borderColor) : "rgba(0,0,0,0.15)"}`;
  if (node.shadow) s.boxShadow = SHADOW_CSS[node.shadow];
  if (node.rotate) s.transform = `rotate(${node.rotate}deg)`;
  return s;
}

function typoCss(node: BoxNode, family: string, weight: number): CSSProperties {
  return {
    fontFamily: node.fontFamily || family,
    fontWeight: node.fontWeight ?? (node.bold ? 800 : weight),
    lineHeight: node.lineHeight,
    letterSpacing: node.letterSpacing != null ? `${node.letterSpacing}px` : undefined,
    fontStyle: node.italic ? "italic" : undefined,
    textDecoration: node.underline ? "underline" : undefined,
    textTransform: node.textTransform && node.textTransform !== "none" ? node.textTransform : undefined,
  };
}

const hrefFor = (node: BoxNode, pageMap: Map<string, string>): string => {
  const h = node.href ?? "#";
  if (h.startsWith("page:")) { const path = pageMap.get(h.slice(5)); return path ? `#${path}` : "#"; }
  return h;
};

/** Render a single element's inner HTML (its wrapper div is added by renderNode). */
function elementHTML(node: BoxNode, theme: SiteTheme, pageMap: Map<string, string>): string {
  const align = node.textAlign ?? "left";
  switch (node.type) {
    case "heading": return `<h2 style="${styleString({ color: node.color || theme.text, fontSize: u(node.fontSize ?? 32), textAlign: align, width: "100%", ...typoCss(node, theme.headingFont, 600) })}">${esc(node.text ?? "")}</h2>`;
    case "text": return `<p style="${styleString({ color: node.color || theme.textMuted, fontSize: u(node.fontSize ?? 16), textAlign: align, width: "100%", ...typoCss(node, theme.bodyFont, 400) })}">${esc(node.text ?? "")}</p>`;
    case "button": { // fills its box + paints its own visual + centres its label (matches the editor) — one shape when resized
      const fp = (v?: string) => (v === "center" ? "center" : v === "end" ? "flex-end" : "flex-start");
      const deco = decorCss(node);
      return `<a href="${esc(hrefFor(node, pageMap))}"${node.newTab ? ' target="_blank" rel="noopener noreferrer"' : ""} style="${styleString({ display: "flex", width: "100%", height: "100%", boxSizing: "border-box", alignItems: fp(node.contentY ?? "center"), justifyContent: fp(node.contentX ?? "center"), gap: "8px", background: node.background ? colorToCSS(node.background) : colorToCSS(theme.primary), color: node.color || "#fff", fontSize: u(node.fontSize ?? 14), padding: `${u(12)} ${u(24)}`, textDecoration: "none", ...deco, borderRadius: deco.borderRadius ?? "9999px", ...typoCss(node, theme.bodyFont, 600) })}">${esc(node.text ?? "")}</a>`;
    }
    case "image": return node.src ? `<img src="${esc(node.src)}" alt="" style="${styleString({ width: "100%", height: sizeToCSS(node.height) ?? "260px", objectFit: "cover", display: "block" })}" />` : "";
    case "video": { const embed = videoEmbedSrc(node.src); const h = sizeToCSS(node.height) ?? "315px"; if (embed) return `<iframe src="${esc(embed)}" title="Video" allowfullscreen style="${styleString({ width: "100%", height: h, border: "0" })}"></iframe>`; return node.src ? `<video src="${esc(node.src)}" controls style="${styleString({ width: "100%", height: h })}"></video>` : ""; }
    case "divider": return `<div aria-hidden="true" style="${styleString({ width: "100%", borderTopWidth: node.borderWidth || 2, borderTopStyle: node.borderStyle ?? "solid", borderTopColor: node.color ? colorToCSS(node.color) : node.borderColor ? colorToCSS(node.borderColor) : theme.textMuted })}"></div>`;
    case "list": { const items = (node.listItems ?? []).map((it) => `<li>${esc(it)}</li>`).join(""); const st = styleString({ color: node.color || theme.text, fontSize: u(node.fontSize ?? 16), textAlign: align, width: "100%", paddingLeft: u(22), ...typoCss(node, theme.bodyFont, 400) }); return node.listStyle === "number" ? `<ol style="${st}">${items}</ol>` : `<ul style="${st}">${items}</ul>`; }
    case "embed": return node.html ?? "";
    case "spacer": return `<div aria-hidden="true" style="${styleString({ width: "100%", height: sizeToCSS(node.height) ?? "48px" })}"></div>`;
    case "component": return componentHTML(node);
    default: return "";
  }
}

/** The per-instance style that makes the inspector's Design + Typography controls act on the COMPONENT ITSELF
 *  (`.eu-<component>`) rather than its wrapper box — scoped to this instance's export class (`bx-<id>`). */
function componentInjectCss(node: BoxNode): string {
  const name = node.component === "accordion" ? "accordion" : node.component!;
  const sel = `.${classFor(node.id)} .eu-${name}`;
  const tcss = componentTextCss(node), bcss = componentBoxCss(node), adv = sanitizeCssDeclarations(node.advancedCss);
  return [tcss ? `${sel}, ${sel} *{${tcss}}` : "", bcss ? `${sel}{${bcss}}` : "", adv ? `${sel}{${adv}}` : ""].filter(Boolean).join("");
}

/** Render an Educo UI component instance to its `.eu-*` markup + a per-instance <style> (so Design/Typography
 *  controls style the component itself). The wrapper handles only size/position/margins. */
function componentHTML(node: BoxNode): string {
  const inject = componentInjectCss(node);
  const style = inject ? `<style>${inject}</style>` : "";
  if (node.component === "accordion") {
    const cls = "eu-accordion" + (node.variant ? ` eu-accordion${node.variant}` : "");
    // A shared `name` groups <details> so only one opens at a time (native exclusive accordion); omitted when multi-open.
    const grp = node.accMultiOpen ? "" : ` name="acc-${esc(node.id)}"`;
    const items = (node.accItems ?? []).map((it) => {
      const media = it.media ? `<img class="eu-accordion__media" src="${esc(it.media)}" alt="" />` : "";
      const meta = it.meta ? `<span class="eu-accordion__meta">${esc(it.meta)}</span>` : "";
      return `<details class="eu-accordion__item"${it.open ? " open" : ""}${grp}><summary class="eu-accordion__header">${media}${esc(it.title)}${meta}</summary><div class="eu-accordion__body">${esc(it.body)}</div></details>`;
    }).join("");
    return `${style}<div class="${cls}">${items}</div>`;
  }
  // Every other component renders as ONE clean node straight from the registry (same HTML the canvas shows).
  if (isRegistryComponent(node.component)) return `${style}${renderComponent(node.component!, node.componentFields, node.variant)}`;
  return "";
}

/** Typography set on a component wrapper (cascades into its text). Only defined props are emitted. */
function componentTypoCss(node: BoxNode): CSSProperties {
  const s: CSSProperties = {};
  if (node.fontFamily) s.fontFamily = node.fontFamily;
  if (node.fontSize) s.fontSize = u(node.fontSize);
  if (node.fontWeight) s.fontWeight = node.fontWeight;
  if (node.lineHeight) s.lineHeight = node.lineHeight;
  if (node.letterSpacing != null) s.letterSpacing = `${node.letterSpacing}px`;
  if (node.textTransform && node.textTransform !== "none") s.textTransform = node.textTransform;
  if (node.italic) s.fontStyle = "italic";
  return s;
}

/** Per-instance CSS-variable token overrides + sanitized advanced declarations, appended to a node's inline style. */
function overridesCss(node: BoxNode): string {
  const vars = Object.entries(node.tokenOverrides ?? {})
    .filter(([k, v]) => k.startsWith("--") && v)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
  const adv = sanitizeCssDeclarations(node.advancedCss);
  return [vars, adv].filter(Boolean).join(";");
}

// ── Responsive export ──────────────────────────────────────────────────────────────────────────────
// Inline styles can NEVER be overridden by a media query (inline beats any selector), so per-device edits
// would be invisible in the export. Instead every box gets a stable class (`bx-<id>`) and its BASE style is
// emitted as a rule; tablet/mobile DIFFS are emitted inside @media blocks that override by cascade. The
// breakpoints mirror the editor's device frames (mobile 375, tablet 768) so the preview MATCHES the editor.
const TABLET_MAX = 1024; // fires for the ≤768 tablet frame
const MOBILE_MAX = 480;  // fires for the ≤375 phone frame
type Sheet = { base: string[]; tablet: string[]; mobile: string[] };
const classFor = (id: string) => "bx-" + id.replace(/[^A-Za-z0-9_-]/g, "-");
// When a property is set at BASE but dropped at a breakpoint, we must actively neutralise it (the base rule
// still applies at every width) — reset it to its layout initial rather than leaving the desktop value.
const RESET: Record<string, string> = {
  minHeight: "auto", height: "auto", width: "auto", left: "auto", top: "auto", right: "auto", bottom: "auto",
  position: "static", zIndex: "auto", margin: "0", marginTop: "0", marginRight: "0", marginBottom: "0", marginLeft: "0",
};

/** The full style object for a node at a breakpoint — mirrors BoxCanvas's wrapStyle so editor == export. */
function styleAt(node: BoxNode, rawParent: BoxNode | null, bp: Breakpoint): CSSProperties {
  const r = resolveResponsive(node, bp);
  const parent = rawParent ? resolveResponsive(rawParent, bp) : null;
  const isRoot = rawParent === null;
  // "STACK on narrow": on mobile a non-pinned float returns to normal flow (full-width, content-height) so it
  // can never clip its content or exceed its parent on a phone.
  const stacked = bp === "mobile" && !isRoot && floatStacksOnMobile(node);
  const floating = r.position === "absolute" && !isRoot && !stacked;
  const isComp = r.type === "component";
  // Self-painting blocks (components AND buttons) draw bg/border/radius/shadow on the block element itself and fill
  // the box, so the wrapper stays transparent — no duplicate "shape behind" a resized block. Matches the editor.
  const selfPaint = isComp || r.type === "button";
  const wrap: CSSProperties = {
    position: floating ? "absolute" : "relative",
    maxWidth: "100%", // never wider than the container → no horizontal scrollbar on a phone
    ...(selfPaint ? {} : decorCss(r)), // a component/button's border/radius/shadow style the block element, not this wrapper
    ...(floating ? {} : marginCSS(r)),
    opacity: !isComp && r.opacity !== undefined ? r.opacity / 100 : undefined,
    overflow: stacked ? "visible" : (!selfPaint && (r.clip || radiusCSS(r))) ? "hidden" : undefined,
    ...(floating
      ? { left: `${r.left ?? 0}%`, top: `${r.top ?? 0}%`, width: sizeToCSS(r.width), height: r.height ? sizeToCSS(r.height) : undefined, minHeight: r.minHeight, zIndex: r.zIndex ?? 1 } // no width ⇒ auto ⇒ hug content (never a wide default box)
      : stacked
      ? { position: "relative", width: "100%", height: "auto", minHeight: "auto", zIndex: "auto" } // full-width flow, grows with content
      : parent ? childStyle(r, parent) : { width: "100%", ["--box-u" as string]: baseUnit(r.baseFont ?? 10) }),
    ...(selfPaint ? {} : bgCss(r)), // background styles the block element (component/button), not this wrapper
    ...(isComp ? componentTypoCss(r) : {}),
  };
  if (r.hidden) wrap.display = "none"; // hidden-on-this-device → removed at that breakpoint
  if (isContainer(r)) return { ...containerStyle(r, bp), ...wrap };
  // Elements apply their OWN minHeight/height (containers get it from containerStyle) so a height-resized
  // heading / text / button / list looks the same in the export as in the editor.
  if (r.minHeight != null) wrap.minHeight = r.minHeight;
  if (r.height) wrap.height = sizeToCSS(r.height);
  // Content position (start/center/end) → the element becomes a flex box so its content re-positions as it grows.
  if (r.contentX || r.contentY) {
    const fp = (v?: string) => (v === "center" ? "center" : v === "end" ? "flex-end" : "flex-start");
    wrap.display = "flex"; wrap.flexDirection = "column"; wrap.justifyContent = fp(r.contentY); wrap.alignItems = fp(r.contentX);
  }
  return wrap;
}

/** Properties of `bp` that DIFFER from `base` (missing-at-bp keys reset to their initial), as a CSS string. */
function diffStyle(base: CSSProperties, bp: CSSProperties): string {
  const ser = (k: string, v: unknown) => (v == null || v === "" ? "" : styleString({ [k]: v } as CSSProperties));
  const keys = new Set([...Object.keys(base), ...Object.keys(bp)]);
  const out: string[] = [];
  for (const k of keys) {
    const bv = (base as Record<string, unknown>)[k];
    const pv = (bp as Record<string, unknown>)[k];
    if (ser(k, bv) === ser(k, pv)) continue;
    const val = pv != null && pv !== "" ? pv : (RESET[k] ?? "revert");
    out.push(styleString({ [k]: val } as CSSProperties));
  }
  return out.filter(Boolean).join(";");
}

/** Render a node (and subtree) to HTML, pushing its base + per-breakpoint rules into `sheet`. */
function renderNode(node: BoxNode, rawParent: BoxNode | null, theme: SiteTheme, pageMap: Map<string, string>, sheet: Sheet): string {
  const r = resolveResponsive(node, "base");
  if (r.hidden && !node.responsive) return ""; // hidden at base with no per-device un-hide → skip entirely
  const cls = classFor(node.id);
  const baseObj = styleAt(node, rawParent, "base");
  const ov = overridesCss(r);
  sheet.base.push(`.${cls}{${[styleString(baseObj), ov].filter(Boolean).join(";")}}`);
  const tDiff = diffStyle(baseObj, styleAt(node, rawParent, "tablet"));
  if (tDiff) sheet.tablet.push(`.${cls}{${tDiff}}`);
  const mDiff = diffStyle(baseObj, styleAt(node, rawParent, "mobile"));
  if (mDiff) sheet.mobile.push(`.${cls}{${mDiff}}`);
  const idAttr = r.anchor ? ` id="${esc(r.anchor)}"` : "";
  if (isContainer(r)) {
    const kids = (r.children ?? []).map((c) => renderNode(c, node, theme, pageMap, sheet)).join("");
    return `<div${idAttr} class="${cls}">${kids}</div>`;
  }
  return `<div${idAttr} class="${cls}">${elementHTML(r, theme, pageMap)}</div>`;
}

/** Turn the collected rules into a stylesheet (base first, then tablet, then mobile so narrow wins). */
function sheetCss(sheet: Sheet): string {
  return [
    sheet.base.join(""),
    sheet.tablet.length ? `@media (max-width:${TABLET_MAX}px){${sheet.tablet.join("")}}` : "",
    sheet.mobile.length ? `@media (max-width:${MOBILE_MAX}px){${sheet.mobile.join("")}}` : "",
  ].filter(Boolean).join("");
}

/** Render one page's tree to an HTML fragment. The page's own responsive stylesheet is emitted as a leading
 *  `<style>` block (a passed `sheet` instead accumulates into a shared document-level sheet, no inline block). */
export function renderPageHTML(root: BoxNode, theme: SiteTheme, pageMap: Map<string, string> = new Map(), sheet?: Sheet): string {
  if (sheet) return renderNode(root, null, theme, pageMap, sheet); // shared sheet → caller emits the CSS
  const own: Sheet = { base: [], tablet: [], mobile: [] };
  const body = renderNode(root, null, theme, pageMap, own);
  return `<style>${sheetCss(own)}</style>${body}`;
}

/**
 * Wrap page/site body HTML in a full, SELF-CONTAINED document: the Educo UI stylesheet (tokens + reset +
 * responsive base + component styles) is inlined and the body is scoped under `.eu-root`, so the exported
 * file renders identically anywhere with no external CSS. Phase 0.4 — the isolated preview/export shell.
 */
function documentShell(theme: SiteTheme, title: string, body: string, responsiveCss = "", preview = false): string {
  // In the srcdoc PREVIEW iframe the document's base URL is inherited from the parent app, so a nav link like
  // `#home` would resolve to the app's own URL and reload the whole builder INSIDE the iframe. Pinning the base
  // to `about:srcdoc` keeps hash links as in-page fragment scrolls. The standalone DOWNLOAD omits this (its own
  // file URL is the correct base there).
  const base = preview ? `<base href="about:srcdoc">` : "";
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${base}
<title>${esc(title)}</title>
<style>${stylesheet(theme)}</style>
<style>html,body{max-width:100%;overflow-x:hidden}.eu-site-nav{position:sticky;top:0;z-index:1000;display:flex;gap:4px;padding:8px 16px;background:var(--eu-color-surface);border-bottom:1px solid var(--eu-color-border)}.eu-site-nav a{color:var(--eu-color-text);text-decoration:none;padding:8px 12px;border-radius:var(--eu-radius-md)}.eu-site-nav a:hover{background:var(--eu-color-surface-2)}</style>
<style>${responsiveCss}</style>
</head><body class="eu-root">${body}</body></html>`;
}

/** Render ONE page to a self-contained document (used by the isolated iframe preview). */
export function renderPageDocument(root: BoxNode, theme: SiteTheme, title = "Page", pageMap: Map<string, string> = new Map(), opts: { preview?: boolean } = {}): string {
  const sheet: Sheet = { base: [], tablet: [], mobile: [] };
  const body = renderPageHTML(root, theme, pageMap, sheet);
  return documentShell(theme, title, body, sheetCss(sheet), opts.preview);
}

/** Render the whole site to ONE self-contained HTML document (each page a section + a sticky nav).
 *  `opts.preview` targets the srcdoc iframe (pins the base URL so nav links scroll instead of reloading). */
export function renderSiteHTML(site: BoxSite, theme: SiteTheme, opts: { preview?: boolean } = {}): string {
  const pageMap = new Map(site.pages.map((p) => [p.id, p.path]));
  const ordered = [...site.pages].sort((a, b) => (a.id === site.homeId ? -1 : b.id === site.homeId ? 1 : 0));
  const sheet: Sheet = { base: [], tablet: [], mobile: [] };
  const nav = ordered.map((p) => `<a href="#${esc(p.path)}">${esc(p.name)}</a>`).join("");
  const sections = ordered.map((p) => `<section id="${esc(p.path)}">${renderPageHTML(p.root, theme, pageMap, sheet)}</section>`).join("\n");
  return documentShell(theme, ordered[0]?.name ?? "Site", `<nav class="eu-site-nav">${nav}</nav>\n${sections}`, sheetCss(sheet), opts.preview);
}

/** Trigger a browser download of an HTML string (no-op outside the browser). */
export function downloadHTML(html: string, filename = "site.html"): void {
  if (typeof document === "undefined" || typeof URL === "undefined" || !URL.createObjectURL) return;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
