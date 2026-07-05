"use client";

/**
 * Real content for the presentation Tools & Help menus (previously alert("coming soon")).
 * Each panel is rendered inside an <EditorDialog>. Behaviours that aren't dialogs
 * (spell-check toggle, voice typing) live as helpers in SlideEditor.
 */

import React from "react";
import type { SlideData, SlideObject } from "@/lib/slide-storage";

// ── Format options: precise position, size, rotation + border for the selected object ──
export function FormatOptionsDialog({ obj: initial, onUpdate }: { obj: SlideObject; onUpdate: (patch: Partial<SlideObject>) => void }) {
  const [obj, setObj] = React.useState<SlideObject>(initial);
  const apply = (patch: Partial<SlideObject>) => { setObj(o => ({ ...o, ...patch } as SlideObject)); onUpdate(patch); };
  const num = (v: number) => Math.round((v ?? 0) * 10) / 10;
  const field = "w-20 px-2 py-1 text-[12px] rounded-md border border-gray-200 dark:border-gray-700 dark:bg-[#1a1d24] dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-400 text-right";
  const label = "text-[11px] text-gray-500 dark:text-gray-400 w-16";
  // Border maps to the field each object type actually uses.
  const isShape = obj.type === "shape";
  const borderColor = (obj as { stroke?: string; borderColor?: string }).stroke ?? (obj as { borderColor?: string }).borderColor ?? "#000000";
  const borderWidth = (obj as { strokeWidth?: number; borderWidth?: number }).strokeWidth ?? (obj as { borderWidth?: number }).borderWidth ?? 0;
  const setBorderColor = (c: string) => apply(isShape ? { stroke: c } as Partial<SlideObject> : { borderColor: c } as Partial<SlideObject>);
  const setBorderWidth = (w: number) => apply(isShape ? { strokeWidth: w } as Partial<SlideObject> : { borderWidth: w } as Partial<SlideObject>);
  const row = "flex items-center gap-2 mb-2";
  return (
    <div className="text-[12px]">
      <div className={sectionTitle}>Position</div>
      <div className={row}><span className={label}>X (%)</span><input className={field} type="number" value={num(obj.x)} onChange={e => apply({ x: Number(e.target.value) })} />
        <span className={label}>Y (%)</span><input className={field} type="number" value={num(obj.y)} onChange={e => apply({ y: Number(e.target.value) })} /></div>
      <div className={sectionTitle}>Size</div>
      <div className={row}><span className={label}>Width</span><input className={field} type="number" value={num(obj.width)} onChange={e => apply({ width: Number(e.target.value) })} />
        <span className={label}>Height</span><input className={field} type="number" value={num(obj.height)} onChange={e => apply({ height: Number(e.target.value) })} /></div>
      <div className={sectionTitle}>Rotation</div>
      <div className={row}><span className={label}>Degrees</span><input className={field} type="number" value={num(obj.rotation || 0)} onChange={e => apply({ rotation: Number(e.target.value) })} /></div>
      <div className={sectionTitle}>Border</div>
      <div className={row}>
        <span className={label}>Color</span>
        <input type="color" className="w-8 h-7 p-0 border-0 rounded cursor-pointer bg-transparent" value={borderColor === "transparent" ? "#000000" : borderColor} onChange={e => setBorderColor(e.target.value)} />
        <span className={label}>Weight</span>
        <input className={field} type="number" min={0} value={borderWidth} onChange={e => setBorderWidth(Number(e.target.value))} />
      </div>
    </div>
  );
}

const row = "flex items-center justify-between gap-4 py-1.5 text-[12px]";
const kbd = "px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-[#22262e] border border-gray-200 dark:border-gray-700 text-[11px] font-mono text-gray-700 dark:text-gray-200";
const sectionTitle = "text-[11px] uppercase tracking-wide text-gray-400 font-semibold mt-3 mb-1";

// ── Keyboard shortcuts ──
const SHORTCUTS: { group: string; items: [string, string][] }[] = [
  { group: "Slides", items: [["New slide", "Ctrl+M"], ["Duplicate slide", "Ctrl+D"], ["Delete slide", "Del"], ["Present", "Ctrl+F5"], ["Next / previous slide", "PageDn / PageUp"]] },
  { group: "Edit", items: [["Undo", "Ctrl+Z"], ["Redo", "Ctrl+Y"], ["Copy", "Ctrl+C"], ["Cut", "Ctrl+X"], ["Paste", "Ctrl+V"], ["Duplicate object", "Ctrl+D"], ["Select all text", "Ctrl+A"], ["Delete object", "Del"]] },
  { group: "Format text", items: [["Bold", "Ctrl+B"], ["Italic", "Ctrl+I"], ["Underline", "Ctrl+U"], ["Print", "Ctrl+P"]] },
  { group: "Arrange", items: [["Group / Ungroup", "Ctrl+Alt+G"], ["Nudge object", "Arrow keys"]] },
  { group: "View", items: [["Grid view", "Ctrl+Alt+1"], ["Fullscreen", "F11"], ["Slideshow", "F5"]] },
];

export function ShortcutsDialog() {
  return (
    <div className="max-h-[60vh] overflow-y-auto pr-1">
      {SHORTCUTS.map(s => (
        <div key={s.group}>
          <div className={sectionTitle}>{s.group}</div>
          {s.items.map(([label, keys]) => (
            <div key={label} className={row}>
              <span className="text-gray-700 dark:text-gray-200">{label}</span>
              <span className="flex gap-1">{keys.split(" ").map((k, i) => <kbd key={i} className={kbd}>{k}</kbd>)}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── What's new ──
export function UpdatesDialog() {
  const items = [
    "Charts: 19 types (column, bar, line, pie, donut, radar, funnel, gauge, waffle, and more) with a modern look, optional 3D, and a live data editor.",
    "Smarter insert: new objects fit into free space, and only overflow to a new slide when the page is full.",
    "Copy / paste works across slides via keyboard, the Edit menu, and right-click.",
    "Rotated objects always stay within the page.",
  ];
  return (
    <div className="text-[12px] text-gray-700 dark:text-gray-200 space-y-2">
      <p className="font-semibold text-green-600 dark:text-green-400">You're on the latest version.</p>
      <div className={sectionTitle}>Recently added</div>
      <ul className="list-disc pl-5 space-y-1.5">{items.map((t, i) => <li key={i}>{t}</li>)}</ul>
    </div>
  );
}

// ── Training / help resources ──
export function TrainingDialog() {
  const links = [
    { label: "Getting started with presentations", href: "/documents" },
    { label: "Keyboard shortcuts", href: "#shortcuts" },
    { label: "Educo help & documentation", href: "https://educo.example/help" },
  ];
  return (
    <div className="text-[12px] space-y-2">
      <p className="text-gray-600 dark:text-gray-300">Guides and resources for building presentations.</p>
      <div className="flex flex-col gap-1.5 mt-2">
        {links.map(l => (
          <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#22262e] text-gray-700 dark:text-gray-200">
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Accessibility (real toggles applied to the document root) ──
const A11Y_KEY = "educo-a11y";
type A11y = { highContrast: boolean; reduceMotion: boolean; largeText: boolean };
export function loadA11y(): A11y {
  try { return { highContrast: false, reduceMotion: false, largeText: false, ...JSON.parse(localStorage.getItem(A11Y_KEY) || "{}") }; }
  catch { return { highContrast: false, reduceMotion: false, largeText: false }; }
}
export function applyA11y(a: A11y) {
  const r = document.documentElement;
  r.classList.toggle("a11y-high-contrast", a.highContrast);
  r.classList.toggle("a11y-reduce-motion", a.reduceMotion);
  r.classList.toggle("a11y-large-text", a.largeText);
}
export function AccessibilityDialog() {
  const [a, setA] = React.useState<A11y>(() => loadA11y());
  const set = (k: keyof A11y) => {
    const next = { ...a, [k]: !a[k] };
    setA(next); applyA11y(next);
    try { localStorage.setItem(A11Y_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };
  const toggles: [keyof A11y, string, string][] = [
    ["highContrast", "High contrast", "Stronger text/background contrast"],
    ["largeText", "Larger text", "Increase editor text size"],
    ["reduceMotion", "Reduce motion", "Minimise animations and transitions"],
  ];
  return (
    <div className="space-y-1">
      {toggles.map(([k, label, desc]) => (
        <button key={k} onClick={() => set(k)} className="w-full flex items-center justify-between gap-4 px-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-[#22262e] text-left" aria-pressed={a[k]}>
          <span>
            <span className="block text-[12px] font-medium text-gray-800 dark:text-gray-100">{label}</span>
            <span className="block text-[11px] text-gray-400">{desc}</span>
          </span>
          <span className={`w-9 h-5 rounded-full flex items-center transition-colors ${a[k] ? "bg-blue-600 justify-end" : "bg-gray-300 dark:bg-gray-600 justify-start"} p-0.5`}>
            <span className="w-4 h-4 rounded-full bg-white" />
          </span>
        </button>
      ))}
    </div>
  );
}

// ── Personal dictionary (custom spell-check words) ──
const DICT_KEY = "educo-dictionary";
export function loadDictionary(): string[] { try { return JSON.parse(localStorage.getItem(DICT_KEY) || "[]"); } catch { return []; } }
export function DictionaryDialog() {
  const [words, setWords] = React.useState<string[]>(() => loadDictionary());
  const [input, setInput] = React.useState("");
  const save = (w: string[]) => { setWords(w); try { localStorage.setItem(DICT_KEY, JSON.stringify(w)); } catch { /* ignore */ } };
  const add = () => { const w = input.trim(); if (w && !words.includes(w)) save([...words, w]); setInput(""); };
  return (
    <div className="text-[12px]">
      <p className="text-gray-500 dark:text-gray-400 mb-2">Words added here won't be flagged by spell check.</p>
      <div className="flex gap-1 mb-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="Add a word…"
          className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-[#1a1d24] outline-none focus:ring-2 focus:ring-blue-400" />
        <button onClick={add} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium">Add</button>
      </div>
      {words.length === 0 ? <p className="text-gray-400 py-2">No custom words yet.</p> : (
        <div className="flex flex-wrap gap-1.5 max-h-[40vh] overflow-y-auto">
          {words.map(w => (
            <span key={w} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-[#22262e]">
              {w}<button onClick={() => save(words.filter(x => x !== w))} aria-label={`Remove ${w}`} className="text-gray-400 hover:text-red-500">✕</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Linked objects (charts / images that carry their own data or source) ──
export function LinkedObjectsDialog({ objects }: { objects: SlideObject[] }) {
  const linked = objects.filter(o => o.type === "chart" || o.type === "image");
  return (
    <div className="text-[12px]">
      {linked.length === 0 ? <p className="text-gray-400 py-2">No linked objects on this slide.</p> : (
        <ul className="space-y-1.5 max-h-[50vh] overflow-y-auto">
          {linked.map(o => (
            <li key={o.id} className="flex items-center justify-between gap-3 px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-[#22262e]">
              <span className="text-gray-700 dark:text-gray-200 capitalize">
                {o.type === "chart" ? `Chart · ${(o as { chartType?: string }).chartType || ""}` : "Image"}
              </span>
              <span className="text-[11px] text-gray-400 truncate max-w-[220px]">
                {o.type === "image" ? (o as { src?: string }).src?.slice(0, 40) : "data-backed"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Explore: search all slide text and jump to it ──
export function ExploreDialog({ slides, onGoToSlide }: { slides: SlideData[]; onGoToSlide: (idx: number) => void }) {
  const [q, setQ] = React.useState("");
  const hits: { idx: number; text: string }[] = [];
  if (q.trim()) {
    const needle = q.toLowerCase();
    slides.forEach((s, idx) => {
      const texts: string[] = [];
      if (s.content) texts.push(s.content.replace(/<[^>]+>/g, " "));
      (s.objects || []).forEach(o => { if (o.type === "textbox" && (o as { content?: string }).content) texts.push((o as { content: string }).content.replace(/<[^>]+>/g, " ")); });
      const joined = texts.join(" ").trim();
      if (joined.toLowerCase().includes(needle)) hits.push({ idx, text: joined.slice(0, 80) });
    });
  }
  return (
    <div className="text-[12px]">
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search text across all slides…" autoFocus
        className="w-full px-2 py-1.5 mb-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-[#1a1d24] outline-none focus:ring-2 focus:ring-blue-400" />
      {q.trim() && hits.length === 0 && <p className="text-gray-400 py-2">No matches.</p>}
      <ul className="space-y-1 max-h-[45vh] overflow-y-auto">
        {hits.map(h => (
          <li key={h.idx}>
            <button onClick={() => onGoToSlide(h.idx)} className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-[#22262e]">
              <span className="font-medium text-gray-700 dark:text-gray-200">Slide {h.idx + 1}</span>
              <span className="block text-[11px] text-gray-400 truncate">{h.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Insert audio / video by URL ──
export function MediaUrlDialog({ kind, onInsert }: { kind: "audio" | "video"; onInsert: (url: string) => void }) {
  const [url, setUrl] = React.useState("");
  const submit = () => { const u = url.trim(); if (u) onInsert(u); };
  return (
    <div className="text-[12px]">
      <p className="text-gray-500 dark:text-gray-400 mb-2">Paste a direct link to {kind === "audio" ? "an audio file (mp3, wav, m4a)" : "a video file (mp4, webm)"}.</p>
      <div className="flex gap-1">
        <input autoFocus value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="https://…" className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-[#1a1d24] dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-400" />
        <button onClick={submit} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium">Insert</button>
      </div>
    </div>
  );
}

// ── Menu search (command palette) ──
export interface MenuCommand { label: string; run: () => void }
export function MenuSearchDialog({ commands, onClose }: { commands: MenuCommand[]; onClose: () => void }) {
  const [q, setQ] = React.useState("");
  const filtered = q.trim() ? commands.filter(c => c.label.toLowerCase().includes(q.toLowerCase())).slice(0, 40) : commands.slice(0, 40);
  return (
    <div className="text-[12px]">
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search the menus…" autoFocus
        className="w-full px-2 py-1.5 mb-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-[#1a1d24] outline-none focus:ring-2 focus:ring-blue-400" />
      {q.trim() && filtered.length === 0 && <p className="text-gray-400 py-2">No commands found.</p>}
      <ul className="space-y-0.5 max-h-[50vh] overflow-y-auto">
        {filtered.map(c => (
          <li key={c.label}>
            <button onClick={() => { onClose(); c.run(); }} className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-[#22262e] text-gray-700 dark:text-gray-200">{c.label}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
