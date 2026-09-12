/**
 * Educo UI — typography library. The font families available to the builder (all already loaded via the
 * Google Fonts <link> in app/layout.tsx, so previews render truthfully), plus the full weight ladder and
 * the rem type-scale. Pure DATA — reused by the token playground and the Theme Editor. Family = chosen
 * here; SIZE = the token scale; weight = the ladder below.
 */

export type FontCategory = "Sans" | "Serif" | "Display" | "Handwriting" | "Mono";

export interface FontFamily {
  name: string;
  /** Full CSS font stack (family + fallback). */
  stack: string;
  category: FontCategory;
}

const FALLBACK: Record<FontCategory, string> = {
  Sans: "sans-serif", Serif: "serif", Display: "sans-serif", Handwriting: "cursive", Mono: "monospace",
};

const fam = (name: string, category: FontCategory): FontFamily => ({
  // Quote only multi-word names — matches the CSS convention used by SiteTheme (e.g. "Poppins, sans-serif"
  // but "'DM Sans', sans-serif"), so a theme's stored font stack matches an option exactly.
  name, category, stack: `${name.includes(" ") ? `'${name}'` : name}, ${FALLBACK[category]}`,
});

export const FONT_CATEGORIES: FontCategory[] = ["Sans", "Serif", "Display", "Handwriting", "Mono"];

/** ~50 families, all loaded globally already. Grouped by category for the picker. */
export const FONT_FAMILIES: FontFamily[] = [
  // Sans
  fam("Inter", "Sans"), fam("Poppins", "Sans"), fam("DM Sans", "Sans"), fam("Manrope", "Sans"),
  fam("Lexend", "Sans"), fam("Montserrat", "Sans"), fam("Work Sans", "Sans"), fam("Raleway", "Sans"),
  fam("Nunito", "Sans"), fam("Rubik", "Sans"), fam("Karla", "Sans"), fam("Lato", "Sans"),
  fam("Open Sans", "Sans"), fam("PT Sans", "Sans"), fam("Source Sans 3", "Sans"), fam("Roboto", "Sans"),
  fam("Ubuntu", "Sans"), fam("Comfortaa", "Sans"), fam("Fredoka", "Sans"),
  // Serif
  fam("Playfair Display", "Serif"), fam("Merriweather", "Serif"), fam("Lora", "Serif"),
  fam("Bitter", "Serif"), fam("Cormorant Garamond", "Serif"), fam("Crimson Text", "Serif"),
  fam("EB Garamond", "Serif"), fam("Libre Baskerville", "Serif"), fam("Noto Serif", "Serif"),
  fam("PT Serif", "Serif"),
  // Display
  fam("Anton", "Display"), fam("Abril Fatface", "Display"), fam("Bebas Neue", "Display"),
  fam("Oswald", "Display"), fam("Righteous", "Display"), fam("Lobster", "Display"),
  // Handwriting
  fam("Caveat", "Handwriting"), fam("Dancing Script", "Handwriting"), fam("Pacifico", "Handwriting"),
  fam("Amatic SC", "Handwriting"), fam("Great Vibes", "Handwriting"), fam("Indie Flower", "Handwriting"),
  fam("Patrick Hand", "Handwriting"), fam("Permanent Marker", "Handwriting"), fam("Sacramento", "Handwriting"),
  fam("Satisfy", "Handwriting"), fam("Shadows Into Light", "Handwriting"),
  // Mono
  fam("JetBrains Mono", "Mono"), fam("Fira Code", "Mono"), fam("IBM Plex Mono", "Mono"),
  fam("Roboto Mono", "Mono"), fam("Source Code Pro", "Mono"), fam("Space Mono", "Mono"),
];

export interface FontWeight { name: string; value: number }
/** The full CSS weight ladder (100–900). Not every family ships every weight; the picker loads what's used. */
export const FONT_WEIGHTS: FontWeight[] = [
  { name: "Thin", value: 100 }, { name: "Extra Light", value: 200 }, { name: "Light", value: 300 },
  { name: "Regular", value: 400 }, { name: "Medium", value: 500 }, { name: "Semi Bold", value: 600 },
  { name: "Bold", value: 700 }, { name: "Extra Bold", value: 800 }, { name: "Black", value: 900 },
];

export interface LetterSpacing { name: string; em: string }
/** The letter-spacing (tracking) scale — canonical source for both the token engine and the pickers. */
export const LETTER_SPACING: LetterSpacing[] = [
  { name: "tighter", em: "-0.05em" }, { name: "tight", em: "-0.025em" }, { name: "normal", em: "0em" },
  { name: "wide", em: "0.025em" }, { name: "wider", em: "0.05em" }, { name: "widest", em: "0.1em" },
];

export interface FontSizeToken { name: string; rem: string; px: number }
/** The rem type scale (matches the token engine's `text` tokens), with px equivalents at 16px root. */
export const FONT_SIZES: FontSizeToken[] = [
  { name: "xs", rem: "0.75rem", px: 12 }, { name: "sm", rem: "0.875rem", px: 14 }, { name: "base", rem: "1rem", px: 16 },
  { name: "lg", rem: "1.125rem", px: 18 }, { name: "xl", rem: "1.25rem", px: 20 }, { name: "2xl", rem: "1.5rem", px: 24 },
  { name: "3xl", rem: "1.875rem", px: 30 }, { name: "4xl", rem: "2.25rem", px: 36 }, { name: "5xl", rem: "3rem", px: 48 },
  { name: "6xl", rem: "3.75rem", px: 60 },
];

/** Options for a family picker: value = full stack, label = family name (searchable). */
export function familyOptions(): { value: string; label: string }[] {
  return FONT_FAMILIES.map((f) => ({ value: f.stack, label: `${f.name} · ${f.category}` }));
}
