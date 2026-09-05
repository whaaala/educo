/**
 * Static HTML export for the box builder — the publish GROUNDWORK. Renders a BoxSite to one self-contained
 * HTML document: every page becomes a <section id="slug">, a sticky nav links between them, and "page:<id>"
 * links resolve to "#slug" so navigation works in the exported file. Styles are inlined from the same pure
 * box-model helpers the editor uses (desktop / base breakpoint). Hosting + per-breakpoint CSS come later.
 */

import type { CSSProperties } from "react";
import {
  type BoxNode, type Breakpoint, containerStyle, childStyle, marginCSS, sizeToCSS, radiusCSS, SHADOW_CSS, u, baseUnit,
  resolveResponsive, floatStacksOnMobile, videoEmbedSrc, isContainer, sanitizeCssDeclarations, expandScopedCss, ACCORDION_CSS_PARTS, ALERT_CSS_PARTS, itemOverrideCss, itemHasOverride, itemNumberVars, itemFloatReserveRem, richBody, plainBody, componentTextCss, componentBoxCss, bgImageLayer, renderAlertHTML, alertDismissScript, bgShowThroughCss, hugContainmentCss, COMPONENT_ITEM_SEL,
} from "@/lib/box-model";
import { isRegistryComponent, renderComponent, componentScripts } from "@/lib/educo-ui/registry";
import { iconSvg } from "@/lib/educo-ui/icon-svg";
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
  if (node.bgImage) layers.push(bgImageLayer(node.bgImage)); // gradient/pattern passes through; URL gets url("…")
  const baseGrad = node.background?.startsWith("gradient:");
  if (baseGrad && !node.bgImage) layers.push(colorToCSS(node.background!));
  if (layers.length) {
    s.backgroundImage = layers.join(", ");
    if (node.bgImage) {
      s.backgroundSize = node.bgTile ?? (node.bgSize ?? "cover"); // a pattern tiles at its tile size…
      s.backgroundPosition = node.bgPosition ?? (node.bgTile ? "0 0" : "center");
      s.backgroundRepeat = node.bgRepeat ?? (node.bgTile ? "repeat" : "no-repeat"); // …and repeats; a photo/gradient covers once
      if (node.bgAttach) s.backgroundAttachment = node.bgAttach;
    } else { s.backgroundPosition = "center"; s.backgroundRepeat = "no-repeat"; }
  }
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
    case "icon": { const svg = iconSvg(node.icon ?? "Star"); return svg ? `<span aria-hidden="true" style="${styleString({ display: "inline-flex", color: node.color ? colorToCSS(node.color) : theme.text, fontSize: u(node.fontSize ?? 24) })}">${svg}</span>` : ""; }
    case "component": return componentHTML(node);
    default: return "";
  }
}

/** The per-instance style that makes the inspector's Design + Typography controls act on the COMPONENT ITSELF
 *  (`.eu-<component>`) rather than its wrapper box — scoped to this instance's export class (`bx-<id>`). */
function componentInjectCss(node: BoxNode): string {
  const isAlert = node.component === "alert";
  const name = node.component === "accordion" ? "accordion" : node.component!;
  // The alert's "component box" is the .eu-alert-stack (the items are .eu-alert rows inside it).
  const sel = `.${classFor(node.id)} .eu-${isAlert ? "alert-stack" : name}`;
  const tcss = componentTextCss(node), bcss = componentBoxCss(node);
  // Whole-component Advanced CSS: bare declarations style the component box; `title{…}`/`body{…}`/`icon{…}` etc.
  // restyle that part of EVERY item (text, background, colour — anything).
  const adv = expandScopedCss(node.advancedCss, sel, node.component === "accordion" ? ACCORDION_CSS_PARTS : isAlert ? ALERT_CSS_PARTS : undefined);
  // When any accordion item is detached (floating), make the accordion a positioning context and reserve
  // height so floats aren't clipped. Reverts on mobile, where floated items return to the normal stack.
  let floatCtx = "";
  if (node.component === "accordion") {
    const reserve = itemFloatReserveRem(node.items ?? []);
    if (reserve > 0) floatCtx = `${sel}{position:relative;min-height:${reserve}rem}@media (max-width:480px){${sel}{min-height:0}}`;
  }
  // REUSABLE across components: if the whole component has a block background, let it show through the items.
  const itemSel = COMPONENT_ITEM_SEL[node.component!];
  const showThrough = itemSel ? bgShowThroughCss(node, `${sel} ${itemSel}`) : "";
  // RULE G/K: a hug-to-content block must be able to size to its contents — see hugContainmentCss.
  return [tcss ? `${sel}, ${sel} *{${tcss}}` : "", bcss ? `${sel}{${bcss}}` : "", adv, floatCtx, showThrough, hugContainmentCss(node, sel)].filter(Boolean).join("");
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
    const itemStyles: string[] = []; // per-ITEM Advanced CSS, scoped to that one item
    let lastCat: string | undefined; // category grouping — a heading before the first item of each group
    const items = (node.items ?? []).map((it, i) => {
      const catHead = it.category && it.category !== lastCat ? `<div class="eu-accordion__category">${esc(it.category)}</div>` : "";
      lastCat = it.category;
      const icon = it.icon ? `<span class="eu-accordion__icon" aria-hidden="true">${iconSvg(it.icon)}</span>` : "";
      const media = it.media ? `<img class="eu-accordion__media" src="${esc(it.media)}" alt="${esc(it.mediaAlt ?? "")}" />` : "";
      const meta = it.meta ? `<span class="eu-accordion__meta">${esc(it.meta)}</span>` : "";
      // Per-ITEM styling: the point-and-click Header/Content colour+font controls, then the raw CSS box
      // (bare declarations style THIS item; `title{…}`/`body{…}`/`icon{…}` blocks target one part).
      let itemCls = "eu-accordion__item";
      if (itemHasOverride(it)) {
        const ic = `eu-acc-i-${esc(it.id)}`;
        const rule = itemOverrideCss(`.eu-accordion .${ic}`, it, { mobileReset: true });
        if (rule) { itemCls += ` ${ic}`; itemStyles.push(rule); }
      }
      // Ordinal (01, 02…) fed to numbered designs as CSS vars — deterministic, matches the editor exactly.
      const nvars = Object.entries(itemNumberVars(i)).map(([k, v]) => `${k}:${v}`).join(";");
      // Per-item deep-link: a stable id on the <details> so #slug scrolls to (and, via the script below, opens) it.
      const idAttr = it.anchor ? ` id="${esc(it.anchor)}"` : "";
      // Nested sub-accordion (one level) rendered inside the body — the `.eu-accordion .eu-accordion` CSS indents it.
      const kids = (it.children ?? []).length
        ? `<div class="eu-accordion eu-accordion--nested">${(it.children ?? []).map((c) => `<details class="eu-accordion__item"${c.open ? " open" : ""}><summary class="eu-accordion__header"><span class="eu-accordion__title">${esc(c.title)}</span></summary><div class="eu-accordion__body">${richBody(c.body)}</div></details>`).join("")}</div>`
        : "";
      // Body is rich (safe markdown-lite → links / bold / italic / lists / paragraphs), then any nested items.
      return `${catHead}<details${idAttr} class="${itemCls}" style="${nvars}"${it.open ? " open" : ""}${grp}><summary class="eu-accordion__header">${icon}${media}<span class="eu-accordion__title">${esc(it.title)}</span>${meta}</summary><div class="eu-accordion__body">${richBody(it.body)}${kids}</div></details>`;
    }).join("");
    // FAQ SEO: opt-in schema.org FAQPage JSON-LD (rich results). Each item → Question + Answer (plain text).
    const faqSchema = node.accFaqSchema && (node.items ?? []).length
      ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: (node.items ?? []).map((it) => ({ "@type": "Question", name: it.title, acceptedAnswer: { "@type": "Answer", text: plainBody(it.body) } })) }).replace(/</g, "\\u003c")}<\/script>`
      : "";
    const istyle = itemStyles.length ? `<style>${itemStyles.join("")}</style>` : "";
    // Deep-link: when any item has an anchor, add a tiny GLOBAL-guarded script that opens + scrolls to the
    // item whose id matches the URL hash (on load + hashchange). Progressive enhancement — links still scroll without JS.
    const deepScript = (node.items ?? []).some((it) => it.anchor)
      ? `<script>(function(){if(window.__euAccDeep)return;window.__euAccDeep=1;function o(){var h=location.hash.slice(1);if(!h)return;var e=document.getElementById(h);var d=e&&e.closest?e.closest('details.eu-accordion__item'):null;if(d){d.open=true;d.scrollIntoView();}}addEventListener('hashchange',o);o();})();<\/script>`
      : "";
    // Opt-in interactivity (Expand/Collapse-all + Search). The accordion stays ZERO-JS unless one is enabled;
    // each adds a small SCOPED script (progressive enhancement — the panels still work without JS).
    const accId = `eu-acc-${esc(node.id)}`;
    const needsId = node.accShowAll || node.accSearch;
    const searchBox = node.accSearch ? `<div class="eu-accordion__search"><span class="eu-accordion__search-ico" aria-hidden="true">${iconSvg("Search")}</span><input type="search" data-eu-acc-search placeholder="Search…" aria-label="Search these items" /><div class="eu-accordion__noresults" data-eu-acc-empty hidden>No matching items.</div></div>` : "";
    const controls = node.accShowAll ? `<div class="eu-accordion__controls"><button type="button" data-eu-acc-all="open">Expand all</button><button type="button" data-eu-acc-all="close">Collapse all</button></div>` : "";
    const showAllScript = node.accShowAll ? `<script>(function(){var a=document.getElementById('${accId}');if(!a)return;a.querySelectorAll('[data-eu-acc-all]').forEach(function(b){b.addEventListener('click',function(){var o=b.getAttribute('data-eu-acc-all')==='open';a.querySelectorAll('details.eu-accordion__item').forEach(function(d){d.open=o;});});});})();<\/script>` : "";
    // Search: filter items by text; hide category headings while searching (no orphans); show a no-results note.
    const searchScript = node.accSearch ? `<script>(function(){var a=document.getElementById('${accId}');if(!a)return;var s=a.querySelector('[data-eu-acc-search]');if(!s)return;var e=a.querySelector('[data-eu-acc-empty]');s.addEventListener('input',function(){var q=s.value.toLowerCase(),n=0;a.querySelectorAll(':scope > .eu-accordion__item').forEach(function(d){var t=(d.textContent||'').toLowerCase(),m=!q||t.indexOf(q)>=0;d.style.display=m?'':'none';if(m)n++;});a.querySelectorAll(':scope > .eu-accordion__category').forEach(function(h){h.style.display=q?'none':'';});if(e)e.hidden=!(q&&n===0);});})();<\/script>` : "";
    const idPart = needsId ? ` id="${accId}"` : "";
    // "--split" design: a media/visual panel beside the items (grid places it in column 1, items in column 2).
    const splitUrl = node.accSplitMedia && /^(https?:|data:)/.test(node.accSplitMedia) ? node.accSplitMedia.replace(/["'()\\]/g, "") : "";
    const splitPanel = node.variant === "--split" ? `<div class="eu-accordion__panel"${splitUrl ? ` style="background-image:url('${splitUrl}')"` : ""}></div>` : "";
    return `${style}${istyle}<div class="${cls}"${idPart}>${splitPanel}${searchBox}${controls}${items}</div>${showAllScript}${searchScript}${deepScript}${faqSchema}`;
  }
  // Alert — a multi-item component (mirrors the accordion), rendered from the SAME shared HTML as the canvas,
  // plus its opt-in zero-JS dismiss script.
  if (node.component === "alert") return `${style}${renderAlertHTML(node)}${alertDismissScript(node)}`;
  // Every other component renders as ONE clean node straight from the registry (same HTML the canvas shows),
  // plus its opt-in progressive-enhancement script (zero-JS unless the component asked for one, e.g. dismiss).
  if (isRegistryComponent(node.component)) return `${style}${renderComponent(node.component!, node.componentFields, node.variant)}${componentScripts(node.component!, node.componentFields, node.variant, node.id)}`;
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
  if (isContainer(r)) {
    const cs: CSSProperties = { ...containerStyle(r, bp), ...wrap };
    // An EMPTY container that paints a background would collapse to 0px in the exported/preview site (the editor's
    // "Drag a block here" placeholder gives it height, but that's editor-only). Give it a visible band so the
    // background actually shows — unless the user gave it an explicit height/min-height.
    const empty = !(r.children && r.children.length);
    const paints = !selfPaint && (r.bgImage || r.background || r.bgOverlay);
    if (empty && paints && r.minHeight == null && r.height == null && cs.minHeight == null && cs.height == null) cs.minHeight = "8rem";
    return cs;
  }
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
