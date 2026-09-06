/**
 * Static HTML export for the box builder — the publish GROUNDWORK.
 *
 * A BoxSite becomes a FOLDER of files, delivered as a ZIP: one `.html` per page plus a shared `styles.css`
 * the browser caches once. A sticky nav appears on every page and `page:<id>` links resolve to the other
 * page's relative filename, so the site works opened from a folder or a USB stick as well as from a host.
 * Styles come from the same pure box-model helpers the editor uses, so the canvas and the export agree.
 */

import type { CSSProperties } from "react";
import {
  type BoxNode, type Breakpoint, containerStyle, childStyle, marginCSS, sizeToCSS, radiusCSS, SHADOW_CSS, u, baseUnit,
  resolveResponsive, floatStacksOnMobile, alertToastCss, accordionClasses, bandClasses, videoEmbedSrc, isContainer, sanitizeCssDeclarations, expandScopedCss, COMPONENT_PARTS, itemFloatContextCss, itemOverrideCss, itemNumberVars, richBody, plainBody, componentTextCss, componentBoxCss, bgImageLayer, renderAlertHTML, alertDismissScript, bgShowThroughCss, blockContainmentCss, COMPONENT_ITEM_SEL, remLen, imageSizing, hasIntrinsicSize, itemNeedsClass, itemScope,
} from "@/lib/box-model";
import { isRegistryComponent, renderComponent, componentScripts } from "@/lib/educo-ui/registry";
import { iconSvg } from "@/lib/educo-ui/icon-svg";
import type { BoxSite } from "@/lib/box-site";
import type { SiteTheme } from "@/lib/site-storage";
import { colorToCSS } from "@/components/shared/ColorPalettePicker";
import { BREAKPOINTS_EM, BASE_CSS } from "@/lib/educo-ui/base";
import { COMPONENT_CSS } from "@/lib/educo-ui/components";
import { tokensFromTheme, tokensToCss } from "@/lib/educo-ui/tokens";
import { subsetCss, usedEuClasses, stripComments } from "@/lib/educo-ui/subset";
import { familiesInUse } from "@/lib/educo-ui/font-embed";
import { zipSync, strToU8 } from "fflate";
import { hoverCss, revealCss, revealKeyframes, itemEffectsCss } from "@/lib/interactions";

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

/**
 * A link's destination. `page:<id>` is resolved through the page map, and the map holds the FINAL href — a
 * filename (`about.html`) for the multi-page export, a fragment (`#about`) for the single-document preview.
 * Keeping the shape in the map rather than in this function means one resolver serves both, and neither can
 * drift from the other.
 */
const hrefFor = (node: BoxNode, pageMap: Map<string, string>): string => {
  const h = node.href ?? "#";
  if (h.startsWith("page:")) return pageMap.get(h.slice(5)) ?? "#";
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
    // `loading`/`decoding` are set from the block's own settings: a hero must load eagerly or the page opens
    // blank at the top, while a photo further down should wait until it is nearly on screen.
    // The intrinsic `width`/`height` attributes are what let the browser reserve the right box before a single
    // byte of the photo has arrived — without them the page reflows as each picture lands and the reader's
    // line of text jumps out from under them (Cumulative Layout Shift).
    case "image": {
      if (!node.src) return "";
      const { height, aspectRatio } = imageSizing(node);
      const dims = hasIntrinsicSize(node) ? ` width="${node.imgW}" height="${node.imgH}"` : "";
      return `<img src="${esc(node.src)}" alt="${esc(node.alt ?? "")}"${dims} loading="${node.eager ? "eager" : "lazy"}" decoding="async" style="${styleString({ width: "100%", height, aspectRatio, objectFit: "cover", display: "block" })}" />`;
    }
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
  const adv = expandScopedCss(node.advancedCss, sel, COMPONENT_PARTS[node.component!]);
  // RULE N — when ANY item of ANY component is detached (floating), its box becomes a positioning context and
  // reserves height so floats are never clipped. Reverts on mobile, where floated items return to the stack.
  const floatCtx = itemFloatContextCss(node.items, sel, { stackOnNarrow: true });
  // REUSABLE across components: if the whole component has a block background, let it show through the items.
  const itemSel = COMPONENT_ITEM_SEL[node.component!];
  const showThrough = itemSel ? bgShowThroughCss(node, `${sel} ${itemSel}`) : "";
  // RULE G/K/R: the block box carries the container-query context (and drops it while hugging) — see blockContainmentCss.
  // TOAST floats in a viewport corner on the published page (the canvas pins it to the page frame instead).
  const toast = alertToastCss(node, sel);
  return [tcss ? `${sel}, ${sel} *{${tcss}}` : "", bcss ? `${sel}{${bcss}}` : "", adv, floatCtx, showThrough, blockContainmentCss(node, sel), toast].filter(Boolean).join("");
}

/** Render an Educo UI component instance to its `.eu-*` markup + a per-instance <style> (so Design/Typography
 *  controls style the component itself). The wrapper handles only size/position/margins. */
function componentHTML(node: BoxNode): string {
  const inject = componentInjectCss(node);
  const style = inject ? `<style>${inject}</style>` : "";
  if (node.component === "accordion") {
    const cls = accordionClasses(node);
    // A shared `name` groups <details> so only one opens at a time (native exclusive accordion); omitted when multi-open.
    const grp = node.accMultiOpen ? "" : ` name="acc-${esc(node.id)}"`;
    const itemStyles: string[] = []; // per-ITEM Advanced CSS, scoped to that one item
    let lastCat: string | undefined; // category grouping — a heading before the first item of each group
    const items = (node.items ?? []).map((it, i) => {
      const catHead = it.category && it.category !== lastCat ? `<div class="eu-accordion__category">${esc(it.category)}</div>` : "";
      lastCat = it.category;
      const icon = it.icon ? `<span class="eu-accordion__icon" aria-hidden="true">${iconSvg(it.icon)}</span>` : "";
      // Same loading policy as an image block. The thumbnail's box is already reserved by CSS (a fixed em
      // square), so there is nothing to shift — but a list of twenty items should not fetch twenty pictures
      // before the visitor has scrolled to any of them.
      const media = it.media ? `<img class="eu-accordion__media" src="${esc(it.media)}" alt="${esc(it.mediaAlt ?? "")}" loading="lazy" decoding="async" />` : "";
      const meta = it.meta ? `<span class="eu-accordion__meta">${esc(it.meta)}</span>` : "";
      // Per-ITEM styling: the point-and-click Header/Content colour+font controls, then the raw CSS box
      // (bare declarations style THIS item; `title{…}`/`body{…}`/`icon{…}` blocks target one part).
      let itemCls = "eu-accordion__item";
      if (itemNeedsClass(it)) {
        const ic = `eu-acc-i-${esc(it.id)}`;
        const rule = itemOverrideCss(`.eu-accordion .${ic}`, it, { stackOnNarrow: true });
        // This row's own hover / entrance, at its own scope — the same emitters a block uses.
        const fx = itemEffectsCss(itemScope("accordion", it.id), it);
        if (rule || fx) { itemCls += ` ${ic}`; itemStyles.push(rule + fx); }
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
  // RULE N: stackOnNarrow so free placement only applies from the `sm` breakpoint up — the stack is the base.
  if (node.component === "alert") return `${style}${renderAlertHTML(node, undefined, { stackOnNarrow: true })}${alertDismissScript(node)}`;
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
// MOBILE-FIRST (Responsive Design Field Guide, ingredient ④): the BASE rule is the phone layout, and wider
// screens ADD to it through `min-width` queries in `em` on the documented ladder. `em` so a reader who has
// raised their browser's base font crosses the breakpoints later, in step with their own preference.
// (Previously the base was DESKTOP and narrow screens undid it with `max-width` px queries — the exact
// inversion the guide warns against. The editor's per-device DATA model is unchanged: a page still stores a
// base plus tablet/mobile overrides; only the CSS that comes out of it is now built up instead of torn down.)
// The editor stores three layers (a base, plus tablet and mobile overrides); the ladder has five rungs. These
// two lines are where the one maps onto the other, and they are the ONLY place that mapping is decided.
// Tablet overrides therefore cover BOTH tablet orientations, and the desktop layer starts at the desktop rung.
const TABLET_MIN_EM = BREAKPOINTS_EM.tabletPortrait; // 37.5em / 600px — tablet layout and up
const DESKTOP_MIN_EM = BREAKPOINTS_EM.desktop; // 75em / 1200px — desktop layout and up
type Sheet = { base: string[]; tablet: string[]; desktop: string[]; reveals: Set<string> };
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
  if (r.minHeight != null) wrap.minHeight = remLen(r.minHeight); // rem, never px (field guide ②)
  // RULE O — a self-painting block's height is a FLOOR (min-height) so its content can never spill out, and the
  // block is a column flex so its `.eu-root` still stretches to fill it (no empty gap under the component).
  if (r.height) {
    if (selfPaint) { wrap.minHeight = sizeToCSS(r.height); wrap.display = "flex"; wrap.flexDirection = "column"; }
    else wrap.height = sizeToCSS(r.height);
  }
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
function renderNode(node: BoxNode, rawParent: BoxNode | null, theme: SiteTheme, pageMap: Map<string, string>, sheet: Sheet, isPageSection = false): string {
  const r = resolveResponsive(node, "base");
  if (r.hidden && !node.responsive) return ""; // hidden at base with no per-device un-hide → skip entirely
  const cls = classFor(node.id);
  // Build UP: the phone layout is the base rule, tablet adds what changes at `sm`, desktop adds what changes
  // again at `lg`. Each block is diffed against the one BELOW it, which is the order the cascade applies them.
  const phoneObj = styleAt(node, rawParent, "mobile");
  const tabletObj = styleAt(node, rawParent, "tablet");
  const desktopObj = styleAt(node, rawParent, "base");
  const ov = overridesCss(r);
  sheet.base.push(`.${cls}{${[styleString(phoneObj), ov].filter(Boolean).join(";")}}`);
  // Hover & focus (Interactions 1a) — the SAME emitter the canvas uses, so the builder shows exactly what a
  // visitor gets. Pure CSS: a page with no effects ships nothing extra.
  const hov = hoverCss(`.${cls}`, r.hoverEffect);
  if (hov) sheet.base.push(hov);
  // Entrance (Round 1b). The keyframes are global, so the ids used are collected and emitted ONCE at assembly.
  // A COMPONENT passes its item selector, so "arrive one after another" staggers the accordion rows or the
  // alert messages — its wrapper's direct children are a <style> tag and the component itself.
  const rev = revealCss(`.${cls}`, r, { staggerSelector: r.component ? COMPONENT_ITEM_SEL[r.component] : undefined });
  if (rev) { sheet.base.push(rev); if (r.revealEffect) sheet.reveals.add(r.revealEffect); }
  // An ITEM's entrance needs its keyframes on the page too. They are emitted once, at assembly, from this
  // set — so an item effect whose id never reached it would animate to a name that does not exist, which is
  // silently nothing at all.
  for (const it of r.items ?? []) if (it.revealEffect) sheet.reveals.add(it.revealEffect);
  const tDiff = diffStyle(phoneObj, tabletObj);
  if (tDiff) sheet.tablet.push(`.${cls}{${tDiff}}`);
  const dDiff = diffStyle(tabletObj, desktopObj);
  if (dDiff) sheet.desktop.push(`.${cls}{${dDiff}}`);
  const idAttr = r.anchor ? ` id="${esc(r.anchor)}"` : "";
  // A structural band also carries its layout classes — computed by box-model, so the canvas gets the same ones.
  const allCls = [cls, bandClasses(r, isPageSection)].filter(Boolean).join(" ");
  if (isContainer(r)) {
    // Children of the PAGE ROOT (the only call with no parent) are the page's sections; nothing deeper is.
    const kidsAreSections = rawParent === null;
    const kids = (r.children ?? []).map((c) => renderNode(c, node, theme, pageMap, sheet, kidsAreSections)).join("");
    return `<div${idAttr} class="${allCls}">${kids}</div>`;
  }
  return `<div${idAttr} class="${allCls}">${elementHTML(r, theme, pageMap)}</div>`;
}

/** Turn the collected rules into a stylesheet: the phone layout first, then each wider screen adds to it. */
function sheetCss(sheet: Sheet): string {
  return [
    // One copy of each entrance's keyframes, for the effects this page actually uses.
    revealKeyframes(sheet.reveals),
    sheet.base.join(""),
    sheet.tablet.length ? `@media (min-width:${TABLET_MIN_EM}em){${sheet.tablet.join("")}}` : "",
    sheet.desktop.length ? `@media (min-width:${DESKTOP_MIN_EM}em){${sheet.desktop.join("")}}` : "",
  ].filter(Boolean).join("");
}

/** Render one page's tree to an HTML fragment. The page's own responsive stylesheet is emitted as a leading
 *  `<style>` block (a passed `sheet` instead accumulates into a shared document-level sheet, no inline block). */
export function renderPageHTML(root: BoxNode, theme: SiteTheme, pageMap: Map<string, string> = new Map(), sheet?: Sheet): string {
  if (sheet) return renderNode(root, null, theme, pageMap, sheet); // shared sheet → caller emits the CSS
  const own: Sheet = { base: [], tablet: [], desktop: [], reveals: new Set<string>() };
  const body = renderNode(root, null, theme, pageMap, own);
  return `<style>${sheetCss(own)}</style>${body}`;
}


// ── MULTI-PAGE EXPORT ────────────────────────────────────────────────────────────────────────────
/**
 * A finished site: filename → file contents. `index.html` is always the home page.
 *
 * WHY THIS REPLACED THE SINGLE-FILE EXPORT (decided 2026-09-06). The old exporter emitted ONE document with
 * every page as a `<section id="slug">`, linked by `#fragment`. That is one file to host, but it costs the
 * things a school actually needs:
 *   • a page cannot be found by search — engines index pages, not fragments;
 *   • a parent cannot be sent to Term Dates, or bookmark it;
 *   • every visitor downloads the whole site to read one page;
 *   • printing anything prints everything.
 * Real files fix all four. Page-to-page view transitions become possible as a by-product, but they are not
 * the reason.
 */
export type SiteFiles = Record<string, string>;

/** The stylesheet every page links. Shared, so a visitor downloads it once and the second page is free. */
export const SHARED_STYLESHEET = "styles.css";

/** A page's filename. The home page is `index.html` so a plain folder or a static host just works. */
export function fileNameFor(page: { id: string; path: string }, homeId: string): string {
  if (page.id === homeId) return "index.html";
  const slug = (page.path || page.id).replace(/^\/+|\/+$/g, "").replace(/[^A-Za-z0-9_-]/g, "-").toLowerCase();
  return `${slug || page.id}.html`;
}

/** Every page's filename, keyed by id — this is what `page:<id>` links resolve through. */
export function siteFileMap(site: BoxSite): Map<string, string> {
  return new Map(site.pages.map((p) => [p.id, fileNameFor(p, site.homeId)]));
}

/**
 * The nav, rendered into EVERY page.
 *
 * `aria-current="page"` marks where the visitor is — without it a screen-reader user has no way to tell which
 * of five links is the page they are on. Links are RELATIVE (`about.html`, never `/about`) so the export still
 * works opened from a folder, a USB stick, or a subdirectory on a host.
 */
function siteNav(site: BoxSite, files: Map<string, string>, currentId: string): string {
  const ordered = orderedPages(site);
  const links = ordered.map((p) => {
    const href = files.get(p.id) ?? "index.html";
    const current = p.id === currentId ? ` aria-current="page"` : "";
    return `<a href="${esc(href)}"${current}>${esc(p.name)}</a>`;
  }).join("");
  return `<nav class="eu-site-nav">${links}</nav>`;
}

/** Home first, then the rest in their existing order — the nav reads the way a visitor expects. */
function orderedPages(site: BoxSite) {
  return [...site.pages].sort((a, b) => (a.id === site.homeId ? -1 : b.id === site.homeId ? 1 : 0));
}

/**
 * Render the whole site as separate files.
 *
 * The CSS is SPLIT deliberately: the design system (tokens, base, components) is identical on every page, so it
 * goes in one `styles.css` the browser caches once — the second page costs nothing. Only the page's own block
 * rules are inlined, because those are unique per page and there is nothing to cache.
 */
/**
 * ONE page of the site, rendered exactly as the export renders it — same nav, same links, same markup.
 *
 * This is what the PREVIEW shows, so a user previews the real file rather than an approximation of it.
 *
 * The single deliberate difference is `inlineShared`. The exported page LINKS `styles.css`; inside the
 * preview's `srcdoc` iframe there is no such file to fetch, so the shared sheet is inlined instead. Same CSS,
 * same result — only how it arrives differs, and it has to, because a srcdoc document has nothing to resolve a
 * relative URL against.
 */
export function renderSitePage(site: BoxSite, theme: SiteTheme, pageId: string, opts: { inlineShared?: boolean } = {}): string {
  const files = siteFileMap(site);
  const page = site.pages.find((p) => p.id === pageId) ?? orderedPages(site)[0];
  if (!page) return "";
  const sheet: Sheet = { base: [], tablet: [], desktop: [], reveals: new Set<string>() };
  const body = renderPageHTML(page.root, theme, files, sheet);
  const nav = siteNav(site, files, page.id);
  const markup = `${nav}\n${body}`;
  const components = subsetCss(COMPONENT_CSS, usedEuClasses(markup));
  const shared = opts.inlineShared ? `${sharedCss(theme)}\n${SITE_CHROME_CSS}` : undefined;
  return pageDocument(theme, page.name, markup, [components, sheetCss(sheet)].filter(Boolean).join("\n"), shared);
}

/**
 * Every CSS font stack a site asks for — the theme's three, plus every per-block and per-item override.
 *
 * Walked from the model rather than the rendered HTML because a font can be set on a block that renders no
 * text of its own, and because the stack is what names the family.
 */
export function fontStacksInSite(site: BoxSite, theme: SiteTheme): string[] {
  const out: string[] = [theme.headingFont, theme.bodyFont];
  const walk = (n: BoxNode | undefined) => {
    if (!n) return;
    if (n.fontFamily) out.push(n.fontFamily);
    for (const it of n.items ?? []) {
      const item = it as unknown as { fontFamily?: string; children?: { fontFamily?: string }[] };
      if (item.fontFamily) out.push(item.fontFamily);
      for (const c of item.children ?? []) if (c.fontFamily) out.push(c.fontFamily);
    }
    for (const c of n.children ?? []) walk(c);
  };
  for (const p of site.pages) walk(p.root);
  return out;
}

/** The families a site needs loading, ready to hand to `embedFontCss`. */
export function fontFamiliesInSite(site: BoxSite, theme: SiteTheme): string[] {
  return familiesInUse(fontStacksInSite(site, theme));
}

export function renderSiteFiles(site: BoxSite, theme: SiteTheme, fontCss = ""): SiteFiles {
  const files = siteFileMap(site);
  const out: SiteFiles = {};

  for (const page of orderedPages(site)) {
    // Each page gets its own sheet, so a page carries only the rules for the blocks actually on it.
    const sheet: Sheet = { base: [], tablet: [], desktop: [], reveals: new Set<string>() };
    const body = renderPageHTML(page.root, theme, files, sheet);
    const nav = siteNav(site, files, page.id);
    const markup = `${nav}\n${body}`;
    // Only the component rules this page's markup actually uses — read from the RENDERED HTML, so it
    // cannot disagree with what the page contains.
    const components = subsetCss(COMPONENT_CSS, usedEuClasses(markup));
    out[files.get(page.id)!] = pageDocument(theme, page.name, markup, [components, sheetCss(sheet)].filter(Boolean).join("\n"), undefined, prefetchLinks(files, page.id));
  }

  // The SHARED sheet is only what is identical everywhere — tokens, base, site chrome. The component
  // library is deliberately absent: 65 KB of which a page uses a fraction, so it is subsetted into each
  // page instead. What remains here is small, and it is the part worth caching.
  // Fonts go FIRST, so a face is defined before any rule asks for it. They are embedded as data: URIs by the
  // caller, which is the only asynchronous part of an export — see lib/educo-ui/font-embed.ts for why they are
  // self-hosted rather than linked. An empty string here is a deliberate, survivable outcome: the stack's
  // fallback still applies, so the page reads in a near-enough typeface instead of failing to download.
  out[SHARED_STYLESHEET] = [fontCss, sharedCss(theme), SITE_CHROME_CSS].filter(Boolean).join("\n");
  return out;
}

/**
 * The shared half: tokens and the base layer, which every page needs whole. `stylesheet()` also bundles the
 * component library — this takes the same two pieces without it, because components are subsetted per page.
 */
function sharedCss(theme: SiteTheme): string {
  // Comments are for whoever maintains this stylesheet, not for a parent loading it on a phone. The component
  // half already drops them; the shared half was shipping every one of its own to every visitor of every page.
  return stripComments(`${tokensToCss(tokensFromTheme(theme))}\n${BASE_CSS}`);
}

/** The nav's own styling — part of the shared sheet because it appears on every page. */
const SITE_CHROME_CSS = `html,body{max-width:100%;overflow-x:hidden}
.eu-site-nav{position:sticky;top:0;z-index:30;display:flex;gap:4px;padding:8px 16px;background:var(--eu-color-surface);border-bottom:1px solid var(--eu-color-border)}
.eu-site-nav a{color:var(--eu-color-text);text-decoration:none;padding:8px 12px;border-radius:var(--eu-radius-md)}
.eu-site-nav a:hover{background:var(--eu-color-surface-2)}
.eu-site-nav a[aria-current="page"]{background:var(--eu-color-surface-2);font-weight:600}
.eu-site-nav a:focus-visible{outline:2px solid var(--eu-color-brand);outline-offset:2px}`;

/**
 * Fetch the site's OTHER pages while the browser is idle, so following a nav link opens instantly.
 *
 * The plan called for `rel="prefetch"` on the nav anchors themselves. That does nothing: `prefetch` is a
 * `<link>` relationship, and no browser acts on it when it appears on an `<a>` — it would have looked done
 * and changed nothing. The head link is the form that actually works.
 *
 * Every sibling page is prefetched rather than some capped number of them: a page is only its own markup here
 * (the design system lives in the already-cached `styles.css`), a school site is a handful of pages, and
 * prefetch is the lowest priority the browser has — it yields to everything the current page still needs.
 */
function prefetchLinks(files: Map<string, string>, currentId: string): string {
  return [...files.entries()]
    .filter(([id]) => id !== currentId)
    .map(([, href]) => `<link rel="prefetch" href="${esc(href)}">`)
    .join("");
}

/**
 * One page of a multi-page site.
 *
 * The shared sheet is a `<link>`, not inlined: inlining it would repeat the whole design system in every file
 * and defeat caching entirely.
 *
 * `prefetch` is passed only for the REAL export. Inside the preview's `srcdoc` iframe there is no base URL to
 * resolve `about.html` against, so the same links would resolve to nothing and log a failed request for every
 * page in the site — noise that says a bug exists where none does.
 */
function pageDocument(theme: SiteTheme, title: string, body: string, pageCss: string, inlineShared?: string, prefetch = ""): string {
  // Linked for the real export so it caches across pages; inlined only for the preview iframe, which has no
  // file to link to.
  const shared = inlineShared !== undefined
    ? `<style>${inlineShared}</style>`
    : `<link rel="stylesheet" href="${SHARED_STYLESHEET}">`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
${shared}${prefetch}
${pageCss ? `<style>${pageCss}</style>` : ""}
</head><body class="eu-root">${body}</body></html>`;
}

/**
 * Download a whole site as a ZIP.
 *
 * A multi-page export is several files, and a browser cannot hand over a folder — so the site arrives as one
 * archive the school unzips and uploads. This is the most visible change to how a site is received, which is
 * why the guide has to say so.
 */
export function downloadSite(files: SiteFiles, filename = "site.zip"): void {
  // `document` alone is not enough: jsdom and some SSR shims provide a document but no object-URL support,
  // and calling through then throws. The old single-file download checked all three; dropping two of them
  // when this replaced it is what the no-op test caught.
  if (typeof document === "undefined" || typeof URL === "undefined" || !URL.createObjectURL) return;
  const zipped = zipSync(Object.fromEntries(Object.entries(files).map(([name, text]) => [name, strToU8(text)])));
  // Copy into a plain ArrayBuffer — a Uint8Array view can be a slice of a larger buffer, and Blob would then
  // carry bytes that are not part of this archive.
  const blob = new Blob([zipped.slice().buffer as ArrayBuffer], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
