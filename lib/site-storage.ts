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
}

export interface Page {
  id: string;
  name: string;
  path: string;
  sections: Section[];
  isHome?: boolean;
}

export interface NavItem {
  pageId: string;
  label: string;
}

export interface Site {
  id: string;
  name: string;
  pages: Page[];
  theme: SiteTheme;
  nav: NavItem[];
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
    nav: [{ pageId: home.id, label: "Home" }],
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

function migrateSite(site: Site): Site {
  return {
    ...site,
    theme: { ...DEFAULT_THEME, ...(site.theme || {}) },
    pages: (site.pages || []).map((p) => ({ ...p, sections: (p.sections || []).map(migrateSection) })),
  };
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
