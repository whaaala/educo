/**
 * Static HTML export for the box builder — the publish GROUNDWORK. Renders a BoxSite to one self-contained
 * HTML document: every page becomes a <section id="slug">, a sticky nav links between them, and "page:<id>"
 * links resolve to "#slug" so navigation works in the exported file. Styles are inlined from the same pure
 * box-model helpers the editor uses (desktop / base breakpoint). Hosting + per-breakpoint CSS come later.
 */

import type { CSSProperties } from "react";
import {
  type BoxNode, containerStyle, childStyle, marginCSS, sizeToCSS, radiusCSS, SHADOW_CSS, u, baseUnit,
  resolveResponsive, videoEmbedSrc, isContainer, sanitizeCssDeclarations,
} from "@/lib/box-model";
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
    case "button": return `<a href="${esc(hrefFor(node, pageMap))}"${node.newTab ? ' target="_blank" rel="noopener noreferrer"' : ""} style="${styleString({ display: "inline-flex", alignItems: "center", gap: "8px", borderRadius: "9999px", background: node.background ? colorToCSS(node.background) : theme.primary, color: node.color || "#fff", fontSize: u(node.fontSize ?? 14), padding: `${u(12)} ${u(24)}`, textDecoration: "none", ...typoCss(node, theme.bodyFont, 600) })}">${esc(node.text ?? "")}</a>`;
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

/** Render an Educo UI component instance to its `.eu-*` markup (the wrapper + token overrides come from renderNode). */
function componentHTML(node: BoxNode): string {
  if (node.component === "accordion") {
    const cls = "eu-accordion" + (node.variant ? ` eu-accordion${node.variant}` : "");
    // A shared `name` groups <details> so only one opens at a time (native exclusive accordion); omitted when multi-open.
    const grp = node.accMultiOpen ? "" : ` name="acc-${esc(node.id)}"`;
    const items = (node.accItems ?? []).map((it) => {
      const media = it.media ? `<img class="eu-accordion__media" src="${esc(it.media)}" alt="" />` : "";
      const meta = it.meta ? `<span class="eu-accordion__meta">${esc(it.meta)}</span>` : "";
      return `<details class="eu-accordion__item"${it.open ? " open" : ""}${grp}><summary class="eu-accordion__header">${media}${esc(it.title)}${meta}</summary><div class="eu-accordion__body">${esc(it.body)}</div></details>`;
    }).join("");
    return `<div class="${cls}">${items}</div>`;
  }
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

/** Render a node (and subtree) to HTML. `parent` is the RESOLVED parent (for childStyle). */
function renderNode(node: BoxNode, parent: BoxNode | null, theme: SiteTheme, pageMap: Map<string, string>): string {
  const r = resolveResponsive(node, "base");
  if (r.hidden) return "";
  const floating = r.position === "absolute" && parent !== null;
  const wrap: CSSProperties = {
    position: floating ? "absolute" : "relative",
    // Responsive Field Guide: NO box may ever be wider than its container — a fixed px width (e.g. a floated
    // 500px card) shrinks to fit a narrow phone instead of forcing a horizontal scrollbar.
    maxWidth: "100%",
    ...decorCss(r),
    ...(floating ? {} : marginCSS(r)),
    opacity: r.opacity !== undefined ? r.opacity / 100 : undefined,
    overflow: (r.clip || radiusCSS(r)) ? "hidden" : undefined,
    ...(floating
      ? { left: `${r.left ?? 0}%`, top: `${r.top ?? 0}%`, width: sizeToCSS(r.width) ?? "40%", height: r.height ? sizeToCSS(r.height) : undefined, minHeight: r.minHeight, zIndex: r.zIndex ?? 1 }
      : parent ? childStyle(r, parent) : { width: "100%", ["--box-u" as string]: baseUnit(r.baseFont ?? 10) }),
    ...bgCss(r),
    ...(r.type === "component" ? componentTypoCss(r) : {}),
  };
  const idAttr = r.anchor ? ` id="${esc(r.anchor)}"` : "";
  const ov = overridesCss(r);
  const withOv = (s: string) => (ov ? `${s};${ov}` : s);
  if (isContainer(r)) {
    const kids = (r.children ?? []).map((c) => renderNode(c, r, theme, pageMap)).join("");
    return `<div${idAttr} style="${withOv(styleString({ ...containerStyle(r), ...wrap }))}">${kids}</div>`;
  }
  return `<div${idAttr} style="${withOv(styleString(wrap))}">${elementHTML(r, theme, pageMap)}</div>`;
}

/** Render one page's tree to an HTML fragment. */
export function renderPageHTML(root: BoxNode, theme: SiteTheme, pageMap: Map<string, string> = new Map()): string {
  return renderNode(root, null, theme, pageMap);
}

/**
 * Wrap page/site body HTML in a full, SELF-CONTAINED document: the Educo UI stylesheet (tokens + reset +
 * responsive base + component styles) is inlined and the body is scoped under `.eu-root`, so the exported
 * file renders identically anywhere with no external CSS. Phase 0.4 — the isolated preview/export shell.
 */
function documentShell(theme: SiteTheme, title: string, body: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<style>${stylesheet(theme)}</style>
<style>html,body{max-width:100%;overflow-x:hidden}.eu-site-nav{position:sticky;top:0;z-index:1000;display:flex;gap:4px;padding:8px 16px;background:var(--eu-color-surface);border-bottom:1px solid var(--eu-color-border)}.eu-site-nav a{color:var(--eu-color-text);text-decoration:none;padding:8px 12px;border-radius:var(--eu-radius-md)}.eu-site-nav a:hover{background:var(--eu-color-surface-2)}</style>
</head><body class="eu-root">${body}</body></html>`;
}

/** Render ONE page to a self-contained document (used by the isolated iframe preview). */
export function renderPageDocument(root: BoxNode, theme: SiteTheme, title = "Page", pageMap: Map<string, string> = new Map()): string {
  return documentShell(theme, title, renderPageHTML(root, theme, pageMap));
}

/** Render the whole site to ONE self-contained HTML document (each page a section + a sticky nav). */
export function renderSiteHTML(site: BoxSite, theme: SiteTheme): string {
  const pageMap = new Map(site.pages.map((p) => [p.id, p.path]));
  const ordered = [...site.pages].sort((a, b) => (a.id === site.homeId ? -1 : b.id === site.homeId ? 1 : 0));
  const nav = ordered.map((p) => `<a href="#${esc(p.path)}">${esc(p.name)}</a>`).join("");
  const sections = ordered.map((p) => `<section id="${esc(p.path)}">${renderPageHTML(p.root, theme, pageMap)}</section>`).join("\n");
  return documentShell(theme, ordered[0]?.name ?? "Site", `<nav class="eu-site-nav">${nav}</nav>\n${sections}`);
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
