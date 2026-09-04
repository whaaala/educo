"use client";

/**
 * BackgroundPicker — a reusable, themed visual chooser for block backgrounds, the parallel of IconPicker.
 * Opens a portaled popover with SEARCH + group tabs (Themed · Gradients · Mesh · Patterns) and a grid of
 * live PREVIEW swatches so users see exactly what they pick. Everything it offers is pure CSS + self-contained
 * (see `lib/educo-ui/backgrounds.ts`). Photos stay on the inspector (URL / upload) since they can't be inlined.
 *
 * onSelect gets the chosen preset (the caller maps it to bgImage + optional bgTile). Keyboard: Tab/Enter/Escape.
 * Reuse anywhere a background is chosen (any block's Background control, future section/page backgrounds).
 */

import { useState, useRef, useLayoutEffect, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search, X, Paintbrush, Check, Image as ImageIcon, Loader2 } from "lucide-react";
import { BG_PRESETS, BG_CATEGORIES, type BgPreset } from "@/lib/educo-ui/backgrounds";
import { searchStockPhotos, hasUnsplashKey, setUnsplashKey, PHOTO_TOPICS, type StockPhoto } from "@/lib/educo-ui/stock-photos";

/** Inline preview style for a swatch (patterns tile + need a strong currentColor; gradients/mesh just fill). */
export function bgPreviewStyle(p: BgPreset): React.CSSProperties {
  if (p.group === "pattern") {
    // A light ground + a clearly-visible ink so the motif actually reads (currentColor drives the pattern).
    return { backgroundColor: "#ffffff", color: "#475569", backgroundImage: p.css, backgroundSize: p.tile, backgroundRepeat: "repeat", backgroundPosition: "center" };
  }
  return { backgroundImage: p.css, backgroundSize: "cover" };
}

export default function BackgroundPicker({ value, onSelect, onSelectPhoto, onClear, ariaLabel = "Background" }: {
  value?: string;                       // current bgImage (a preset css string, URL, or undefined)
  onSelect: (preset: BgPreset) => void;
  onSelectPhoto?: (url: string) => void; // pick a stock/searched photo (sets bgImage to an external URL)
  onClear: () => void;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all"); // BG_CATEGORIES id, or "photos"
  const photoMode = cat === "photos";
  const [photos, setPhotos] = useState<StockPhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [photoErr, setPhotoErr] = useState(false);
  const [keyVer, setKeyVer] = useState(0);        // bumps when the Unsplash key changes → re-fetch
  const [keyInput, setKeyInput] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const hasKey = hasUnsplashKey();
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [pos, setPos] = useState<{ left: number; top?: number; bottom?: number; width: number; maxH: number } | null>(null);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    const match = BG_CATEGORIES.find((c) => c.id === cat)?.match ?? (() => true);
    return BG_PRESETS.filter((p) => match(p) && (!query || p.label.toLowerCase().includes(query) || p.id.includes(query)));
  }, [q, cat]);

  const current = useMemo(() => BG_PRESETS.find((p) => p.css === value), [value]);

  // Photos load asynchronously (Unsplash search when a key is set, else a curated fallback). Debounced.
  useEffect(() => {
    if (!open || !photoMode) return;
    let alive = true;
    setLoadingPhotos(true); setPhotoErr(false);
    const t = setTimeout(() => {
      searchStockPhotos(q).then((ps) => { if (alive) { setPhotos(ps); setLoadingPhotos(false); } })
        .catch(() => { if (alive) { setPhotoErr(true); setLoadingPhotos(false); } });
    }, 300);
    return () => { alive = false; clearTimeout(t); };
  }, [open, photoMode, q, keyVer]);

  const saveKey = () => { setUnsplashKey(keyInput); setShowKeyInput(false); setKeyVer((v) => v + 1); };

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const margin = 10, gap = 6;
    const width = Math.min(Math.max(r.width, 392), window.innerWidth - margin * 2);
    const left = Math.max(margin, Math.min(r.left, window.innerWidth - width - margin));
    // Give the picker a big, comfortable height (lots of previews), then CLAMP it inside the viewport — so a
    // low trigger in a short window still gets a tall panel instead of a one-row sliver.
    const maxH = Math.min(680, window.innerHeight - margin * 2);
    let top = r.bottom + gap;
    if (top + maxH > window.innerHeight - margin) top = Math.max(margin, window.innerHeight - margin - maxH);
    setPos({ left, top, width, maxH });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    const onDown = (e: MouseEvent) => { if (!popRef.current?.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btnRef.current?.focus(); } };
    const onScroll = (e: Event) => { if (!popRef.current?.contains(e.target as Node)) setOpen(false); };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    return () => { window.removeEventListener("mousedown", onDown); window.removeEventListener("keydown", onKey); window.removeEventListener("scroll", onScroll, true); };
  }, [open]);

  return (
    <>
      <button ref={btnRef} type="button" aria-label={ariaLabel} aria-haspopup="dialog" aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center gap-2.5 rounded-xl border border-line/70 bg-surface-2 px-2.5 py-2 text-sm text-ink transition-all hover:border-brand/50 hover:bg-surface focus:border-brand focus:ring-2 focus:ring-brand/25 outline-none">
        <span aria-hidden className="h-7 w-7 shrink-0 overflow-hidden rounded-lg border border-line/60" style={current ? bgPreviewStyle(current) : { background: "var(--eu-color-surface-3, #e2e8f0)" }}>
          {!current && <Paintbrush className="m-auto mt-1.5 h-4 w-4 text-muted" />}
        </span>
        <span className={`flex-1 truncate text-left ${current ? "font-medium" : "text-muted"}`}>{current ? current.label : "Choose a background"}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:text-ink" style={{ transform: open ? "rotate(180deg)" : undefined }} />
      </button>

      {open && pos && createPortal(
        <div ref={popRef} role="dialog" aria-label={`${ariaLabel} picker`}
          style={{ position: "fixed", left: pos.left, top: pos.top, bottom: pos.bottom, width: pos.width, maxHeight: pos.maxH }}
          className="z-[70] flex animate-[bgpicker-in_140ms_ease-out] flex-col overflow-hidden rounded-[1.25rem] border border-line/60 bg-surface/95 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.35)] ring-1 ring-black/5 backdrop-blur-xl">
          <style>{`@keyframes bgpicker-in{from{opacity:0;transform:translateY(-6px) scale(.98)}to{opacity:1;transform:none}}`}</style>
          <div className="px-3.5 pt-3 pb-2">
            <div className="flex w-full items-center gap-2.5 rounded-2xl bg-surface-2 px-3.5 py-2 ring-1 ring-line/60 transition-all focus-within:bg-surface focus-within:ring-2 focus-within:ring-brand/40">
              <Search className="h-4 w-4 shrink-0 text-brand/70" />
              <input ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder={photoMode ? (hasKey ? "Search millions of free photos…" : "Filter featured photos…") : `Search ${BG_PRESETS.length} backgrounds…`}
                aria-label="Search backgrounds" className="w-full bg-transparent text-sm text-ink placeholder:text-muted outline-none" />
              {q && <button type="button" aria-label="Clear search" onClick={() => setQ("")} className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-surface-3 text-muted transition-colors hover:bg-brand/15 hover:text-brand"><X className="h-3 w-3" /></button>}
            </div>
          </div>
          <div role="tablist" aria-label="Background categories" className="flex flex-wrap items-center gap-1 border-b border-line/50 px-3.5 pb-2.5">
            {BG_CATEGORIES.map((c) => (
              <button key={c.id} type="button" role="tab" aria-selected={cat === c.id} onClick={() => setCat(c.id)}
                className={`rounded-full px-2.5 py-1 text-[0.75rem] font-medium leading-none transition-all ${cat === c.id ? "bg-brand text-brand-fg shadow-sm shadow-brand/30" : "text-muted hover:bg-surface-2 hover:text-ink"}`}>{c.label}</button>
            ))}
            {onSelectPhoto && (
              <button type="button" role="tab" aria-selected={photoMode} onClick={() => setCat("photos")}
                className={`ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.75rem] font-semibold leading-none transition-all ${photoMode ? "bg-brand text-brand-fg shadow-sm shadow-brand/30" : "text-brand hover:bg-brand/10"}`}><ImageIcon className="h-3 w-3" /> Photos</button>
            )}
          </div>
          {photoMode ? (
            <>
              {/* quick topic chips — single scrollable row so they don't steal height from the photo grid */}
              <div className="flex shrink-0 gap-1 overflow-x-auto whitespace-nowrap px-3.5 pt-2 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {PHOTO_TOPICS.map((t) => {
                  const on = q.trim().toLowerCase() === t.toLowerCase();
                  return (
                    <button key={t} type="button" onClick={() => setQ(on ? "" : t)} className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.6875rem] font-medium transition-colors ${on ? "bg-brand text-brand-fg" : "bg-surface-2 text-muted hover:bg-brand/10 hover:text-brand"}`}>{t}</button>
                  );
                })}
              </div>
              <div className="grid min-h-0 flex-1 grid-cols-3 gap-2.5 overflow-y-auto px-3.5 py-2.5 [scrollbar-width:thin]">
                {loadingPhotos && Array.from({ length: 9 }).map((_, i) => (
                  <span key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-surface-2" />
                ))}
                {photoErr && !loadingPhotos && <div className="col-span-3 py-8 text-center text-sm text-muted">Couldn’t load photos — check the connection and try again.</div>}
                {!loadingPhotos && !photoErr && photos.slice(0, 150).map((ph) => {
                  const sel = value === ph.url;
                  return (
                    <button key={ph.id} type="button" title={ph.alt} aria-label={ph.alt} aria-pressed={sel}
                      onClick={() => { onSelectPhoto?.(ph.url); setOpen(false); }}
                      className="group/ph flex flex-col gap-1.5 text-left outline-none">
                      <span className={`relative aspect-[4/3] overflow-hidden rounded-xl border bg-surface-2 shadow-sm transition-all duration-150 group-hover/ph:-translate-y-0.5 group-hover/ph:shadow-lg ${sel ? "border-brand ring-2 ring-brand/60 ring-offset-2 ring-offset-surface" : "border-line/60 group-hover/ph:border-brand/50"}`}>
                        <img src={ph.thumb} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                        {sel && <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-brand text-brand-fg shadow-md"><Check className="h-3 w-3" /></span>}
                      </span>
                      <span className={`truncate text-[0.625rem] font-medium ${sel ? "text-brand" : "text-muted group-hover/ph:text-ink"}`}>{ph.credit && ph.credit !== "Lorem Picsum" ? ph.credit : ph.alt}</span>
                    </button>
                  );
                })}
                {!loadingPhotos && !photoErr && photos.length === 0 && <div className="col-span-3 py-8 text-center text-sm text-muted">No photos found.</div>}
              </div>
              <div className="border-t border-line/50 bg-surface-2/40 px-3.5 py-2 text-[0.6875rem] text-muted">
                {showKeyInput && !hasKey ? (
                  <div className="flex items-center gap-1.5">
                    <input value={keyInput} onChange={(e) => setKeyInput(e.target.value)} placeholder="Paste your Unsplash Access Key" aria-label="Unsplash access key"
                      onKeyDown={(e) => { if (e.key === "Enter") saveKey(); }} autoFocus
                      className="min-w-0 flex-1 rounded-md bg-surface px-2 py-1 text-ink outline-none ring-1 ring-line focus:ring-brand" />
                    <button type="button" onClick={saveKey} className="shrink-0 rounded-md bg-brand px-2 py-1 font-semibold text-brand-fg">Save</button>
                    <button type="button" onClick={() => setShowKeyInput(false)} aria-label="Cancel" className="shrink-0 text-muted hover:text-ink"><X className="h-3.5 w-3.5" /></button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span>{photos.length > 150 ? `Showing 150 of ${photos.length}` : `${photos.length} photos`} · {hasKey ? "Unsplash live search" : "free Unsplash"} · external URL</span>
                    {hasKey
                      ? <button type="button" onClick={() => { setUnsplashKey(""); setKeyVer((v) => v + 1); }} className="shrink-0 text-muted hover:text-red-500">Remove key</button>
                      : <button type="button" onClick={() => setShowKeyInput(true)} className="shrink-0 font-semibold text-brand hover:underline">+ Add key for millions</button>}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="grid min-h-0 flex-1 grid-cols-3 gap-x-2.5 gap-y-3 overflow-y-auto px-3.5 py-2.5 [scrollbar-width:thin]">
                <button type="button" title="No background" aria-label="No background" onClick={() => { onClear(); setOpen(false); }}
                  className="group/sw flex flex-col gap-1.5 text-center outline-none">
                  <span className={`flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-xl border border-dashed transition-all group-hover/sw:-translate-y-0.5 ${!current ? "border-brand bg-brand/10 text-brand" : "border-line text-muted group-hover/sw:border-brand/50 group-hover/sw:text-brand"}`}>
                    <X className="h-4 w-4" />
                  </span>
                  <span className="truncate text-[0.6875rem] font-medium text-muted">None</span>
                </button>
                {results.map((p) => {
                  const sel = p.css === value;
                  return (
                    <button key={p.id} type="button" title={p.label} aria-label={p.label} aria-pressed={sel}
                      onClick={() => { onSelect(p); setOpen(false); }}
                      className="group/sw flex flex-col gap-1.5 text-center outline-none">
                      <span className={`relative aspect-[4/3] overflow-hidden rounded-xl border shadow-sm transition-all duration-150 group-hover/sw:-translate-y-0.5 group-hover/sw:shadow-lg ${sel ? "border-brand ring-2 ring-brand/60 ring-offset-2 ring-offset-surface" : "border-line/60 group-hover/sw:border-brand/50"}`}>
                        <span aria-hidden className="absolute inset-0" style={bgPreviewStyle(p)} />
                        <span aria-hidden className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/5" />
                        {sel && <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-brand text-brand-fg shadow-md"><Check className="h-3 w-3" /></span>}
                      </span>
                      <span className={`truncate text-[0.6875rem] font-medium transition-colors ${sel ? "text-brand" : "text-muted group-hover/sw:text-ink"}`}>{p.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-line/50 bg-surface-2/40 px-3.5 py-2 text-[0.6875rem] text-muted">
                {results.length === 0 ? "No backgrounds match — try another word." : `${results.length} background${results.length === 1 ? "" : "s"} · pure CSS, exports self-contained`}
              </div>
            </>
          )}
        </div>, document.body)}
    </>
  );
}
