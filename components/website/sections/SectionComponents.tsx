"use client";

/**
 * The website section library — modern, responsive, fully brand-driven blocks. Each reads its
 * colours/fonts/radius from the site `theme` (never hardcoded) and its copy from `content`.
 * Text is INLINE-EDITABLE in the builder (editable=true → contentEditable on the canvas); on the
 * published site (editable=false) it renders plain. Reusable via SectionRenderer / SiteRenderer.
 */

import React from "react";
import type { SectionContent, SectionItem, SiteTheme } from "@/lib/site-storage";
import { resolveIcon } from "./icons";
import {
  Container, Eyebrow, Heading, Lead, BrandButton, ImageBox, SectionShell, EditableText, tint,
} from "./SectionKit";

export interface SectionViewProps {
  content: SectionContent;
  theme: SiteTheme;
  variant?: string;
  /** When true, text is editable inline on the canvas. */
  editable?: boolean;
  /** Patch the section's content (merged). */
  onChange?: (patch: Partial<SectionContent>) => void;
}

/** Helpers to patch content + a specific item. */
function editors(content: SectionContent, onChange?: (p: Partial<SectionContent>) => void) {
  const edit = (patch: Partial<SectionContent>) => onChange?.(patch);
  const editItem = (i: number, patch: Partial<SectionItem>) =>
    onChange?.({ items: (content.items ?? []).map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  const editCta = (which: "ctaPrimary" | "ctaSecondary", label: string) =>
    onChange?.({ [which]: { ...(content[which] ?? {}), label } });
  return { edit, editItem, editCta };
}

/* ── Hero ── (4 layouts: split | image-left | centered | banner) */
function TrustRow({ theme }: { theme: SiteTheme }) {
  return (
    <div className="mt-8 flex items-center gap-3">
      <div className="flex -space-x-2">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[0.6875rem] font-bold" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, boxShadow: `0 0 0 2px ${theme.background}` }}>
            {String.fromCharCode(65 + i)}
          </span>
        ))}
      </div>
      <span className="text-sm" style={{ color: theme.textMuted }}>Trusted by <b style={{ color: theme.text }}>1,200+</b> families</span>
    </div>
  );
}

function HeroImage({ theme, src, className = "" }: { theme: SiteTheme; src?: string; className?: string }) {
  const GradIcon = resolveIcon("GraduationCap");
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -inset-4 rounded-[2rem] blur-2xl" style={{ background: tint(theme.accent, 0.2) }} aria-hidden="true" />
      <div className="relative aspect-[4/3] shadow-2xl overflow-hidden" style={{ borderRadius: theme.radius * 1.5 }}>
        <ImageBox theme={theme} src={src} alt="Hero" rounded={false} />
      </div>
      <div className="absolute -bottom-5 -left-5 sm:-left-6 flex items-center gap-3 px-4 py-3 shadow-xl" style={{ background: theme.background, borderRadius: theme.radius, border: `1px solid ${tint(theme.text, 0.08)}` }}>
        <span className="inline-flex w-10 h-10 rounded-xl items-center justify-center" style={{ background: tint(theme.primary, 0.12), color: theme.primary }}>
          <GradIcon className="w-5 h-5" />
        </span>
        <div>
          <div className="text-lg font-extrabold leading-none" style={{ color: theme.text, fontFamily: theme.headingFont }}>98%</div>
          <div className="text-[0.6875rem]" style={{ color: theme.textMuted }}>Graduation rate</div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection({ content, theme, variant = "split", editable, onChange }: SectionViewProps) {
  const { edit, editCta } = editors(content, onChange);
  const shellStyle = { background: `linear-gradient(160deg, ${tint(theme.primary, 0.08)}, ${theme.background} 60%)` };

  if (variant === "banner") {
    return (
      <SectionShell style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }} className="relative overflow-hidden">
        <div className="absolute -top-16 -right-10 w-80 h-80 rounded-full blur-3xl" style={{ background: tint("#ffffff", 0.12) }} aria-hidden="true" />
        <Container className="relative text-center">
          <div className="max-w-3xl mx-auto">
            {(content.eyebrow || editable) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold" style={{ background: tint("#ffffff", 0.18), color: "#ffffff" }}>
                <EditableText value={content.eyebrow} editable={editable} onChange={(v) => edit({ eyebrow: v })} placeholder="Eyebrow" />
              </span>
            )}
            <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-white" style={{ fontFamily: theme.headingFont }}>
              <EditableText value={content.heading} editable={editable} onChange={(v) => edit({ heading: v })} placeholder="Heading" />
            </h2>
            <p className="mt-5 mx-auto max-w-xl text-base sm:text-lg" style={{ color: tint("#ffffff", 0.9) }}>
              <EditableText value={content.subheading} editable={editable} onChange={(v) => edit({ subheading: v })} placeholder="Add text" />
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <BrandButton theme={theme} cta={content.ctaPrimary} kind="solid" onDark editable={editable} onChange={(v) => editCta("ctaPrimary", v)} />
              <BrandButton theme={theme} cta={content.ctaSecondary} kind="ghost" onDark editable={editable} onChange={(v) => editCta("ctaSecondary", v)} />
            </div>
          </div>
        </Container>
      </SectionShell>
    );
  }

  if (variant === "centered") {
    return (
      <SectionShell style={shellStyle}>
        <Container className="text-center">
          <div className="max-w-3xl mx-auto">
            <Eyebrow theme={theme} value={content.eyebrow} editable={editable} onChange={(v) => edit({ eyebrow: v })} />
            <Heading theme={theme} value={content.heading} editable={editable} onChange={(v) => edit({ heading: v })} className="mt-4 text-4xl sm:text-5xl lg:text-6xl" />
            <Lead theme={theme} value={content.subheading} editable={editable} onChange={(v) => edit({ subheading: v })} className="mt-5 mx-auto max-w-xl" />
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <BrandButton theme={theme} cta={content.ctaPrimary} kind="solid" editable={editable} onChange={(v) => editCta("ctaPrimary", v)} />
              <BrandButton theme={theme} cta={content.ctaSecondary} kind="ghost" editable={editable} onChange={(v) => editCta("ctaSecondary", v)} />
            </div>
          </div>
          <div className="mt-12 relative aspect-[16/7] w-full shadow-2xl overflow-hidden" style={{ borderRadius: theme.radius * 1.5 }}>
            <ImageBox theme={theme} src={content.image} alt="Hero" rounded={false} />
          </div>
        </Container>
      </SectionShell>
    );
  }

  const imageFirst = variant === "image-left";
  return (
    <SectionShell style={shellStyle}>
      <Container className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className={imageFirst ? "lg:order-2" : ""}>
          <Eyebrow theme={theme} value={content.eyebrow} editable={editable} onChange={(v) => edit({ eyebrow: v })} />
          <Heading theme={theme} value={content.heading} editable={editable} onChange={(v) => edit({ heading: v })} className="mt-4 text-4xl sm:text-5xl lg:text-6xl" />
          <Lead theme={theme} value={content.subheading} editable={editable} onChange={(v) => edit({ subheading: v })} className="mt-5 max-w-xl" />
          <div className="mt-8 flex flex-wrap gap-3">
            <BrandButton theme={theme} cta={content.ctaPrimary} kind="solid" editable={editable} onChange={(v) => editCta("ctaPrimary", v)} />
            <BrandButton theme={theme} cta={content.ctaSecondary} kind="ghost" editable={editable} onChange={(v) => editCta("ctaSecondary", v)} />
          </div>
          <TrustRow theme={theme} />
        </div>
        <div className={imageFirst ? "lg:order-1" : ""}>
          <HeroImage theme={theme} src={content.image} />
        </div>
      </Container>
    </SectionShell>
  );
}

/* ── About ── */
export function AboutSection({ content, theme, editable, onChange }: SectionViewProps) {
  const { edit, editCta } = editors(content, onChange);
  return (
    <SectionShell style={{ background: theme.background }}>
      <Container className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className="relative order-last lg:order-first">
          <div className="aspect-[4/3] shadow-xl overflow-hidden" style={{ borderRadius: theme.radius * 1.5 }}>
            <ImageBox theme={theme} src={content.image} alt="About" rounded={false} />
          </div>
        </div>
        <div>
          <Eyebrow theme={theme} value={content.eyebrow} editable={editable} onChange={(v) => edit({ eyebrow: v })} />
          <Heading theme={theme} value={content.heading} editable={editable} onChange={(v) => edit({ heading: v })} className="mt-4 text-3xl sm:text-4xl" />
          <Lead theme={theme} value={content.body} editable={editable} onChange={(v) => edit({ body: v })} className="mt-5" />
          <div className="mt-7"><BrandButton theme={theme} cta={content.ctaPrimary} kind="solid" editable={editable} onChange={(v) => editCta("ctaPrimary", v)} /></div>
        </div>
      </Container>
    </SectionShell>
  );
}

/* ── Features / Programs ── */
export function FeaturesSection({ content, theme, editable, onChange }: SectionViewProps) {
  const { edit, editItem } = editors(content, onChange);
  const items = content.items ?? [];
  return (
    <SectionShell style={{ background: theme.surface }}>
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <Eyebrow theme={theme} value={content.eyebrow} editable={editable} onChange={(v) => edit({ eyebrow: v })} />
          <Heading theme={theme} value={content.heading} editable={editable} onChange={(v) => edit({ heading: v })} className="mt-4 text-3xl sm:text-4xl" />
          <Lead theme={theme} value={content.subheading} editable={editable} onChange={(v) => edit({ subheading: v })} className="mt-4" />
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, i) => {
            const Icon = resolveIcon(it.icon);
            return (
              <div key={i} className="p-6 transition-transform hover:-translate-y-1" style={{ background: theme.background, borderRadius: theme.radius, boxShadow: `0 10px 30px -18px ${tint(theme.text, 0.35)}`, border: `1px solid ${tint(theme.text, 0.06)}` }}>
                <span className="inline-flex w-12 h-12 rounded-2xl items-center justify-center" style={{ background: tint(theme.primary, 0.12), color: theme.primary }}>
                  <Icon className="w-6 h-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold" style={{ color: theme.text, fontFamily: theme.headingFont }}>
                  <EditableText value={it.title} editable={editable} onChange={(v) => editItem(i, { title: v })} placeholder="Title" />
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.textMuted }}>
                  <EditableText value={it.body} editable={editable} onChange={(v) => editItem(i, { body: v })} placeholder="Description" />
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </SectionShell>
  );
}

/* ── Stats ── */
export function StatsSection({ content, theme, editable, onChange }: SectionViewProps) {
  const { editItem } = editors(content, onChange);
  const items = content.items ?? [];
  return (
    <SectionShell className="!py-14" style={{ background: theme.background }}>
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 p-10 text-center" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, borderRadius: theme.radius * 1.5 }}>
          {items.map((it, i) => (
            <div key={i}>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white" style={{ fontFamily: theme.headingFont }}>
                <EditableText value={it.value} editable={editable} onChange={(v) => editItem(i, { value: v })} placeholder="0" />
              </div>
              <div className="mt-1 text-sm font-medium" style={{ color: tint("#ffffff", 0.8) }}>
                <EditableText value={it.title} editable={editable} onChange={(v) => editItem(i, { title: v })} placeholder="Label" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
}

/* ── Gallery ── */
export function GallerySection({ content, theme, editable, onChange }: SectionViewProps) {
  const { edit } = editors(content, onChange);
  const items = content.items ?? [];
  return (
    <SectionShell style={{ background: theme.background }}>
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <Eyebrow theme={theme} value={content.eyebrow} editable={editable} onChange={(v) => edit({ eyebrow: v })} />
          <Heading theme={theme} value={content.heading} editable={editable} onChange={(v) => edit({ heading: v })} className="mt-4 text-3xl sm:text-4xl" />
        </div>
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it, i) => (
            <div key={i} className={`overflow-hidden ${i % 5 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"}`} style={{ borderRadius: theme.radius }}>
              <ImageBox theme={theme} src={it.image} alt={`Photo ${i + 1}`} rounded={false} />
            </div>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
}

/* ── Testimonials ── */
export function TestimonialsSection({ content, theme, editable, onChange }: SectionViewProps) {
  const { edit, editItem } = editors(content, onChange);
  const items = content.items ?? [];
  const QuoteIcon = resolveIcon("Quote");
  return (
    <SectionShell style={{ background: theme.surface }}>
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <Eyebrow theme={theme} value={content.eyebrow} editable={editable} onChange={(v) => edit({ eyebrow: v })} />
          <Heading theme={theme} value={content.heading} editable={editable} onChange={(v) => edit({ heading: v })} className="mt-4 text-3xl sm:text-4xl" />
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <div key={i} className="p-6 flex flex-col" style={{ background: theme.background, borderRadius: theme.radius, boxShadow: `0 10px 30px -18px ${tint(theme.text, 0.35)}` }}>
              <QuoteIcon className="w-8 h-8" style={{ color: tint(theme.primary, 0.5) }} />
              <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed" style={{ color: theme.text }}>
                <EditableText value={it.body} editable={editable} onChange={(v) => editItem(i, { body: v })} placeholder="Quote" />
              </p>
              <div className="mt-5 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}>
                  {(it.title || "?").charAt(0)}
                </span>
                <div>
                  <div className="text-sm font-semibold" style={{ color: theme.text }}>
                    <EditableText value={it.title} editable={editable} onChange={(v) => editItem(i, { title: v })} placeholder="Name" />
                  </div>
                  <div className="text-xs" style={{ color: theme.textMuted }}>
                    <EditableText value={it.subtitle} editable={editable} onChange={(v) => editItem(i, { subtitle: v })} placeholder="Role" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
}

/* ── CTA ── */
export function CtaSection({ content, theme, editable, onChange }: SectionViewProps) {
  const { edit, editCta } = editors(content, onChange);
  return (
    <SectionShell style={{ background: theme.background }}>
      <Container>
        <div className="relative overflow-hidden text-center px-6 py-14 sm:py-16" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, borderRadius: theme.radius * 1.5 }}>
          <div className="absolute -top-10 -right-8 w-48 h-48 rounded-full blur-3xl" style={{ background: tint("#ffffff", 0.15) }} aria-hidden="true" />
          <h2 className="relative text-3xl sm:text-4xl font-extrabold text-white" style={{ fontFamily: theme.headingFont }}>
            <EditableText value={content.heading} editable={editable} onChange={(v) => edit({ heading: v })} placeholder="Heading" />
          </h2>
          <p className="relative mt-3 max-w-xl mx-auto" style={{ color: tint("#ffffff", 0.85) }}>
            <EditableText value={content.subheading} editable={editable} onChange={(v) => edit({ subheading: v })} placeholder="Add text" />
          </p>
          <div className="relative mt-8 flex flex-wrap gap-3 justify-center">
            <BrandButton theme={theme} cta={content.ctaPrimary} kind="solid" onDark editable={editable} onChange={(v) => editCta("ctaPrimary", v)} />
            <BrandButton theme={theme} cta={content.ctaSecondary} kind="ghost" onDark editable={editable} onChange={(v) => editCta("ctaSecondary", v)} />
          </div>
        </div>
      </Container>
    </SectionShell>
  );
}

/* ── Contact ── */
export function ContactSection({ content, theme, editable, onChange }: SectionViewProps) {
  const { edit, editItem } = editors(content, onChange);
  const items = content.items ?? [];
  return (
    <SectionShell style={{ background: theme.surface }}>
      <Container className="grid lg:grid-cols-2 gap-10 lg:gap-14">
        <div>
          <Eyebrow theme={theme} value={content.eyebrow} editable={editable} onChange={(v) => edit({ eyebrow: v })} />
          <Heading theme={theme} value={content.heading} editable={editable} onChange={(v) => edit({ heading: v })} className="mt-4 text-3xl sm:text-4xl" />
          <Lead theme={theme} value={content.body} editable={editable} onChange={(v) => edit({ body: v })} className="mt-4" />
          <div className="mt-8 space-y-4">
            {items.map((it, i) => {
              const Icon = resolveIcon(it.icon);
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="inline-flex w-11 h-11 rounded-xl items-center justify-center" style={{ background: tint(theme.primary, 0.12), color: theme.primary }}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: theme.text }}>
                      <EditableText value={it.title} editable={editable} onChange={(v) => editItem(i, { title: v })} placeholder="Label" />
                    </div>
                    <div className="text-sm" style={{ color: theme.textMuted }}>
                      <EditableText value={it.body} editable={editable} onChange={(v) => editItem(i, { body: v })} placeholder="Detail" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-6 sm:p-8" style={{ background: theme.background, borderRadius: theme.radius * 1.25, boxShadow: `0 20px 50px -30px ${tint(theme.text, 0.5)}` }}>
          <div className="space-y-4">
            {["Full name", "Email address"].map((label) => (
              <div key={label}>
                <label className="text-xs font-medium" style={{ color: theme.textMuted }}>{label}</label>
                <div className="mt-1 h-11 rounded-xl" style={{ border: `1px solid ${tint(theme.text, 0.12)}`, background: theme.surface }} />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium" style={{ color: theme.textMuted }}>Message</label>
              <div className="mt-1 h-24 rounded-xl" style={{ border: `1px solid ${tint(theme.text, 0.12)}`, background: theme.surface }} />
            </div>
            <button className="w-full h-11 rounded-full font-semibold text-white text-sm" style={{ background: theme.primary }}>Send message</button>
          </div>
        </div>
      </Container>
    </SectionShell>
  );
}

/* ── Custom / blank ── */
export function CustomSection({ content, theme, editable, onChange }: SectionViewProps) {
  const { edit } = editors(content, onChange);
  return (
    <SectionShell style={{ background: theme.background }}>
      <Container className="text-center">
        <Heading theme={theme} value={content.heading} editable={editable} onChange={(v) => edit({ heading: v })} className="text-2xl sm:text-3xl" />
        <Lead theme={theme} value={content.body} editable={editable} onChange={(v) => edit({ body: v })} className="mt-3 max-w-xl mx-auto" />
      </Container>
    </SectionShell>
  );
}
