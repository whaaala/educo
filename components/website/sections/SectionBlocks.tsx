"use client";

/**
 * Flowing block layer for a section. Users add text / heading / button / image blocks that STACK
 * inside the section — they flow one below another and can never overlap (Lego-style, and responsive
 * by construction). Reuses the SectionKit primitives (Heading/Lead/BrandButton/ImageBox/EditableText)
 * so blocks are brand-themed and inline-editable. Self-contained: all edits flow up via onChange.
 */

import { useRef } from "react";
import { Plus, Type, Heading as HeadingIcon, MousePointerClick, Image as ImageIcon, ChevronUp, ChevronDown, Trash2, AlignLeft, AlignCenter, AlignRight, Upload } from "lucide-react";
import type { SectionBlock, SectionBlockType, SiteTheme } from "@/lib/site-storage";
import { createSectionBlock } from "@/lib/site-storage";
import { Container, Heading, Lead, BrandButton, ImageBox, tint } from "./SectionKit";

const ALIGN_ITEMS: Record<string, string> = { left: "items-start", center: "items-center", right: "items-end" };
const NEXT_ALIGN: Record<string, "left" | "center" | "right"> = { left: "center", center: "right", right: "left" };
const ALIGN_ICON = { left: AlignLeft, center: AlignCenter, right: AlignRight } as const;

const ADD_OPTS: { type: SectionBlockType; label: string; Icon: typeof Type }[] = [
  { type: "heading", label: "Heading", Icon: HeadingIcon },
  { type: "text", label: "Text", Icon: Type },
  { type: "button", label: "Button", Icon: MousePointerClick },
  { type: "image", label: "Image", Icon: ImageIcon },
];

function BlockView({ b, theme, editable, onText, onSrc }: {
  b: SectionBlock; theme: SiteTheme; editable?: boolean; onText: (v: string) => void; onSrc: (v: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  switch (b.type) {
    case "heading":
      return <Heading theme={theme} value={b.text} editable={editable} onChange={onText} className="text-2xl sm:text-3xl" placeholder="Heading" />;
    case "button":
      return <BrandButton theme={theme} cta={{ label: b.text ?? "", href: b.href }} editable={editable} onChange={onText} />;
    case "image":
      return (
        <div className="relative w-full max-w-3xl" style={{ height: 280 }}>
          <ImageBox theme={theme} src={b.src} />
          {editable && (
            <>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-900/80 text-white shadow-lg hover:bg-gray-900"
              ><Upload className="w-3.5 h-3.5" /> {b.src ? "Replace" : "Upload"}</button>
              <input
                ref={fileRef} type="file" accept="image/*" className="hidden" aria-label="Upload block image"
                onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => onSrc(String(r.result)); r.readAsDataURL(f); e.target.value = ""; }}
              />
            </>
          )}
        </div>
      );
    default:
      return <Lead theme={theme} value={b.text} editable={editable} onChange={onText} />;
  }
}

export default function SectionBlocks({ blocks, theme, editable, onChange }: {
  blocks?: SectionBlock[];
  theme: SiteTheme;
  editable?: boolean;
  onChange?: (blocks: SectionBlock[]) => void;
}) {
  const list = blocks ?? [];
  const update = (id: string, patch: Partial<SectionBlock>) => onChange?.(list.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  const move = (i: number, dir: -1 | 1) => { const j = i + dir; if (j < 0 || j >= list.length) return; const a = [...list]; [a[i], a[j]] = [a[j], a[i]]; onChange?.(a); };
  const remove = (id: string) => onChange?.(list.filter((b) => b.id !== id));
  const add = (type: SectionBlockType) => onChange?.([...list, createSectionBlock(type)]);

  if (!editable && list.length === 0) return null;

  return (
    <Container className="pb-8">
      <div className="flex flex-col gap-5">
        {list.map((b, i) => {
          const align = b.align ?? "left";
          return (
            <div key={b.id} className={`group/blk relative flex flex-col ${ALIGN_ITEMS[align]}`} style={{ width: "100%" }}>
              <BlockView b={b} theme={theme} editable={editable} onText={(v) => update(b.id, { text: v })} onSrc={(v) => update(b.id, { src: v })} />
              {editable && (
                <div className="absolute -top-3 right-0 z-10 flex items-center gap-0.5 rounded-lg bg-gray-900/85 backdrop-blur px-1 py-0.5 shadow-lg opacity-0 group-hover/blk:opacity-100 focus-within:opacity-100 transition-opacity">
                  {(() => { const AIcon = ALIGN_ICON[align]; return (
                    <button onClick={() => update(b.id, { align: NEXT_ALIGN[align] })} aria-label={`Align block (currently ${align})`} title="Align" className="p-1 rounded text-white/90 hover:bg-white/15"><AIcon className="w-3.5 h-3.5" /></button>
                  ); })()}
                  <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move block up" className="p-1 rounded text-white/90 hover:bg-white/15 disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                  <button onClick={() => move(i, 1)} disabled={i === list.length - 1} aria-label="Move block down" className="p-1 rounded text-white/90 hover:bg-white/15 disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                  <button onClick={() => remove(b.id)} aria-label="Delete block" className="p-1 rounded text-red-300 hover:bg-red-500/30"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              )}
            </div>
          );
        })}

        {editable && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1" role="group" aria-label="Add a block to this section">
            <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: tint(theme.text, 0.55) }}><Plus className="w-3.5 h-3.5" /> Add block:</span>
            {ADD_OPTS.map(({ type, label, Icon }) => (
              <button
                key={type}
                onClick={() => add(type)}
                aria-label={`Add ${label} block`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors"
                style={{ borderColor: tint(theme.text, 0.15), color: theme.text }}
              ><Icon className="w-3.5 h-3.5" /> {label}</button>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
