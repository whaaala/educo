/**
 * READY-MADE SECTIONS (BATCH LE-15, ED-4+ (2); signed 2026-10-19 — docs/web-anatomy/layout-tiers/le15-design.md).
 *
 * A section is DATA (RULE CFG): a small tree in config/sections/<category>.json that names ROLES (title, body, button,
 * image…) and TONES (plain, soft, strong…), never a colour or a size. A FINISH (config/section-finishes.json — the
 * wireframe and the seven personalities of the design deck, RULE P) says what each role and tone looks like. Building a
 * section turns the two into ORDINARY blocks through `createContainer` / `createElement`, so once it is on the page
 * nothing about it is special: every word, colour, space and effect is the user's to change (D1 c).
 *
 * Pure and portable like the engine (rule 20): no React, no DOM.
 */
import FINISH_CONFIG from "@/config/section-finishes.json";
import COPY from "@/config/section-copy.json";
import PHOTO_CONFIG from "@/config/section-photos.json";
import LAYOUT from "@/config/layout.json";
import { createContainer, createElement, createGrid, makeRowBand, regionSpan, findBox, normalizeRowBands, markPageGrid, type BoxNode } from "@/lib/box-model";

/** A section dragged from the Sections tab carries its built blocks under this type (the canvas places it between bands). */
export const SECTION_DRAG_TYPE = "application/x-box-section";

export type Tone = "plain" | "soft" | "grey" | "strong" | "inverse" | "photo";
export type Role = "eyebrow" | "title" | "heading" | "body" | "small" | "stat" | "logo" | "link" | "button" | "button2" | "image" | "icon" | "menu" | "divider" | "list" | "quote";

/** One node of a section's tree: a container (`k`) or a block with a role (`r`). */
export interface SectionNode {
  k?: "section" | "header" | "footer" | "stack" | "row" | "grid" | "card";
  r?: Role;
  /** The designed words (a wireframe shows config/section-copy.json instead). */
  t?: string;
  c?: SectionNode[];
  tone?: Tone;
  /** Centre its words and blocks. */
  center?: boolean;
  /** A photo of the builder's set — behind a container, or an Image's picture. */
  photo?: string;
  alt?: string;
  /** A menu's or a list's items. */
  items?: string[];
  /** Where a button or link goes. */
  to?: string;
  icon?: string;
  /** A grid: at most this many across; each at least `min` wide (GR-2, "as many as fit"). */
  cols?: number;
  min?: string;
  /** The block's own layout fields (padding, gap, align, width, ratio…), applied last. */
  set?: Partial<BoxNode>;
}

export interface SectionDef {
  id: string;
  name: string;
  /** The catalogue pattern it follows (LAYOUT_BENCHMARK.md B1–B31). */
  pattern?: string;
  /** Components it stands in for until they are built (RULE C), shown on its tile: "form", "map"… */
  needs?: string[];
  tree: SectionNode;
  /** HH-1 · the tallest its pictures are drawn ("75svh"): its category file's `photoMaxHeight`, given by `categorySections`. */
  photoMaxHeight?: string;
}

/**
 * A CATEGORY FILE's layouts (config/sections/<id>.json), each carrying the file's own `photoMaxHeight` (BATCH LE-15h, HH-1): on
 * a very wide screen a hero's picture beside its words grew to 2,147px and took the words below an 820px window. The cap is
 * an ordinary Max height (SZ-3) on each picture, so the person sees it in the Inspector and can change or clear it.
 */
export function categorySections(file: { sections?: SectionDef[]; photoMaxHeight?: string }): SectionDef[] {
  return (file.sections ?? []).map((d) => (file.photoMaxHeight ? { ...d, photoMaxHeight: file.photoMaxHeight } : d));
}

type ToneColours = { bg: string; text: string; muted: string; accent: string; btnBg: string; btnText: string; line: string };
type RoleType = { size: number; weight: number; transform?: string; spacing?: number; italic?: boolean; lineHeight?: number };
export interface Finish {
  label: string;
  toneMap: Partial<Record<Tone, Tone>>;
  roles: Record<"eyebrow" | "title" | "heading" | "body" | "small" | "stat" | "logo" | "link", RoleType>;
  button: { radius: number; secondary: "outline" | "text" };
  card: { radius: number; shadow: "" | "sm" | "md" | "lg"; border: number };
  image: { radius: number };
  reveal: string;
  hover: string;
}

const CFG = FINISH_CONFIG as unknown as Record<string, unknown> & { tones: Record<Tone, ToneColours>; scrim: string; wireframe: Finish; restyle: { look: string[]; content: string[] } };
export const WIREFRAME = "wireframe";
/** The seven personalities, in the deck's order (config order). */
export const FINISH_IDS: string[] = Object.keys(CFG).filter((k) => !k.startsWith("$") && k !== "tones" && k !== "scrim" && k !== "restyle" && k !== WIREFRAME);
/** What a section on the page can be given (RF-1): the Wireframe, then the seven. */
export const FINISH_CHOICES: string[] = [WIREFRAME, ...FINISH_IDS];
export const nextFinish = (id?: string): string => FINISH_CHOICES[(FINISH_CHOICES.indexOf(id ?? "") + 1) % FINISH_CHOICES.length];
export const finishOf = (id: string): Finish => (CFG[id] as Finish | undefined) ?? (CFG[FINISH_IDS[0]] as Finish);
export const finishLabel = (id: string): string => (id === WIREFRAME ? CFG.wireframe.label : finishOf(id).label);

/** `keep`: the parts whose photo behind words is the person's own — it stays, shaded, in a wireframe too (RF-1); `onPhoto`:
 *  inside one, where every block keeps the photo's colours however deep it sits (LE15f-4: a row of buttons turned grey). */
type Ctx = { f: Finish; wire: boolean; tone: Tone; center: boolean; keep?: Set<string>; onPhoto?: boolean; cap?: string };
const toneOf = (ctx: Ctx, t?: Tone): Tone => { const want = t ?? ctx.tone; return ctx.f.toneMap[want] ?? want; };
const colours = (tone: Tone): ToneColours => CFG.tones[tone] ?? CFG.tones.plain;
const words = (ctx: Ctx, n: SectionNode, role: keyof typeof COPY): string => (ctx.wire ? (COPY[role] as string) : n.t ?? (COPY[role] as string));

function typeOf(f: Finish, role: keyof Finish["roles"]): Partial<BoxNode> {
  const r = f.roles[role];
  return {
    fontSize: r.size, fontWeight: r.weight,
    ...(r.transform ? { textTransform: r.transform as BoxNode["textTransform"] } : {}),
    ...(r.spacing ? { letterSpacing: r.spacing } : {}),
    ...(r.italic ? { italic: true } : {}),
    ...(r.lineHeight ? { lineHeight: r.lineHeight } : {}),
  };
}

/** A photo of the builder's set (D6, config/section-photos.json), by id; an id the set lacks leaves the picture for the person to add. */
type Photo = { alt: string; src: string; width: number; height: number };
const PHOTOS = (PHOTO_CONFIG as unknown as { photos: Record<string, Photo> }).photos;
const photoOf = (id?: string): Photo | undefined => (id ? PHOTOS[id] : undefined);
const photoSrc = (id?: string): string | undefined => photoOf(id)?.src;

function element(n: SectionNode, ctx: Ctx, path: string): BoxNode {
  const c = colours(ctx.tone);
  const f = ctx.f;
  const align = ctx.center ? { textAlign: "center" as const } : {};
  const motion = (on: boolean) => (on && !ctx.wire && f.reveal ? { revealEffect: f.reveal } : {});
  const hover = !ctx.wire && f.hover ? { hoverEffect: f.hover } : {};
  switch (n.r) {
    case "title": return createElement("heading", { text: words(ctx, n, "title"), width: "100%", color: c.text, ...typeOf(f, "title"), ...align, ...motion(true) });
    case "heading": return createElement("heading", { text: words(ctx, n, "heading"), width: "100%", color: c.text, ...typeOf(f, "heading"), ...align });
    case "quote": return createElement("text", { text: words(ctx, n, "quote"), width: "100%", color: c.text, ...typeOf(f, "heading"), italic: true, ...align });
    case "eyebrow": return createElement("text", { text: words(ctx, n, "eyebrow"), width: "100%", color: c.accent, ...typeOf(f, "eyebrow"), ...align });
    case "body": return createElement("text", { text: words(ctx, n, "body"), width: "100%", color: c.muted, ...typeOf(f, "body"), ...align, ...motion(true) });
    case "small": return createElement("text", { text: words(ctx, n, "small"), width: "100%", color: c.muted, ...typeOf(f, "small"), ...align });
    case "stat": return createElement("text", { text: words(ctx, n, "stat"), width: "100%", color: c.text, ...typeOf(f, "stat"), ...align });
    case "logo": return createElement("text", { text: words(ctx, n, "logo"), color: c.text, ...typeOf(f, "logo") });
    case "link": return createElement("link", { text: words(ctx, n, "link"), href: n.to ?? "#", underline: false, color: c.text, ...typeOf(f, "link") });
    case "button": return createElement("button", { text: words(ctx, n, "button"), href: n.to ?? "#", background: c.btnBg, color: c.btnText, radius: f.button.radius, ...hover });
    case "button2": {
      const outline = f.button.secondary === "outline";
      return createElement("button", { text: words(ctx, n, "button2"), href: n.to ?? "#", background: "transparent", color: c.text, radius: f.button.radius, ...(outline ? { borderWidth: 2, borderColor: c.text } : { underline: true }) });
    }
    case "image": {
      const p = ctx.wire ? undefined : photoOf(n.photo);
      return createElement("image", { ...(p ? { src: p.src, imgW: p.width, imgH: p.height } : {}), alt: p ? n.alt ?? p.alt : "", width: "100%", ratio: "4 / 3", ...(ctx.cap ? { maxHeight: ctx.cap } : {}), radius: f.image.radius, ...motion(true) });
    }
    case "icon": return createElement("icon", { icon: n.icon ?? "Star", color: c.accent });
    case "divider": return createElement("divider", { color: c.line });
    case "list": return createElement("list", { listItems: ctx.wire ? (n.items ?? []).map(() => COPY.link) : n.items ?? [], color: c.muted, ...typeOf(f, "body") });
    case "menu": {
      // A real menu, the way the header research builds one: a Menu (nav) › a List (ul) of Links (html-semantics.md).
      // On a phone the menu is ONE line that scrolls sideways (FL-6), every link reachable — measured, wrapped it took three
      // lines of a 375px header. ponytail: the phone's ☰ menu is the Navigation component's (PS-15 → CP-1).
      const list = createContainer("row", { tag: "ul", gap: 24, align: "center", wrap: true, width: "auto", responsive: { phone: { wrap: false, scrollX: true } }, sectionPart: `${path}.l` });
      list.children = (n.items ?? []).map((w, i) => createElement("link", { text: ctx.wire ? COPY.link : w, href: "#", underline: false, color: c.text, ...typeOf(f, "link"), sectionPart: `${path}.l.${i}` }));
      const nav = createContainer("row", { tag: "nav", width: "auto", align: "center" });
      nav.children = [list];
      return nav;
    }
    default: return createElement("text", { text: words(ctx, n, "body"), color: c.muted });
  }
}

function container(n: SectionNode, ctx: Ctx, path: string): BoxNode {
  const own = !!ctx.keep?.has(path) && n.tone === "photo";
  const tone = own || (ctx.onPhoto && !n.tone) ? "photo" : toneOf(ctx, n.tone);
  const c = colours(tone);
  const f = ctx.f;
  const inner: Ctx = { ...ctx, tone, center: n.center ?? ctx.center, onPhoto: tone === "photo" && (own || !!ctx.onPhoto) };
  const centre = n.center ? { align: "center" as const } : {};
  const paint = n.tone ? { background: c.bg } : {};
  const photo = n.photo && (!ctx.wire || own) && tone === "photo" ?{ ...(photoSrc(n.photo) ? { bgImage: photoSrc(n.photo), bgSize: "cover", bgPosition: "center" } : {}), bgOverlay: CFG.scrim } : {};
  let node: BoxNode;
  switch (n.k) {
    case "section": case "header": case "footer":
      node = createContainer("column", { tag: n.k, width: "100%", ...centre, ...paint, ...photo });
      break;
    case "row": node = createContainer("row", { wrap: true, align: "center", ...paint, ...photo }); break;
    // `cols` is the most across (LE15b-6): "as many as fit" alone put six three-up cards 4 + 2 on a desktop
    case "grid": node = createGrid(n.cols ?? 3, { minCard: n.min ?? "16rem", fitMost: n.cols ?? 3, ...paint, ...photo }); break;
    case "card":
      node = createContainer("column", { background: c.bg, radius: f.card.radius, ...(f.card.shadow ? { shadow: f.card.shadow } : {}), ...(f.card.border ? { borderWidth: f.card.border, borderColor: c.line } : {}), ...centre, ...(!ctx.wire && f.hover ? { hoverEffect: f.hover } : {}), ...(!ctx.wire && f.reveal ? { revealEffect: f.reveal } : {}) });
      break;
    // a photo goes wherever the tree puts it — a stack (a slider's page, the photo above quick links), not only the section
    // (measured on the review sheet: both showed their dark shade with no picture)
    default: node = createContainer("column", { ...centre, ...paint, ...photo });
  }
  node.children = (n.c ?? []).map((ch, i) => build(ch, inner, `${path}.${i}`));
  // A row of only words, buttons and links that is not spread out keeps them at their own size: in a Side by side a width-less
  // block grows into the room left (box-model's fill-and-follow), so two buttons took half the line each (measured, the review
  // sheet 2026-10-19). A block placed on the row (the Inspector's nine squares) is what stops the grow (LE4-1) — placed at the
  // start it takes `margin-right: auto`, which pushes whatever FOLLOWS it to the far end (measured: "Visit" 500px from "Apply",
  // LE15-43), so only the LAST block is placed: nothing follows it, and the row no longer grows its blocks.
  const leafy = n.k === "row" && (n.c ?? []).every((ch) => !!ch.r && ch.r !== "image");
  if (leafy && node.children.length && (n.set?.justify ?? "start") === "start") node.children = node.children.map((ch, i, all) => (i === all.length - 1 ? { ...ch, placeX: "start" as const } : ch));
  return Object.assign(node, n.set ?? {});
}

function build(n: SectionNode, ctx: Ctx, path: string): BoxNode {
  return Object.assign(n.r ? Object.assign(element(n, ctx, path), n.set ?? {}) : container(n, ctx, path), { sectionPart: path });
}

/**
 * A CENTRED stack centres its blocks the way a person does it — each block's band is set to Centre (`alignInRow`). A stack's
 * `align` never reaches them: every block of a stack sits in a row band of its own (`normalizeRowBands`), and an unset band
 * starts at the left (measured on the canvas, 2026-10-19: the hero's eyebrow, title and words all at the left edge).
 */
function centreBands(n: BoxNode): BoxNode {
  if (!n.children) return n;
  const centred = n.align === "center" && !n.rowBand;
  return { ...n, children: n.children.map((c) => centreBands(centred && c.rowBand && c.justify == null ? { ...c, justify: "center" } : c)) };
}

/**
 * LE15b-12 · NO CARD LEFT ALONE ON A LINE. "As many as fit" puts as many across as the screen holds, so three cards went two and
 * one on a tablet (seen in the HEADED screenshot at 783) and four went three and one. For each screen, wide to narrow, the most
 * across is the largest count for which EVERY count that screen's widths can give divides the cards (one a line always does);
 * a screen the layout states itself keeps its word (Stats' two by two). The widths are config/layout.json's rungs; the card's
 * least width and the gap are the layout's. ponytail: only a grid the full width of its section — one in a column has no width
 * known until the page is drawn.
 */
const RUNG = LAYOUT.rungs;
const SCROLLBAR = 17; // the classic scrollbar a desktop window gives up — a page on a phone has none, so both ends are taken
type FitRung = "base" | "wide" | "tabletLandscape" | "tabletPortrait" | "phone";
/** Each screen: its widths, and the screen whose "most across" it takes when it states none (the five-rung cascade, rule 18). */
const FIT_RUNGS: [FitRung, number, number, FitRung | null][] = [
  ["base", RUNG.desktop.from, RUNG.wide.from - 1, null],
  ["wide", RUNG.wide.from, Infinity, "base"],
  ["tabletLandscape", RUNG.tabletLandscape.from, RUNG.desktop.from - 1, "base"],
  ["tabletPortrait", RUNG.tabletPortrait.from, RUNG.tabletLandscape.from - 1, "tabletLandscape"],
  ["phone", 0, RUNG.tabletPortrait.from - 1, "tabletPortrait"],
];
function noLoneCard(grid: BoxNode, pad: number): void {
  const n = grid.children?.length ?? 0, min = parseFloat(grid.minCard ?? "") * 16, gap = grid.gapX ?? grid.gap ?? 0;
  if (n < 2 || !(min > 0)) return;
  const fit = (w: number) => (w === Infinity ? n : Math.max(1, Math.floor((w - pad + gap) / (min + gap))));
  /** every count across this screen's widths can give, with at most `m`, fills its rows */
  const whole = (m: number, lo: number, hi: number) => { for (let v = Math.min(m, lo); v <= Math.min(m, hi); v++) if (n % v) return false; return true; };
  const most: Partial<Record<FitRung, number>> = {};
  for (const [r, from, to, parent] of FIT_RUNGS) {
    const own = r === "base" ? grid.fitMost : grid.responsive?.[r]?.fitMost;
    let m = Math.min(own ?? (parent ? most[parent]! : n), n);
    while (m > 1 && !whole(m, fit(Math.max(0, from - SCROLLBAR)), fit(to))) m--;
    most[r] = m;
    if (r === "base") grid.fitMost = m;
    else grid.responsive = { ...grid.responsive, [r]: { ...grid.responsive?.[r], fitMost: m } };
  }
}

/** A section as ordinary blocks — in the builder's own banded form, the tree a person would have built — in the wireframe or a finish. */
export function buildSection(def: SectionDef, opts: { finish: string; wireframe: boolean }, keep?: Set<string>): BoxNode {
  const f = opts.wireframe ? CFG.wireframe : finishOf(opts.finish);
  const root: SectionNode = { ...def.tree, k: def.tree.k ?? "section", tone: def.tree.tone ?? "plain" };
  const built = centreBands(normalizeRowBands(build(root, { f, wire: opts.wireframe, tone: "plain", center: false, keep, cap: def.photoMaxHeight }, "0")));
  const pad = Number(root.set?.paddingLeft ?? 0) + Number(root.set?.paddingRight ?? 0);
  (root.c ?? []).forEach((c, i) => { if (c.k === "grid") { const g = byPartNode(built, `0.${i}`); if (g) noLoneCard(g, pad); } });
  return { ...built, sectionFrom: def.id, sectionFinish: opts.wireframe ? WIREFRAME : opts.finish };
}
const byPartNode = (n: BoxNode, part: string): BoxNode | undefined => (n.sectionPart === part ? n : n.children?.map((c) => byPartNode(c, part)).find(Boolean));

const byPart = (n: BoxNode, m = new Map<string, Record<string, unknown>>()) => {
  if (n.sectionPart != null) m.set(n.sectionPart, n as unknown as Record<string, unknown>);
  n.children?.forEach((c) => byPart(c, m));
  return m;
};
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/**
 * ANOTHER FINISH FOR A SECTION ALREADY ON THE PAGE (BATCH LE-15f, RF-1 — box-builder-sections.feature).
 * The layout is built afresh in the new finish and each block the section made (found by `sectionPart`, wherever the
 * person moved it) takes that block's LOOK; its CONTENT stays where the person changed it and follows the finish where
 * they did not. Blocks the person added, and look no finish ever sets on a block, are left as they are. One tree out,
 * so one commit — one Ctrl+Z.
 */
export function restyleSection(section: BoxNode, def: SectionDef, to: string): BoxNode {
  const made = (id: string, keep?: Set<string>) => byPart(buildSection(def, { finish: id === WIREFRAME ? FINISH_IDS[0] : id, wireframe: id === WIREFRAME }, keep));
  const was = made(section.sectionFinish ?? to);
  const keep = new Set<string>();
  byPart(section).forEach((n, p) => { if (n.bgImage && n.bgImage !== was.get(p)?.bgImage) keep.add(p); });
  const next = made(to, keep);
  const every = FINISH_CHOICES.map((id) => made(id));
  const apply = (n: BoxNode): BoxNode => {
    const out = { ...n, ...(n.children ? { children: n.children.map(apply) } : {}) } as unknown as Record<string, unknown>;
    const p = n.sectionPart;
    const fresh = p != null ? next.get(p) : undefined;
    if (p == null || !fresh) return out as unknown as BoxNode;
    for (const k of CFG.restyle.look) {
      if (fresh[k] !== undefined) out[k] = fresh[k];
      else if (every.some((m) => m.get(p)?.[k] !== undefined)) delete out[k];
    }
    for (const k of CFG.restyle.content) {
      if (!same(out[k], was.get(p)?.[k])) continue;
      if (fresh[k] !== undefined) out[k] = fresh[k]; else delete out[k];
    }
    return out as unknown as BoxNode;
  };
  return { ...apply(section), sectionFinish: to };
}

/**
 * Put a built section on the page (box-builder-sections.feature, "Adding a section after the one I am on").
 * A whole band straight after the band holding the selection — never inside it — or, with nothing selected, at the end
 * of the page above the footer. A header or footer REPLACES the page's own, shown on every page (PS-2 carries it).
 */
export function insertSection(root: BoxNode, selectedId: string | null, section: BoxNode, at?: number): BoxNode {
  const kids = [...(root.children ?? [])];
  const which = section.tag === "header" || section.tag === "footer" ? section.tag : null;
  let out: BoxNode;
  if (which) {
    const [s, e] = regionSpan(root, which);
    kids.splice(s, e - s, makeRowBand([{ ...section, shared: true }]));
    out = { ...root, children: kids };
  } else {
    const sel = selectedId ? kids.findIndex((k) => !!findBox(k, selectedId)) : -1;
    const [footerStart] = regionSpan(root, "footer");
    const [, headerEnd] = regionSpan(root, "header");
    // dropped (`at`): where it was let go, but never inside the header or below the footer
    const index = at != null ? Math.max(at, headerEnd) : sel >= 0 ? Math.max(sel + 1, headerEnd) : footerStart;
    kids.splice(Math.min(index, footerStart), 0, makeRowBand([section]));
    out = { ...root, children: kids };
  }
  return root.pageGrid ? markPageGrid(normalizeRowBands(out)) : out;
}
