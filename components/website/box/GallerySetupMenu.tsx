"use client";

/**
 * "Add a photo gallery" — the guided setup behind the Photo gallery tile.
 *
 * WHY A TILE AND NOT A COMPONENT. What a gallery needs from being a "component" is three things: a name in
 * the palette you would actually search for, a question asked before it lands, and arriving finished rather
 * than as twelve empty cells. This popup provides all three. What it deliberately does NOT take on is a
 * component's flat `ComponentItem` content shape — title, body, one `media` URL, no `BoxNode` anywhere —
 * which would mean a gallery cell could never be a box you design, and would switch the twelve-column grid
 * off inside the gallery along with spans, offsets, order, per-cell resize and Row heights. So the result is
 * an ordinary grid of ordinary cells; this screen only removes the TYPING.
 *
 * The same popup opens from a click on the tile AND from dropping it on the page — the rule this area
 * already learned the hard way: a drop says WHERE something goes, never WHAT it is.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { importPhoto } from "@/lib/box-model";
import { PICKER_COLUMNS, type GalleryPhoto } from "@/lib/box-presets";
import type { PagerNav } from "@/lib/box-model";
import { PortalMenu } from "./ui";
import Slider from "@/components/shared/Slider";
import type { MenuAnchor } from "./GridLayoutMenu";

export const GALLERY_MENU_WIDTH = 300;

/** The across-counts worth offering: the divisors of twelve, minus the ones nobody builds a gallery from. */
const ACROSS = PICKER_COLUMNS.filter((c) => c >= 2 && c <= 6);

/** A file name, turned into the start of an alt text. Never a sentence — a hint the user can improve. */
const altFromName = (name: string) =>
  name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();

/**
 * The three tiles this one screen serves. They ask for the SAME thing — photographs — and differ only in
 * what is done with them, so they are one component with three shapes rather than three that drift.
 *   • `gallery` — all of them at once, in a grid
 *   • `slider`  — one at a time, swiped
 *   • `hero`    — one at a time, full screen, with words over each
 */
export type GallerySetupMode = "gallery" | "slider" | "hero" | "still";

const MODE_COPY: Record<GallerySetupMode, { title: string; add: (n: number) => string }> = {
  gallery: { title: "Add a photo gallery", add: (n) => `Add gallery of ${n}` },
  slider: { title: "Add a slider", add: (n) => `Add slider of ${n}` },
  hero: { title: "Add a rotating hero", add: (n) => `Add hero of ${n}` },
  still: { title: "Add a hero", add: () => "Add hero" },
};

export default function GallerySetupMenu({ anchor, onClose, onPick, mode = "gallery" }: {
  anchor: MenuAnchor;
  onClose: () => void;
  onPick: (photos: GalleryPhoto[], opts: { across: number; stagger: boolean; gap: number; nav: PagerNav; auto: number; headline: string }) => void;
  mode?: GallerySetupMode;
}) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [busy, setBusy] = useState(0);
  const [across, setAcross] = useState(3);
  const [stagger, setStagger] = useState(false);
  const [gap, setGap] = useState(0); // spacing is a decision, never a default — it starts at nothing
  const [nav, setNav] = useState<PagerNav>("dots");
  const [auto, setAuto] = useState(0); // movement nobody asked for is what this most easily gets wrong
  const [headline, setHeadline] = useState("Welcome to our school");
  const paged = mode === "slider" || mode === "hero";   // has pages to move between
  const still = mode === "still";                        // one photograph, one sentence, no pages
  const fileRef = useRef<HTMLInputElement>(null);
  // A slow import must not write into an unmounted popup (Escape while ten photographs are decoding).
  //
  // IT MUST BE SET ON THE WAY IN, NOT ONLY CLEARED ON THE WAY OUT. React runs effects twice in development
  // — mount, cleanup, mount — so a ref initialised once at `useRef(true)` and only ever set to `false` by
  // the cleanup is false for the whole life of the component. Every import then returned early and not a
  // single photograph appeared, with no error anywhere to say why. Caught in a browser, never in a type.
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);

  const addFiles = useCallback(async (files: FileList | null) => {
    if (!files?.length) return;
    const chosen = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!chosen.length) return;
    setBusy((n) => n + chosen.length);
    // ONE AT A TIME, not Promise.all: every import decodes a full-size photograph onto a canvas, and ten of
    // those at once on a school laptop is where the tab stops responding. Each one appears as it lands, so
    // the wait is visible rather than a frozen dialog.
    for (const file of chosen) {
      const { src, imgW, imgH } = await importPhoto(file);
      if (!alive.current) return;
      setBusy((n) => n - 1);
      if (src) setPhotos((prev) => [...prev, { src, imgW, imgH, alt: altFromName(file.name) }]);
    }
  }, []);

  const remove = (i: number) => setPhotos((prev) => prev.filter((_, n) => n !== i));
  const rows = Math.max(1, Math.ceil(photos.length / across));

  return (
    <PortalMenu anchor={anchor} onClose={onClose} width={GALLERY_MENU_WIDTH} ariaLabel={MODE_COPY[mode].title}>
      <div className="p-2">
        <p className="px-0.5 pb-2 text-[0.8125rem] font-semibold text-ink">{MODE_COPY[mode].title}</p>

        {/* ── 1 · the photographs, chosen in ONE go ─────────────────────────────────────────────────
            The single biggest thing this screen exists for. Adding twelve photographs by hand is twelve
            drags and twelve separate file dialogs, because the Image block's own input takes one file. */}
        <input
          ref={fileRef} type="file" accept="image/*" multiple className="hidden"
          aria-label="Choose photos for the gallery"
          onChange={(e) => { void addFiles(e.target.files); e.target.value = ""; }}
        />
        <button
          type="button" onClick={() => fileRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line px-3 py-4 text-xs text-muted hover:border-brand hover:text-brand"
        >
          <ImagePlus className="h-5 w-5" aria-hidden="true" />
          <span className="font-medium">{photos.length ? "Add more photos" : "Choose photos"}</span>
          <span className="text-[0.625rem]">You can pick many at once</span>
        </button>

        {(photos.length > 0 || busy > 0) && (
          <div className="mt-2">
            <div className="flex items-center justify-between px-0.5 pb-1 text-[0.625rem] text-muted">
              <span>{photos.length} photo{photos.length === 1 ? "" : "s"}{still ? "" : paged ? " · one at a time" : ` · ${across} across · ${rows} row${rows === 1 ? "" : "s"}`}</span>
              {busy > 0 && (
                <span className="inline-flex items-center gap-1" role="status">
                  <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                  adding {busy}…
                </span>
              )}
            </div>
            <ul className="flex max-h-24 flex-wrap gap-1 overflow-y-auto">
              {photos.map((p, i) => (
                <li key={`${i}-${p.src.slice(-16)}`} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element -- a data: URL the user just chose; the Image optimiser cannot fetch it */}
                  <img src={p.src} alt="" className="h-10 w-10 rounded object-cover" />
                  <button
                    type="button" onClick={() => remove(i)}
                    aria-label={`Remove photo ${i + 1}${p.alt ? ` — ${p.alt}` : ""}`}
                    className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-ink text-[0.5rem] text-white opacity-0 focus-visible:opacity-100 group-hover:opacity-100 hover:opacity-100"
                  ><X className="h-2.5 w-2.5" aria-hidden="true" /></button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {still ? null : paged ? (<>
        {/* ── The pager's own two questions. A slider and a rotating hero differ from a gallery only in
               what happens to the photographs, so everything above this line is shared. ── */}
        <fieldset className="mt-3">
          <legend className="px-0.5 pb-1 text-[0.625rem] font-medium uppercase tracking-wide text-muted">Moving between them</legend>
          <div className="grid grid-cols-4 gap-1" role="group">
            {(["dots", "arrows", "both", "none"] as const).map((k) => (
              <button
                key={k} type="button" onClick={() => setNav(k)} aria-pressed={nav === k}
                aria-label={`Move between them with ${k}`}
                className={`rounded-lg border px-1 py-1.5 text-[0.625rem] font-semibold capitalize ${nav === k ? "border-brand bg-brand/10 text-brand" : "border-line text-muted hover:border-brand/50"}`}
              >{k}</button>
            ))}
          </div>
        </fieldset>
        <div className="mt-3">
          <Slider label="Move on its own every" value={auto} min={0} max={15} onChange={setAuto} formatValue={(x) => (x ? `${x}s` : "off")} />
          <p className="mt-0.5 text-[0.5625rem] leading-snug text-muted">
            {auto ? "Pauses while somebody hovers or reads it with a keyboard, and never moves for a visitor who asked for less motion." : "Off — it only moves when a visitor moves it."}
          </p>
        </div>
        {false && (
          <label className="mt-3 block">
            <span className="px-0.5 text-[0.625rem] font-medium uppercase tracking-wide text-muted">Headline</span>
            <input
              value={headline} onChange={(e) => setHeadline(e.target.value)}
              aria-label="Headline over the first photo"
              className="mt-1 w-full rounded-lg border border-line bg-surface px-2 py-1.5 text-xs text-ink"
            />
            <span className="mt-0.5 block text-[0.5625rem] leading-snug text-muted">Goes over the first photo. Every page is an ordinary box, so you edit the rest on the canvas.</span>
          </label>
        )}
        </>) : (<>
        {/* ── 2 · how many across ────────────────────────────────────────────────────────────────── */}
        <fieldset className="mt-3">
          <legend className="px-0.5 pb-1 text-[0.625rem] font-medium uppercase tracking-wide text-muted">How many across</legend>
          <div className="flex gap-1" role="group">
            {ACROSS.map((n) => (
              <button
                key={n} type="button" onClick={() => setAcross(n)} aria-pressed={across === n}
                aria-label={`${n} photos across`}
                className={`flex flex-1 flex-col items-center gap-1 rounded-lg border px-1 py-1.5 text-[0.625rem] font-semibold ${across === n ? "border-brand bg-brand/10 text-brand" : "border-line text-muted hover:border-brand/50"}`}
              >
                <span className="flex w-full gap-px" aria-hidden="true">
                  {Array.from({ length: n }, (_, k) => <span key={k} className="h-2.5 flex-1 rounded-[1px] bg-current opacity-60" />)}
                </span>
                {n}
              </button>
            ))}
          </div>
        </fieldset>

        {/* ── 3 · row heights — the masonry choice, shown rather than named ──────────────────────── */}
        <fieldset className="mt-3">
          <legend className="px-0.5 pb-1 text-[0.625rem] font-medium uppercase tracking-wide text-muted">Row heights</legend>
          <div className="grid grid-cols-2 gap-1.5" role="group">
            {([
              { on: false, label: "Even", hint: "Tidy rows", bars: [10, 10, 10, 10, 10, 10] },
              { on: true, label: "Follow the picture", hint: "Never cropped", bars: [14, 8, 11, 9, 13, 7] },
            ] as const).map((opt) => (
              <button
                key={opt.label} type="button" onClick={() => setStagger(opt.on)} aria-pressed={stagger === opt.on}
                className={`rounded-lg border p-1.5 text-left ${stagger === opt.on ? "border-brand bg-brand/10" : "border-line hover:border-brand/50"}`}
              >
                <span className="flex h-8 items-start gap-px" aria-hidden="true">
                  {opt.bars.map((h, k) => <span key={k} className="flex-1 rounded-[1px] bg-brand/50" style={{ height: `${h * 2}px` }} />)}
                </span>
                <span className="mt-1 block text-[0.625rem] font-semibold text-ink">{opt.label}</span>
                <span className="block text-[0.5625rem] text-muted">{opt.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* ── 4 · spacing — shown here so whatever arrives is what was chosen ────────────────────── */}
        <div className="mt-3">
          <Slider label="Space between" value={gap} min={0} max={48} onChange={setGap} formatValue={(x) => (x ? `${(x / 10).toFixed(1)}rem` : "none")} />
        </div>
        </>)}

        {(mode === "hero" || still) && (
          <label className="mt-3 block">
            <span className="px-0.5 text-[0.625rem] font-medium uppercase tracking-wide text-muted">Headline</span>
            <input
              value={headline} onChange={(e) => setHeadline(e.target.value)}
              aria-label="Headline over the photo"
              className="mt-1 w-full rounded-lg border border-line bg-surface px-2 py-1.5 text-xs text-ink"
            />
            <span className="mt-0.5 block text-[0.5625rem] leading-snug text-muted">
              {still
                ? "Over the photograph. The words are an ordinary heading — restyle or move them like any other block."
                : "Over the first photo. Every page is an ordinary box, so you edit the rest on the canvas."}
            </span>
          </label>
        )}
        {still && photos.length > 1 && (
          <p className="mt-2 text-[0.5625rem] leading-snug text-muted">A hero shows one photograph — the first will be used.</p>
        )}
        <button
          type="button"
          disabled={!photos.length}
          onClick={() => { onPick(photos, { across, stagger, gap, nav, auto, headline }); onClose(); }}
          className="mt-3 w-full rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >{photos.length ? MODE_COPY[mode].add(photos.length) : "Choose photos first"}</button>
      </div>
    </PortalMenu>
  );
}
