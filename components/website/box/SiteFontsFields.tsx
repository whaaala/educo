"use client";

/**
 * SITE FONTS (BATCH A-1b (4)) — the site's heading + body fonts, in Page settings. Every block without a font of its own
 * is drawn in these, on the canvas, in the Preview and in the download. Each option says which of the region's languages
 * it writes (in words, never colour alone), and the line under each field says it for the font chosen.
 * Behaviours: tests/features/components/website/box-builder-region-fonts.feature
 */
import CompactSelect from "@/components/shared/CompactSelect";
import { familyOptions, languagesLabel } from "@/lib/educo-ui/fonts";
import type { SiteFonts } from "@/lib/semantics";

export default function SiteFontsFields({ fonts, onChange }: { fonts: SiteFonts; onChange: (patch: Partial<SiteFonts>) => void }) {
  const note = "text-[0.625rem] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300";
  const field = (role: keyof SiteFonts, label: string) => (
    <div>
      <CompactSelect label={label} ariaLabel={`Site font for ${label.toLowerCase()}`} value={fonts[role]} onChange={(v) => v && onChange({ [role]: v })} options={familyOptions()} />
      <p className={`${note} mt-0.5`}>Writes {languagesLabel(fonts[role]) ?? "— not measured"}</p>
    </div>
  );
  // min-w-0: a fieldset will not shrink below its widest child by default (A1b-4, seen at 375 / 200 % text)
  return (
    <fieldset className="min-w-0 space-y-1.5">
      <legend className="text-[0.625rem] font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Site fonts</legend>
      {field("heading", "Headings")}
      {field("body", "Words")}
    </fieldset>
  );
}
