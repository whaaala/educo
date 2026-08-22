"use client";

import type { Section, SiteTheme } from "@/lib/site-storage";
import {
  HeroSection, AboutSection, FeaturesSection, StatsSection, GallerySection,
  TestimonialsSection, CtaSection, ContactSection, CustomSection,
} from "./SectionComponents";

const MAP = {
  hero: HeroSection,
  about: AboutSection,
  features: FeaturesSection,
  stats: StatsSection,
  gallery: GallerySection,
  testimonials: TestimonialsSection,
  cta: CtaSection,
  contact: ContactSection,
  custom: CustomSection,
} as const;

/** Renders a single section by type, brand-themed. */
export default function SectionRenderer({ section, theme }: { section: Section; theme: SiteTheme }) {
  const Cmp = MAP[section.type] ?? CustomSection;
  return <Cmp content={section.content ?? {}} theme={theme} variant={section.variant} />;
}
