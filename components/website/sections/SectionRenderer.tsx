"use client";

import type { Section, SectionContent, SectionBlock, SiteTheme } from "@/lib/site-storage";
import {
  HeroSection, AboutSection, FeaturesSection, StatsSection, GallerySection,
  TestimonialsSection, CtaSection, ContactSection, CustomSection,
} from "./SectionComponents";
import SectionBlocks from "./SectionBlocks";

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

/** Renders a single section by type, brand-themed. `editable` enables inline canvas editing.
 *  User-added flowing blocks (SectionBlocks) render below the designed content, inside the section. */
export default function SectionRenderer({
  section, theme, editable, onChange, onBlocksChange,
}: {
  section: Section;
  theme: SiteTheme;
  editable?: boolean;
  onChange?: (patch: Partial<SectionContent>) => void;
  onBlocksChange?: (blocks: SectionBlock[]) => void;
}) {
  const Cmp = MAP[section.type] ?? CustomSection;
  return (
    <>
      <Cmp content={section.content ?? {}} theme={theme} variant={section.variant} editable={editable} onChange={onChange} />
      <SectionBlocks blocks={section.blocks} theme={theme} editable={editable} onChange={onBlocksChange} />
    </>
  );
}
