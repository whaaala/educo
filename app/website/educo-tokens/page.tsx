"use client";

/**
 * Educo UI — token preview & playground. A VISUAL test bench for Phase 0.1 (the token engine):
 * it feeds a live-editable SiteTheme through `tokensFromTheme` and paints every token — the
 * primary/accent/neutral 50–950 ramps, semantic roles, the rem type scale in the theme fonts,
 * a WCAG contrast report, spacing/radius/shadow samples, and the generated `--eu-*` CSS.
 * Type any brand colour and the whole system regenerates instantly. No editor risk — read-only demo.
 *
 * Chrome is built entirely from shared components (FormSection / ColorField / FormDropdown / Slider /
 * Button); every colour shown is DATA from the token engine (`tokens.color.*`) — no hardcoded chrome colours.
 */

import { useMemo, useState, useEffect, useCallback } from "react";
import { Copy, Check, RotateCcw, Palette, Type as TypeIcon, Contrast, SlidersHorizontal, Code2 } from "lucide-react";
import { DEFAULT_THEME, type SiteTheme } from "@/lib/site-storage";
import { tokensFromTheme, tokensToCss } from "@/lib/educo-ui/tokens";
import { SHADES, contrastRatio, rampFromHex, type Shade } from "@/lib/educo-ui/color";
import { PALETTES, PALETTE_CATEGORIES, palettesByCategory, SPECTRUM } from "@/lib/educo-ui/palettes";
import { familyOptions, FONT_WEIGHTS, FONT_SIZES, LETTER_SPACING } from "@/lib/educo-ui/fonts";
import SearchableDropdown from "@/components/shared/SearchableDropdown";
import PageLoader from "@/components/shared/PageLoader";
import FormSection from "@/components/shared/FormSection";
import FormDropdown from "@/components/shared/FormDropdown";
import ColorField from "@/components/shared/ColorField";
import Slider from "@/components/shared/Slider";
import Button from "@/components/shared/Button";

/** Readable ink for a swatch: whichever of black/white has more contrast against it (algorithmic, not chrome). */
const inkOn = (bg: string) => (contrastRatio("#ffffff", bg) >= contrastRatio("#000000", bg) ? "#ffffff" : "#000000");

const familyOpts = familyOptions();
const weightOpts = FONT_WEIGHTS.map((w) => ({ value: String(w.value), label: `${w.name} · ${w.value}` }));
const trackingOpts = LETTER_SPACING.map((l) => ({ value: l.em, label: `${l.name} · ${l.em}` }));

// ── token-driven presentational helpers (all colours come from `tokens`) ──────
function RampRow({ label, ramp }: { label: string; ramp: Record<Shade, string> }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300 midnight:text-slate-300 purple:text-purple-200">{label}</span>
        <span className="font-mono text-[0.625rem] text-gray-400 dark:text-gray-500 midnight:text-slate-500 purple:text-purple-300/70">{SHADES.length} shades · hover for hex</span>
      </div>
      <div className="flex overflow-hidden rounded-lg">
        {SHADES.map((s) => (
          <div key={s} className="min-w-0 flex-1 py-3 text-center text-[0.5rem] font-semibold leading-none tabular-nums" style={{ background: ramp[s], color: inkOn(ramp[s]) }} title={`${label} ${s} — ${ramp[s]}`}>
            <span className="block truncate px-px">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContrastRow({ name, fg, bg, pass, warn, fail }: { name: string; fg: string; bg: string; pass: string; warn: string; fail: string }) {
  const r = contrastRatio(fg, bg);
  const grade = r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA Large" : "Fail";
  const badge = r >= 4.5 ? pass : r >= 3 ? warn : fail;
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-2" style={{ background: bg }}>
      <span className="truncate text-sm font-medium" style={{ color: fg }}>{name}</span>
      <span className="flex shrink-0 items-center gap-2">
        <span className="font-mono text-xs tabular-nums" style={{ color: fg }}>{r.toFixed(2)}:1</span>
        <span className="rounded-md px-2 py-0.5 text-[0.6875rem] font-bold" style={{ background: badge, color: inkOn(badge) }}>{grade}</span>
      </span>
    </div>
  );
}

export default function EducoTokensPage() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<SiteTheme>(DEFAULT_THEME);
  const [headingWeight, setHeadingWeight] = useState(700);
  const [headingTracking, setHeadingTracking] = useState("0em");
  const [copied, setCopied] = useState(false);

  useEffect(() => setMounted(true), []);

  const tokens = useMemo(() => tokensFromTheme(theme), [theme]);
  const css = useMemo(() => tokensToCss(tokens), [tokens]);
  const byCat = useMemo(() => palettesByCategory(), []);

  const patch = useCallback((p: Partial<SiteTheme>) => setTheme((t) => ({ ...t, ...p })), []);
  const copyCss = useCallback(async () => {
    try { await navigator.clipboard.writeText(css); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard blocked */ }
  }, [css]);

  if (!mounted) return <PageLoader isLoading />;

  const colorFields: { key: keyof SiteTheme; label: string; contrastAgainst?: keyof SiteTheme }[] = [
    { key: "primary", label: "Primary" }, { key: "accent", label: "Accent" },
    { key: "background", label: "Background" }, { key: "surface", label: "Surface" },
    { key: "text", label: "Text", contrastAgainst: "background" },
    { key: "textMuted", label: "Muted text", contrastAgainst: "background" },
  ];
  const typeSizes: [string, string][] = [["6xl", "Aa"], ["4xl", "Heading"], ["2xl", "Subhead"], ["xl", "Lead"], ["base", "Body text — the quick brown fox jumps over the lazy dog."], ["sm", "Small / caption"]];
  const { success, warning, danger, info } = tokens.color;

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Educo UI — Token Playground</h1>
          <p className="mt-1 text-sm text-muted">
            Phase 0.1 · edit any brand colour and watch the whole token system regenerate. Everything below is computed live by <code className="rounded bg-surface-2 px-1 py-0.5 text-xs">tokensFromTheme()</code>.
          </p>
        </header>

        {/* Brand controls — all shared components */}
        <FormSection title="Brand controls" description="Pick a palette, or edit any role by hand." icon={Palette} collapsible={false} className="mb-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 midnight:text-slate-400 purple:text-purple-300">{PALETTES.length} palettes</span>
            <Button variant="ghost" size="sm" onClick={() => setTheme(DEFAULT_THEME)} icon={<RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />}>Reset</Button>
          </div>
          <div className="mb-4 max-h-64 space-y-3 overflow-y-auto rounded-lg border border-gray-200 p-3 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
            {PALETTE_CATEGORIES.map((cat) => (
              <div key={cat}>
                <div className="mb-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 midnight:text-slate-400 purple:text-purple-300">{cat}</div>
                <div className="flex flex-wrap gap-2">
                  {byCat[cat].map((p) => (
                    <Button key={p.name} variant="outline" size="sm" onClick={() => patch(p.patch)}
                      icon={<span className="inline-block h-3 w-3 rounded-full ring-1 ring-black/10 dark:ring-white/20" style={{ background: `linear-gradient(135deg, ${p.patch.primary} 0 50%, ${p.patch.accent} 50% 100%)` }} aria-hidden="true" />}>
                      {p.name}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {colorFields.map(({ key, label, contrastAgainst }) => (
              <ColorField key={key} label={label} value={theme[key] as string} onChange={(hex) => patch({ [key]: hex } as Partial<SiteTheme>)} contrastBg={contrastAgainst ? (theme[contrastAgainst] as string) : undefined} />
            ))}
          </div>
          <div className="mt-3">
            <Slider label="Corner radius" value={theme.radius} onChange={(v) => patch({ radius: v })} min={0} max={64} unit="px" />
          </div>
        </FormSection>

        {/* Typography — big searchable family list + full weight ladder + size scale */}
        <FormSection title="Typography" description={`${familyOpts.length} fonts · weights 100–900 · full size scale.`} icon={TypeIcon} iconColor="green" collapsible={false} className="mb-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SearchableDropdown label="Heading font" value={theme.headingFont} onChange={(v) => patch({ headingFont: v })} options={familyOpts} placeholder="Search fonts…" />
            <SearchableDropdown label="Body font" value={theme.bodyFont} onChange={(v) => patch({ bodyFont: v })} options={familyOpts} placeholder="Search fonts…" />
            <FormDropdown label="Heading weight" icon={<TypeIcon className="h-full w-full" aria-hidden="true" />} value={String(headingWeight)} onChange={(v) => setHeadingWeight(Number(v))} options={weightOpts} />
            <FormDropdown label="Heading letter spacing" icon={<TypeIcon className="h-full w-full" aria-hidden="true" />} value={headingTracking} onChange={setHeadingTracking} options={trackingOpts} />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 midnight:text-slate-300 purple:text-purple-200">Font size scale <span className="font-normal text-gray-400 dark:text-gray-500 midnight:text-slate-500 purple:text-purple-300/70">(rem — scales with the user)</span></div>
              <div className="flex flex-wrap gap-2">
                {FONT_SIZES.map((s) => (
                  <span key={s.name} className="inline-flex items-baseline gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 dark:border-gray-700 dark:bg-[#1a1d24] midnight:border-cyan-500/20 midnight:bg-[#0f1428] purple:border-pink-500/20 purple:bg-purple-900/30" title={`${s.name} — ${s.rem} (≈ ${s.px}px at the default 16px base)`}>
                    <span className="font-mono text-[0.6875rem] font-semibold text-gray-700 dark:text-gray-200 midnight:text-slate-200 purple:text-purple-100">{s.name}</span>
                    <span className="font-mono text-[0.625rem] text-gray-500 dark:text-gray-400 midnight:text-slate-400 purple:text-purple-200/80">{s.rem}</span>
                    <span className="font-mono text-[0.5625rem] text-gray-400 dark:text-gray-500 midnight:text-slate-500 purple:text-purple-300/60">≈{s.px}px</span>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 midnight:text-slate-300 purple:text-purple-200">Letter spacing scale</div>
              <div className="flex flex-wrap gap-2">
                {LETTER_SPACING.map((l) => (
                  <span key={l.name} className="inline-flex items-baseline gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 dark:border-gray-700 dark:bg-[#1a1d24] midnight:border-cyan-500/20 midnight:bg-[#0f1428] purple:border-pink-500/20 purple:bg-purple-900/30">
                    <span className="font-mono text-[0.6875rem] font-semibold text-gray-700 dark:text-gray-200 midnight:text-slate-200 purple:text-purple-100">{l.name}</span>
                    <span className="font-mono text-[0.625rem] text-gray-400 dark:text-gray-500 midnight:text-slate-500 purple:text-purple-300/70">{l.em}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </FormSection>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Ramps */}
          <FormSection title={`Colour ramps (25 → 1000 · ${SHADES.length} steps)`} description="Auto-generated in OKLCH from one seed, output as hex. Neutral is brand-tinted." icon={Palette} iconColor="purple" collapsible={false}>
            <div className="space-y-3">
              <RampRow label="Primary" ramp={tokens.color.primary} />
              <RampRow label="Accent" ramp={tokens.color.accent} />
              <RampRow label="Neutral" ramp={tokens.color.neutral} />
            </div>
            <div className="mt-4 space-y-3">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-300 midnight:text-slate-300 purple:text-purple-200">Status ramps</div>
              <RampRow label="Success" ramp={rampFromHex(success)} />
              <RampRow label="Warning" ramp={rampFromHex(warning)} />
              <RampRow label="Danger" ramp={rampFromHex(danger)} />
              <RampRow label="Info" ramp={rampFromHex(info)} />
            </div>
          </FormSection>

          {/* Type + surface */}
          <FormSection title="Type scale & surface" description="Rendered on the theme's own background/surface, in its fonts." icon={TypeIcon} iconColor="green" collapsible={false}>
            <div className="rounded-xl p-5" style={{ background: tokens.color.bg, color: tokens.color.text, borderRadius: tokens.radius.lg }}>
              <div className="p-4" style={{ background: tokens.color.surface, border: `1px solid ${tokens.color.border}`, borderRadius: tokens.radius.md }}>
                {typeSizes.map(([size, sample]) => (
                  <p key={size} className="mb-1 truncate" style={{ fontFamily: size === "base" || size === "sm" ? tokens.font.body : tokens.font.heading, fontSize: tokens.text[size], fontWeight: size === "base" || size === "sm" ? 400 : headingWeight, letterSpacing: size === "base" || size === "sm" ? undefined : headingTracking, lineHeight: 1.2, color: size === "sm" ? tokens.color.muted : tokens.color.text }}>
                    {sample}
                  </p>
                ))}
                <button className="mt-3 rounded-lg px-4 py-2 text-sm font-semibold" style={{ background: tokens.color.brand, color: tokens.color.onBrand, borderRadius: tokens.radius.md }}>Primary button</button>
              </div>
            </div>
          </FormSection>

          {/* Contrast */}
          <FormSection title="WCAG contrast report" description="AA needs ≥ 4.5:1 (body) / 3:1 (large). Our theme editor will enforce this." icon={Contrast} iconColor="orange" collapsible={false}>
            <div className="space-y-2">
              <ContrastRow name="Text on background" fg={tokens.color.text} bg={tokens.color.bg} pass={success} warn={warning} fail={danger} />
              <ContrastRow name="Muted text on background" fg={tokens.color.muted} bg={tokens.color.bg} pass={success} warn={warning} fail={danger} />
              <ContrastRow name="Text on surface" fg={tokens.color.text} bg={tokens.color.surface} pass={success} warn={warning} fail={danger} />
              <ContrastRow name="Button label on brand" fg={tokens.color.onBrand} bg={tokens.color.brand} pass={success} warn={warning} fail={danger} />
              <ContrastRow name="Primary-600 on background" fg={tokens.color.primary[600]} bg={tokens.color.bg} pass={success} warn={warning} fail={danger} />
            </div>
          </FormSection>

          {/* Spacing / radius / shadow */}
          <FormSection title="Spacing · radius · shadow" icon={SlidersHorizontal} iconColor="gray" collapsible={false}>
            <div className="mb-4">
              <div className="mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 midnight:text-slate-300 purple:text-purple-200">Spacing scale</div>
              <div className="flex items-end gap-1">
                {Object.entries(tokens.space).slice(1).map(([k, v]) => (
                  <div key={k} className="flex flex-col items-center gap-1">
                    <div style={{ width: v, height: v, background: tokens.color.primary[500], borderRadius: 3 }} />
                    <span className="text-[0.5625rem] text-gray-400 dark:text-gray-500 midnight:text-slate-500 purple:text-purple-300/70">{k}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 midnight:text-slate-300 purple:text-purple-200">Radius</div>
                <div className="flex gap-2">
                  {Object.entries(tokens.radius).filter(([k]) => k !== "full").map(([k, v]) => (
                    <div key={k} className="flex flex-1 flex-col items-center gap-1">
                      <div className="h-10 w-full" style={{ background: tokens.color.primary[200], borderRadius: v }} />
                      <span className="text-[0.5625rem] text-gray-400 dark:text-gray-500 midnight:text-slate-500 purple:text-purple-300/70">{k}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 midnight:text-slate-300 purple:text-purple-200">Shadow</div>
                <div className="flex gap-2 py-1">
                  {Object.entries(tokens.shadow).map(([k, v]) => (
                    <div key={k} className="flex flex-1 flex-col items-center gap-1">
                      <div className="h-10 w-full rounded-lg" style={{ background: tokens.color.surface, boxShadow: v }} />
                      <span className="text-[0.5625rem] text-gray-400 dark:text-gray-500 midnight:text-slate-500 purple:text-purple-300/70">{k}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FormSection>
        </div>

        {/* Full spectrum — 22 hue ramps, all generated by the same engine */}
        <FormSection title={`Full colour spectrum · ${SPECTRUM.length} ramps`} description={`Every hue run through the same OKLCH engine — a reference palette (${SPECTRUM.length} × ${SHADES.length} = ${SPECTRUM.length * SHADES.length} shades).`} icon={Palette} iconColor="purple" collapsible defaultExpanded className="mt-5">
          <div className="space-y-3">
            {SPECTRUM.map((s) => <RampRow key={s.name} label={s.name} ramp={rampFromHex(s.hex)} />)}
          </div>
        </FormSection>

        {/* Generated CSS */}
        <FormSection title="Generated CSS variables" icon={Code2} iconColor="blue" collapsible defaultExpanded className="mt-5">
          <div className="relative">
            <span className="absolute right-2 top-2 z-10">
              <Button variant="secondary" size="sm" onClick={copyCss} icon={copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}>
                {copied ? "Copied" : "Copy"}
              </Button>
            </span>
            <pre className="max-h-72 overflow-auto rounded-xl bg-gray-900 p-4 text-[0.6875rem] leading-relaxed text-gray-100 dark:bg-black/40 dark:text-gray-200 midnight:bg-[#060919] midnight:text-cyan-100 purple:bg-[#120720] purple:text-purple-100"><code>{css.replace(/;/g, ";\n").replace(/\{/g, " {\n")}</code></pre>
          </div>
        </FormSection>

        <div className="h-8" />
      </div>
    </div>
  );
}
