import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FONT_FAMILIES, REGION_LANGUAGES, familyOf, regionLanguages, missingLetters, languagesLabel, familyOptions } from "@/lib/educo-ui/fonts";
import coverage from "@/lib/educo-ui/font-coverage.json";

/** BATCH A-1b (2) — which languages a font writes comes from the MEASURED data, and is said in words. */
describe("font coverage (A-1b)", () => {
  it("every family in the picker was measured — a family added later fails here until a1-font-coverage.js is re-run", () => {
    const writes: Record<string, string[]> = coverage.writes;
    expect(FONT_FAMILIES.filter((f) => !writes[f.name]).map((f) => f.name)).toEqual([]);
  });

  it("the eight families that write all four region languages — Libre Baskerville included, though it lacks Vietnamese (A1b-3: a Vietnamese test once wrongly dropped it)", () => {
    const all = FONT_FAMILIES.filter((f) => regionLanguages(f.stack)?.length === REGION_LANGUAGES.length).map((f) => f.name);
    expect(all).toEqual(["Inter", "Montserrat", "Merriweather", "EB Garamond", "Libre Baskerville", "Noto Serif", "Anton", "Great Vibes"]);
    // BDD1-7: the measured data says Libre Baskerville has no Vietnamese — so it is in the eight only because
    // Vietnamese is not one of the region's four (the A1b-3 bug was counting it in).
    expect(coverage.writes["Libre Baskerville" as keyof typeof coverage.writes]).not.toContain("Vietnamese");
    expect(REGION_LANGUAGES).not.toContain("Vietnamese");
  });

  // A1b-5: Inter was in the picker but not in the editor's Google Fonts link, so the canvas drew "Inter" from some other copy
  // without ẹ ọ ṣ ɓ ɗ ƙ ɛ ɔ ŋ while the download shipped Google's — canvas ≠ Preview for the new default body font
  it("every family in the picker is loaded in the editor, so the canvas draws the same font the download ships", () => {
    const layout = readFileSync(join(__dirname, "../../app/layout.tsx"), "utf8").replace(/\r\n/g, "\n");
    const href = /href="(https:\/\/fonts\.googleapis\.com[^"]+)"/.exec(layout)?.[1] ?? "";
    const loaded = [...href.matchAll(/family=([^:&]+)/g)].map((m) => m[1].replace(/\+/g, " "));
    expect(FONT_FAMILIES.map((f) => f.name).filter((n) => !loaded.includes(n))).toEqual([]);
  });

  it("reads the family out of a stack, quoted or not", () => {
    expect(familyOf("'DM Sans', sans-serif")).toBe("DM Sans");
    expect(familyOf("Inter, sans-serif")).toBe("Inter");
  });

  it("names the letters a font lacks, once each, and none it has", () => {
    expect(missingLetters("Ẹ ṣé o, ẹ ṣé", "Poppins, sans-serif")).toEqual(["Ẹ", "ṣ", "ẹ"]);
    expect(missingLetters("Ẹ ṣé o", "Inter, sans-serif")).toEqual([]);
    expect(missingLetters("Ɓarka, Ụlọ", "'Lora', serif")).toEqual(["Ɓ"]); // Lora writes Yoruba + Igbo, not Hausa
    expect(missingLetters("Good morning", "Poppins, sans-serif")).toEqual([]);
    expect(missingLetters("Ẹ ṣé", "'Some Font', serif")).toEqual([]); // never measured → no claim
  });

  it("says it in words in every picker option, not by colour", () => {
    expect(languagesLabel("Montserrat, sans-serif")).toBe("Yoruba · Igbo · Hausa · Twi / Ga / Ewe");
    expect(languagesLabel("Lora, serif")).toBe("Yoruba · Igbo only");
    expect(languagesLabel("Poppins, sans-serif")).toBe("none of Yoruba, Igbo, Hausa, Twi");
    // the name stays the label (a picker finds "Montserrat ·"); the languages are the option's second line
    expect(familyOptions().filter((o) => !/^\S.* · (Sans|Serif|Display|Handwriting|Mono)$/.test(o.label) || !/^Writes (Yoruba · Igbo · Hausa · Twi \/ Ga \/ Ewe|.+ only|none of Yoruba, Igbo, Hausa, Twi)$/.test(o.hint))).toEqual([]);
  });
});
