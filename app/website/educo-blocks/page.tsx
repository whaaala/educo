"use client";

/**
 * Educo UI — Blocks gallery. A LIVE test surface for the Phase 1 builder blocks. Each block is rendered
 * inside an isolated `.eu-demo-root` with a chosen theme's tokens + the Educo UI component stylesheet, so
 * you can SEE and INTERACT with every block, switch themes, and drag the width to test responsiveness —
 * exactly how each block will look in the builder's output. New blocks land here as they're built.
 */

import { useMemo, useState, useEffect } from "react";
import { Smartphone, Tablet, Monitor } from "lucide-react";
import { COMPONENT_CSS } from "@/lib/educo-ui/components";
import { tokensFromTheme, tokensToCss } from "@/lib/educo-ui/tokens";
import { ACCORDION_DESIGNS, ACCORDION_DESIGN_COUNT } from "@/lib/educo-ui/accordions";
import { DEFAULT_THEME, type SiteTheme } from "@/lib/site-storage";
import { PALETTES } from "@/lib/educo-ui/palettes";
import PageLoader from "@/components/shared/PageLoader";
import Button from "@/components/shared/Button";

const THEMES: { name: string; theme: SiteTheme }[] = [
  { name: "Default", theme: DEFAULT_THEME },
  ...["Emerald", "Rose", "Slate Night", "Ocean", "Charcoal"].map((n) => {
    const p = PALETTES.find((x) => x.name === n)!;
    return { name: n, theme: { ...DEFAULT_THEME, ...p.patch } as SiteTheme };
  }),
];

const WIDTHS = [
  { id: "mobile", label: "375", Icon: Smartphone, w: 375 },
  { id: "tablet", label: "768", Icon: Tablet, w: 768 },
  { id: "full", label: "Full", Icon: Monitor, w: null as number | null },
];

/** One demo block with a heading, so the gallery reads as a checklist of what's built. */
function Block({ title, status = "done", children }: { title: string; status?: "done" | "soon"; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "var(--eu-space-10)" }}>
      <h3 style={{ fontFamily: "var(--eu-font-heading)", fontSize: "var(--eu-text-sm)", textTransform: "uppercase", letterSpacing: "var(--eu-tracking-wide)", color: "var(--eu-color-muted)", marginBottom: "var(--eu-space-3)", display: "flex", alignItems: "center", gap: "var(--eu-space-2)" }}>
        {title}
        {status === "soon" && <span style={{ fontFamily: "var(--eu-font-mono)", fontSize: "0.6rem", background: "var(--eu-color-surface-2)", color: "var(--eu-color-muted)", padding: "2px 6px", borderRadius: "999px" }}>soon</span>}
      </h3>
      {children}
    </section>
  );
}

/** Tabs need a tiny toggle (the export injects the vanilla equivalent). */
function TabsDemo() {
  const [active, setActive] = useState(0);
  const tabs = ["Overview", "Features", "Pricing"];
  return (
    <div>
      <div className="eu-tabs__list" role="tablist">
        {tabs.map((t, i) => (
          <button key={t} className="eu-tab" role="tab" aria-selected={i === active} onClick={() => setActive(i)}>{t}</button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t} className="eu-tabs__panel" role="tabpanel" hidden={i !== active}>
          <p style={{ color: "var(--eu-color-muted)" }}>The <strong style={{ color: "var(--eu-color-text)" }}>{t}</strong> panel. Tabs switch on click; the exported site gets a tiny vanilla script that does the same via <code>aria-selected</code> + <code>[hidden]</code>.</p>
        </div>
      ))}
    </div>
  );
}

export default function EducoBlocksPage() {
  const [mounted, setMounted] = useState(false);
  const [themeIdx, setThemeIdx] = useState(0);
  const [width, setWidth] = useState("full");
  const [accVariant, setAccVariant] = useState("");
  useEffect(() => setMounted(true), []);

  // Grouped by design family (shared with the builder inspector) so near-duplicates cluster and the
  // genuinely-distinct designs stand out.
  const ACC_GROUPS = ACCORDION_DESIGNS;
  const ACC_COUNT = ACCORDION_DESIGN_COUNT;

  const theme = THEMES[themeIdx].theme;
  const tokens = useMemo(() => tokensFromTheme(theme), [theme]);
  // Scope BOTH the tokens and the component styles to `.eu-demo-root` so nothing leaks into app chrome.
  const scopedCss = useMemo(
    () => `${tokensToCss(tokens, ".eu-demo-root")}\n${COMPONENT_CSS.replaceAll(".eu-root", ".eu-demo-root")}`,
    [tokens],
  );
  const frameW = WIDTHS.find((w) => w.id === width)!.w;

  if (!mounted) return <PageLoader isLoading />;

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <style dangerouslySetInnerHTML={{ __html: scopedCss }} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight">Educo UI — Blocks gallery</h1>
          <p className="mt-1 text-sm text-muted">Live, interactive test surface for the Phase 1 blocks. Switch theme, drag the width — this is exactly how each block renders in the builder&apos;s output.</p>
        </header>

        {/* Controls */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {THEMES.map((t, i) => (
              <Button key={t.name} variant={i === themeIdx ? "primary" : "outline"} size="sm" onClick={() => setThemeIdx(i)}
                icon={<span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: t.theme.primary }} aria-hidden="true" />}>
                {t.name}
              </Button>
            ))}
          </div>
          <div className="ml-auto flex items-center rounded-lg border border-line p-0.5" role="group" aria-label="Preview width">
            {WIDTHS.map((w) => (
              <button key={w.id} onClick={() => setWidth(w.id)} aria-pressed={width === w.id} aria-label={`${w.label} width`}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ${width === w.id ? "bg-brand text-brand-fg" : "text-muted hover:bg-surface-2"}`}>
                <w.Icon className="h-3.5 w-3.5" aria-hidden="true" />{w.label}
              </button>
            ))}
          </div>
        </div>

        {/* The isolated demo canvas — themed tokens + Educo UI components, container-query aware */}
        <div className="rounded-xl border border-line bg-surface-2 p-4 sm:p-6 overflow-x-auto">
          <div className="eu-demo-root eu-container-ctx mx-auto" style={{ width: frameW ?? "100%", maxWidth: frameW ? undefined : "100%", background: "var(--eu-color-bg)", color: "var(--eu-color-text)", fontFamily: "var(--eu-font-body)", borderRadius: "var(--eu-radius-lg)", padding: "var(--eu-space-6)", transition: "width .2s ease" }}>

            <Block title="Navbar">
              <nav className="eu-navbar" style={{ borderRadius: "var(--eu-radius-md)" }}>
                <span className="eu-navbar__brand">Acme</span>
                <div className="eu-navbar__links">
                  <a className="eu-navbar__link" aria-current="page" href="#0">Home</a>
                  <a className="eu-navbar__link" href="#0">Products</a>
                  <a className="eu-navbar__link" href="#0">About</a>
                  <a className="eu-navbar__link" href="#0">Contact</a>
                </div>
              </nav>
            </Block>

            <Block title="Buttons">
              <div className="eu-cluster">
                <button className="eu-btn eu-btn--primary">Primary</button>
                <button className="eu-btn eu-btn--secondary">Secondary</button>
                <button className="eu-btn eu-btn--outline">Outline</button>
                <button className="eu-btn eu-btn--ghost">Ghost</button>
                <button className="eu-btn eu-btn--danger">Danger</button>
                <button className="eu-btn eu-btn--primary eu-btn--sm">Small</button>
                <button className="eu-btn eu-btn--primary eu-btn--lg">Large</button>
              </div>
            </Block>

            <Block title="Card">
              <div className="eu-card" style={{ maxWidth: "22rem" }}>
                <div className="eu-card__title">Card title</div>
                <p className="eu-muted">A flat, token-driven surface with a hairline border and subtle shadow — the Gutenberg-clean look.</p>
                <button className="eu-btn eu-btn--primary eu-btn--sm" style={{ marginTop: "var(--eu-space-4)" }}>Action</button>
              </div>
            </Block>

            <Block title="Form field">
              <div className="eu-field" style={{ maxWidth: "22rem" }}>
                <label className="eu-label" htmlFor="demo-email">Email</label>
                <input id="demo-email" className="eu-input" placeholder="you@example.com" />
                <span className="eu-help">We&apos;ll never share it.</span>
              </div>
            </Block>

            <Block title="Badges & alert">
              <div className="eu-cluster" style={{ marginBottom: "var(--eu-space-4)" }}>
                <span className="eu-badge">Default</span>
                <span className="eu-badge eu-badge--brand">Brand</span>
                <span className="eu-badge eu-badge--success">Success</span>
                <span className="eu-badge eu-badge--warning">Warning</span>
                <span className="eu-badge eu-badge--danger">Danger</span>
              </div>
              <div className="eu-alert eu-alert--success">Your changes were saved.</div>
            </Block>

            <Block title={`Accordion (${ACC_COUNT} designs · grouped by family · media · meta · nested · zero-JS · works in export)`}>
              {/* variant picker — grouped by design family; themed like the export it drives, wraps on narrow widths */}
              <div style={{ display: "grid", gap: "var(--eu-space-3)", marginBottom: "var(--eu-space-4)" }}>
                {ACC_GROUPS.map((grp) => (
                  <div key={grp.group}>
                    <div style={{ fontSize: "var(--eu-text-xs)", fontWeight: "var(--eu-weight-semibold)", letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--eu-color-muted)", marginBottom: "var(--eu-space-2)" }}>
                      {grp.group}
                    </div>
                    <div className="eu-cluster">
                      {grp.items.map((v) => {
                        const on = accVariant === v.id;
                        return (
                          <button key={v.id || "boxed"} onClick={() => setAccVariant(v.id)} aria-pressed={on}
                            style={{ cursor: "pointer", fontSize: "var(--eu-text-sm)", fontWeight: "var(--eu-weight-medium)", padding: "var(--eu-space-2) var(--eu-space-3)", borderRadius: "var(--eu-radius-md)", border: `1px solid ${on ? "transparent" : "var(--eu-color-border)"}`, background: on ? "var(--eu-color-brand)" : "transparent", color: on ? "var(--eu-color-on-brand)" : "var(--eu-color-text)" }}>
                            {v.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className={"eu-accordion" + (accVariant ? " eu-accordion" + accVariant : "")}>
                {/* item 1 — shows the __media thumbnail slot + a __meta price (Colorlib image V09 / menu V02) */}
                <details className="eu-accordion__item" open>
                  <summary className="eu-accordion__header">
                    <span className="eu-accordion__media" aria-hidden style={{ display: "grid", placeItems: "center", fontSize: "1.3em" }}>🎨</span>
                    What is Educo UI?
                    <span className="eu-accordion__meta">Free</span>
                  </summary>
                  <div className="eu-accordion__body">Our own token-driven framework — an OKLCH colour scale, a responsive grid, and components built from theme tokens, so one change re-themes everything.</div>
                </details>
                {/* item 2 — shows a __meta count + a NESTED sub-accordion (Colorlib profile V04/V05/V08/V15) */}
                <details className="eu-accordion__item">
                  <summary className="eu-accordion__header">Is every block responsive?<span className="eu-accordion__meta">3 topics</span></summary>
                  <div className="eu-accordion__body">
                    Yes — fluid layouts, rem units, flexible media and container queries. It stays clean at every width:
                    <div className="eu-accordion">
                      <details className="eu-accordion__item"><summary className="eu-accordion__header">Mobile · 375px</summary><div className="eu-accordion__body">Single column, comfortable tap targets.</div></details>
                      <details className="eu-accordion__item"><summary className="eu-accordion__header">Tablet · 768px</summary><div className="eu-accordion__body">Reflows to a denser grid via container queries.</div></details>
                    </div>
                  </div>
                </details>
                {/* item 3 — plain header + meta */}
                <details className="eu-accordion__item">
                  <summary className="eu-accordion__header">Does it follow the theme?<span className="eu-accordion__meta">4 themes</span></summary>
                  <div className="eu-accordion__body">Every colour, space and radius is a token, so the same block looks right in light, dark, midnight and purple — switch the theme above to see.</div>
                </details>
              </div>
            </Block>

            <Block title="Tabs">
              <TabsDemo />
            </Block>

            <Block title="Forms" status="soon"><p style={{ color: "var(--eu-color-muted)" }}>Full form block (inputs, selects, validation) — next up.</p></Block>
            <Block title="Gallery · Social · Map · Charts/Tables · Rich-text" status="soon"><p style={{ color: "var(--eu-color-muted)" }}>Queued — each will appear here, testable, as it&apos;s built.</p></Block>
          </div>
        </div>
      </div>
    </div>
  );
}
