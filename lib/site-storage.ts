/**
 * Website-builder storage layer — persists school websites to localStorage.
 *
 * Model:  Site → Page[] → Section[]
 *
 * A **Section** is a CONTENT-DRIVEN, brand-themed block (hero, about, features, stats, gallery,
 * testimonials, CTA, contact). Each section carries structured `content` (headings, body, items,
 * images, CTAs) and a `variant`; a matching React component renders it as a modern, responsive,
 * fully brand-driven block (see `components/website/sections`). Colours ALWAYS come from the
 * site's `theme` palette — never hardcoded — so recolouring the brand cascades everywhere.
 *
 * A **Page** is a vertical stack of sections. The nav + footer are rendered automatically by the
 * SiteRenderer from the site name/nav/theme.
 *
 * Persistence is localStorage today (`siteStorage`); the CRUD surface is shaped so a hosting
 * backend can slot under it later ("publishing later").
 */

import type { SlideObject } from "./slide-storage";
export type { SlideObject } from "./slide-storage";

// ── Theme (brand palette + type) ──
// Every colour used by a rendered website comes from here. No section may hardcode a colour.

export interface SiteTheme {
  /** Primary brand colour — hero backgrounds, primary buttons, links. */
  primary: string;
  /** Accent colour — gradients, highlights, secondary emphasis. */
  accent: string;
  /** Page background. */
  background: string;
  /** Card / raised surface background. */
  surface: string;
  /** Heading + body text colour. */
  text: string;
  /** Muted / secondary text. */
  textMuted: string;
  /** Heading font family. */
  headingFont: string;
  /** Body font family. */
  bodyFont: string;
  /** Base corner radius in px. */
  radius: number;
}

export const DEFAULT_THEME: SiteTheme = {
  primary: "#4f46e5",
  accent: "#7c3aed",
  background: "#ffffff",
  surface: "#f8fafc",
  text: "#0f172a",
  textMuted: "#64748b",
  headingFont: "Poppins, sans-serif",
  bodyFont: "'DM Sans', sans-serif",
  radius: 16,
};

/**
 * Base (background/surface/text) tokens per app theme. The website's neutral base follows the
 * selected app theme so previews + canvas respect Light/Dark/Midnight/Purple — while the school's
 * BRAND tokens (primary/accent/fonts/radius) always come from the site itself.
 */
export const APP_THEME_BASE: Record<string, Pick<SiteTheme, "background" | "surface" | "text" | "textMuted">> = {
  light: { background: "#ffffff", surface: "#f8fafc", text: "#0f172a", textMuted: "#64748b" },
  dark: { background: "#0f1115", surface: "#171a21", text: "#e5e7eb", textMuted: "#94a3b8" },
  midnight: { background: "#0a0e27", surface: "#111634", text: "#e2e8f0", textMuted: "#8291bf" },
  purple: { background: "#1a0b2e", surface: "#241435", text: "#f5edff", textMuted: "#c4b5fd" },
};

/** Merge a site's brand theme with the app-theme base so the rendered site respects the app theme. */
export function resolveSiteTheme(siteTheme: SiteTheme, appThemeId: string): SiteTheme {
  return { ...siteTheme, ...(APP_THEME_BASE[appThemeId] ?? APP_THEME_BASE.light) };
}

// ── Section model ──

export type SectionType =
  | "hero"
  | "about"
  | "features"
  | "stats"
  | "gallery"
  | "testimonials"
  | "cta"
  | "contact"
  | "custom";

export interface SectionCta {
  label: string;
  href?: string;
}

export interface SectionItem {
  /** lucide-react icon name (e.g. "GraduationCap"). Rendered brand-coloured. */
  icon?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  image?: string;
  /** For stats — the big number (e.g. "1,200+"). */
  value?: string;
}

export interface SectionContent {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  body?: string;
  image?: string;
  ctaPrimary?: SectionCta;
  ctaSecondary?: SectionCta;
  items?: SectionItem[];
  align?: "left" | "center";
}

/** A block a user drops INTO a section. Blocks flow (stack) and never overlap — Lego-style. */
export type SectionBlockType = "heading" | "text" | "button" | "image";
export interface SectionBlock {
  id: string;
  type: SectionBlockType;
  text?: string;
  href?: string;
  src?: string;
  align?: "left" | "center" | "right";
}

/** Create a new flowing block for a section. */
export function createSectionBlock(type: SectionBlockType): SectionBlock {
  const id = uid("blk");
  switch (type) {
    case "heading": return { id, type, text: "New heading", align: "left" };
    case "button": return { id, type, text: "Button", href: "#", align: "left" };
    case "image": return { id, type, src: "", align: "center" };
    default: return { id, type: "text", text: "New text block — click to edit.", align: "left" };
  }
}

export interface Section {
  id: string;
  type: SectionType;
  /** Display name in the builder's section tree. */
  name: string;
  /** Layout variant within the type (e.g. hero "split" vs "centered"). */
  variant?: string;
  /** Structured, editable content. Rendered brand-themed by the section component. */
  content: SectionContent;
  hidden?: boolean;
  /** Optional freeform overlay (reserved for the "custom" section type). */
  elements?: SlideObject[];
  /** User-added flowing blocks (text/button/image) that stack inside the section. */
  blocks?: SectionBlock[];
}

export interface Page {
  id: string;
  name: string;
  path: string;
  sections: Section[];
  isHome?: boolean;
}

export type NavItemType = "page" | "link" | "dropdown";

/** A navigation menu item — a tree node. `page` links to a page, `link` is a custom URL,
 *  `dropdown` is a parent that reveals its `children` (page/link items). */
export interface NavItem {
  id: string;
  type: NavItemType;
  label: string;
  pageId?: string;   // for type "page"
  href?: string;     // for type "link"
  newTab?: boolean;
  children?: NavItem[]; // for type "dropdown"
}

export function makeNavItem(patch: Partial<NavItem> & { type: NavItemType; label: string }): NavItem {
  return { id: uid("nav"), ...patch };
}
export function pageNavItem(pageId: string, label: string): NavItem {
  return { id: uid("nav"), type: "page", label, pageId };
}

/** A freeform header element, positioned in 0–100 % of the header band. */
export type HeaderElType = "logo" | "text" | "nav" | "button";
export interface HeaderEl {
  id: string;
  type: HeaderElType;
  x: number; // % from left
  y: number; // % from top
  text?: string;
  href?: string;       // link target (custom URL) or "page:<id>" for a page
  newTab?: boolean;
  fontSize?: number;
  fontFamily?: string;
  bold?: boolean;
  color?: string;      // text colour (text/nav) or label colour (button)
  bg?: string;         // background — button fill or logo background ("transparent" allowed)
  width?: number;      // logo width (px)
  height?: number;     // logo height (px)
  gap?: number;        // nav: spacing between items (px)
  src?: string;        // logo image (data URL)
}

/** Header configuration. `layout` is the freeform, draggable header (logo, nav, text, buttons). */
export interface SiteHeader {
  logoUrl?: string;
  showCta?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  elements?: SlideObject[];
  layout?: HeaderEl[];
  height?: number; // header band height in px (default 78)
}

/** Web-safe font stacks offered across the builder (theme + per-element font pickers). */
export const FONT_CHOICES = [
  "Poppins, sans-serif",
  "'DM Sans', sans-serif",
  "Manrope, sans-serif",
  "Lexend, sans-serif",
  "Montserrat, sans-serif",
  "'Playfair Display', serif",
  "Inter, sans-serif",
];

/** The default header layout: logo (left), site name, nav (centre), CTA button (right). */
export function defaultHeaderLayout(site: Site): HeaderEl[] {
  return [
    { id: uid("hel"), type: "logo", x: 3, y: 28 },
    { id: uid("hel"), type: "text", x: 9.5, y: 32, text: site.name || "My School", fontSize: 19, bold: true, color: site.theme.text },
    { id: uid("hel"), type: "nav", x: 42, y: 34 },
    { id: uid("hel"), type: "button", x: 84, y: 26, text: site.header?.ctaLabel ?? "Apply now" },
  ];
}

export interface Site {
  id: string;
  name: string;
  pages: Page[];
  theme: SiteTheme;
  nav: NavItem[];
  header?: SiteHeader;
  createdAt: string;
  updatedAt: string;
  publishedUrl?: string;
}

// ── Section catalogue (the "add section" library) ──

export const SECTION_CATALOG: { type: SectionType; label: string; description: string; icon: string }[] = [
  { type: "hero", label: "Hero", description: "Big banner with a headline and call-to-action", icon: "Sparkles" },
  { type: "about", label: "About", description: "Introduce the school with text and an image", icon: "BookOpen" },
  { type: "features", label: "Programs", description: "Highlight programs or features in a grid", icon: "LayoutGrid" },
  { type: "stats", label: "Stats", description: "Key numbers — students, staff, results", icon: "BarChart3" },
  { type: "gallery", label: "Gallery", description: "A grid of photos", icon: "Images" },
  { type: "testimonials", label: "Testimonials", description: "Quotes from parents and students", icon: "Quote" },
  { type: "cta", label: "Call to action", description: "A prompt with a button (e.g. Apply now)", icon: "Megaphone" },
  { type: "contact", label: "Contact", description: "Address, phone, email", icon: "Mail" },
  { type: "custom", label: "Blank", description: "An empty section to build freely", icon: "Square" },
];

// ── Ids ──

let _counter = 0;
function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${(++_counter).toString(36)}`;
}

// ── Section content templates (modern default copy for a school) ──

const TEMPLATES: Record<SectionType, () => Omit<Section, "id">> = {
  hero: () => ({
    type: "hero", name: "Hero", variant: "split",
    content: {
      eyebrow: "Welcome to our school",
      heading: "Where curious minds become confident leaders",
      subheading: "A nurturing, future-ready education that helps every student discover their potential and thrive.",
      ctaPrimary: { label: "Apply now" },
      ctaSecondary: { label: "Book a tour" },
      image: "",
    },
  }),
  about: () => ({
    type: "about", name: "About Us", variant: "image-left",
    content: {
      eyebrow: "About us",
      heading: "An education built on care, curiosity and character",
      body: "Founded on a commitment to academic excellence and personal growth, we offer a supportive environment where every student is known, challenged and inspired to do their best work.",
      ctaPrimary: { label: "Our story" },
      image: "",
    },
  }),
  features: () => ({
    type: "features", name: "Programs", variant: "cards",
    content: {
      eyebrow: "What we offer",
      heading: "Programs designed for every learner",
      subheading: "From early years to graduation, our programs balance rigour with creativity.",
      align: "center",
      items: [
        { icon: "GraduationCap", title: "Academics", body: "A rich, challenging curriculum with dedicated teachers and small class sizes." },
        { icon: "FlaskConical", title: "STEM & Innovation", body: "Hands-on science, technology and design that spark real-world problem solving." },
        { icon: "Palette", title: "Arts & Culture", body: "Music, drama and visual arts that build confidence and creative expression." },
        { icon: "Trophy", title: "Sports", body: "Competitive and recreational athletics that teach teamwork and discipline." },
        { icon: "Globe2", title: "Global Outlook", body: "Languages and exchange programs that prepare students for a connected world." },
        { icon: "HeartHandshake", title: "Wellbeing", body: "Pastoral care and counselling that put every student's wellbeing first." },
      ],
    },
  }),
  stats: () => ({
    type: "stats", name: "Stats", variant: "row",
    content: {
      items: [
        { value: "1,200+", title: "Students" },
        { value: "90+", title: "Expert teachers" },
        { value: "98%", title: "Graduation rate" },
        { value: "25+", title: "Years of excellence" },
      ],
    },
  }),
  gallery: () => ({
    type: "gallery", name: "Gallery", variant: "grid",
    content: {
      eyebrow: "Campus life",
      heading: "A glimpse of life at our school",
      align: "center",
      items: [{ image: "" }, { image: "" }, { image: "" }, { image: "" }, { image: "" }, { image: "" }],
    },
  }),
  testimonials: () => ({
    type: "testimonials", name: "Testimonials", variant: "cards",
    content: {
      eyebrow: "Loved by families",
      heading: "What our community says",
      align: "center",
      items: [
        { body: "The teachers truly know my child. She's grown so much in confidence this year.", title: "Amina O.", subtitle: "Parent" },
        { body: "A place that pushes you academically but also cares about who you are as a person.", title: "David K.", subtitle: "Graduate, 2025" },
        { body: "Wonderful facilities and a warm community. We felt at home from day one.", title: "The Okafor family", subtitle: "Parents" },
      ],
    },
  }),
  cta: () => ({
    type: "cta", name: "Call to Action", variant: "gradient",
    content: {
      heading: "Ready to join our community?",
      subheading: "Admissions are open. Take the first step toward an inspiring education.",
      ctaPrimary: { label: "Start your application" },
      ctaSecondary: { label: "Contact admissions" },
    },
  }),
  contact: () => ({
    type: "contact", name: "Contact Us", variant: "split",
    content: {
      eyebrow: "Get in touch",
      heading: "We'd love to hear from you",
      body: "Have a question about admissions, programs or a campus tour? Reach out and our team will get back to you.",
      items: [
        { icon: "MapPin", title: "Visit", body: "123 School Road, Lagos, Nigeria" },
        { icon: "Phone", title: "Call", body: "+234 800 000 0000" },
        { icon: "Mail", title: "Email", body: "hello@ourschool.edu" },
      ],
    },
  }),
  custom: () => ({
    type: "custom", name: "Blank Section", variant: "blank",
    content: { heading: "New section", body: "Add your content here." },
  }),
};

// ── Factories ──

export function createSection(type: SectionType): Section {
  return { id: uid("sec"), ...TEMPLATES[type]() };
}

/** Turn a page name into a URL slug/path, e.g. "About Us" → "/about-us". */
export function slugify(name: string): string {
  const s = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return s ? `/${s}` : "/page";
}

/** Page templates offered in the "Add page" flow — each a ready arrangement of sections, with a
 *  DISTINCT hero so different pages look clearly different. */
export const PAGE_TEMPLATES: { key: string; name: string; description: string; icon: string; sections: SectionType[]; heroVariant?: string; hero?: Partial<SectionContent> }[] = [
  { key: "landing", name: "Landing", description: "Hero, programs, stats & CTA", icon: "Sparkles", sections: ["hero", "features", "stats", "cta"], heroVariant: "split",
    hero: { eyebrow: "Welcome to our school", heading: "Where curious minds become confident leaders" } },
  { key: "about", name: "About", description: "Intro, story & testimonials", icon: "BookOpen", sections: ["hero", "about", "stats", "testimonials"], heroVariant: "banner",
    hero: { eyebrow: "About us", heading: "An education built on care, curiosity & character", subheading: "Get to know our story, our people and what we stand for." } },
  { key: "programs", name: "Programs", description: "Programs grid & gallery", icon: "LayoutGrid", sections: ["hero", "features", "gallery", "cta"], heroVariant: "centered",
    hero: { eyebrow: "What we offer", heading: "Programs designed for every learner", subheading: "From early years to graduation — academics, arts, sports and more." } },
  { key: "gallery", name: "Gallery", description: "Photo gallery & call-to-action", icon: "Images", sections: ["hero", "gallery", "cta"], heroVariant: "centered",
    hero: { eyebrow: "Campus life", heading: "A glimpse of life at our school", subheading: "Moments from classrooms, events and everything in between." } },
  { key: "contact", name: "Contact", description: "Contact details & a form", icon: "Mail", sections: ["hero", "contact"], heroVariant: "image-left",
    hero: { eyebrow: "Get in touch", heading: "We'd love to hear from you", subheading: "Questions about admissions, programs or a tour? Reach out." } },
  { key: "blank", name: "Blank", description: "Start from scratch", icon: "Square", sections: [] },
];

export function createPageFromTemplate(name: string, path: string, templateKey: string, opts: { isHome?: boolean } = {}): Page {
  const tpl = PAGE_TEMPLATES.find((t) => t.key === templateKey) ?? PAGE_TEMPLATES[0];
  const page = createPage(name, path, { isHome: opts.isHome });
  page.sections = tpl.sections.map((t) => createSection(t));
  const hero = page.sections.find((s) => s.type === "hero");
  if (hero) {
    if (tpl.heroVariant) hero.variant = tpl.heroVariant;
    if (tpl.hero) hero.content = { ...hero.content, ...tpl.hero };
  }
  return page;
}

export function createPage(name: string, path: string, opts: { isHome?: boolean; withHero?: boolean } = {}): Page {
  return {
    id: uid("page"),
    name,
    path,
    isHome: opts.isHome,
    sections: opts.withHero ? [createSection("hero")] : [],
  };
}

/** Starting-point templates offered in the "create / first-run" flows. Each uses a distinct hero
 *  layout so their previews look genuinely different. */
export const SITE_TEMPLATES: { key: string; name: string; description: string; sections: SectionType[]; heroVariant: string }[] = [
  { key: "classic", name: "Classic", description: "Hero · Programs · Stats · Call-to-action", sections: ["hero", "features", "stats", "cta"], heroVariant: "split" },
  { key: "showcase", name: "Showcase", description: "Gallery-led with testimonials", sections: ["hero", "gallery", "testimonials", "cta"], heroVariant: "centered" },
  { key: "welcome", name: "Welcome", description: "Warm intro with about & contact", sections: ["hero", "about", "features", "contact"], heroVariant: "banner" },
  { key: "blank", name: "Blank", description: "A single empty page to build freely", sections: [], heroVariant: "split" },
];

export function createSiteFromTemplate(name: string, templateKey: string, themeOverride?: Partial<SiteTheme>): Site {
  const tpl = SITE_TEMPLATES.find((t) => t.key === templateKey) ?? SITE_TEMPLATES[0];
  const home = createPage("Home", "/", { isHome: true });
  home.sections = tpl.sections.map((t) => createSection(t));
  // Give the hero the template's distinct layout variant.
  const hero = home.sections.find((s) => s.type === "hero");
  if (hero) hero.variant = tpl.heroVariant;
  const now = new Date().toISOString();
  return {
    id: uid("site"),
    name,
    pages: [home],
    theme: { ...DEFAULT_THEME, ...themeOverride },
    nav: [pageNavItem(home.id, "Home")],
    createdAt: now,
    updatedAt: now,
  };
}

export function createSite(name: string, themeOverride?: Partial<SiteTheme>): Site {
  return createSiteFromTemplate(name, "classic", themeOverride);
}


// ── Persistence (localStorage) ──

const STORAGE_KEY = "educo_sites";

// ── Migration ──
// Sites created under the earlier (freeform SlideObject) model have sections without `content`.
// Upgrade any such section to the modern content model so old sites keep working after the pivot.
const VALID_TYPES: SectionType[] = ["hero", "about", "features", "stats", "gallery", "testimonials", "cta", "contact", "custom"];
const TYPE_MIGRATION: Record<string, SectionType> = { staff: "features", news: "testimonials" };

function migrateSection(s: Partial<Section> & { type?: string }): Section {
  if (s && s.content && typeof s.content === "object") return s as Section;
  const raw = s?.type ?? "custom";
  const type: SectionType = VALID_TYPES.includes(raw as SectionType)
    ? (raw as SectionType)
    : (TYPE_MIGRATION[raw] ?? "custom");
  const fresh = createSection(type);
  return { ...fresh, id: s?.id || fresh.id, name: s?.name || fresh.name, hidden: s?.hidden };
}

// Old nav entries were flat { pageId, label }; upgrade them to typed NavItem tree nodes.
function migrateNavItem(n: Partial<NavItem> & { pageId?: string; label?: string }): NavItem {
  if (n && n.type) return { ...(n as NavItem), children: n.children?.map(migrateNavItem) };
  return { id: n?.id || uid("nav"), type: "page", label: n?.label ?? "", pageId: n?.pageId };
}

function migrateSite(site: Site): Site {
  const migrated: Site = {
    ...site,
    theme: { ...DEFAULT_THEME, ...(site.theme || {}) },
    nav: (site.nav || []).map(migrateNavItem),
    header: site.header ?? {},
    pages: (site.pages || []).map((p) => ({ ...p, sections: (p.sections || []).map(migrateSection) })),
  };
  if (!migrated.header!.layout || migrated.header!.layout.length === 0) {
    migrated.header = { ...migrated.header, layout: defaultHeaderLayout(migrated) };
  }
  return migrated;
}

function readAll(): Site[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Site[]).map(migrateSite) : [];
  } catch {
    return [];
  }
}

function writeAll(sites: Site[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
  } catch {
    /* quota / serialization errors are non-fatal in the builder */
  }
}

export const siteStorage = {
  list(): Site[] {
    return readAll().sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  },
  get(id: string): Site | null {
    return readAll().find((s) => s.id === id) ?? null;
  },
  create(name: string, themeOverride?: Partial<SiteTheme>): Site {
    const site = createSite(name, themeOverride);
    writeAll([site, ...readAll()]);
    return site;
  },
  createFromTemplate(name: string, templateKey: string, themeOverride?: Partial<SiteTheme>): Site {
    const site = createSiteFromTemplate(name, templateKey, themeOverride);
    writeAll([site, ...readAll()]);
    return site;
  },
  save(site: Site): Site {
    const next = { ...site, updatedAt: new Date().toISOString() };
    const all = readAll();
    const i = all.findIndex((s) => s.id === site.id);
    if (i === -1) all.unshift(next);
    else all[i] = next;
    writeAll(all);
    return next;
  },
  remove(id: string): void {
    writeAll(readAll().filter((s) => s.id !== id));
  },
  getOrCreateDefault(name = "My School"): Site {
    const all = readAll();
    if (all.length > 0) return all[0];
    return this.create(name);
  },
};
