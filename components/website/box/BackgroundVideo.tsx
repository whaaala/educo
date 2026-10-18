"use client";
/**
 * MS-5b · A BACKGROUND VIDEO, IN THE BUILDER (BATCH LE-5). Scenarios: tests/features/components/website/background-video.feature.
 *
 * `BackgroundVideoControls` is Background → Video in the Inspector: upload a video (kept in the media store, the page holds
 * `media:<hash>.<ext>`) or paste a link to the FILE; a poster is taken from the first frame unless you upload your own; a
 * tint over it; Remove. `CanvasBgVideo` draws it on the canvas with the published page's own classes and rules
 * (`bgVideoCss`), so the canvas and the Preview show the same thing.
 */
import { useEffect, useId, useRef, useState } from "react";
import { Film, ImagePlus, Upload } from "lucide-react";
import { bgVideoShade, bgVideoSrc, importPhoto, isMediaRef, isVideoFileUrl, tintFor, type BoxNode } from "@/lib/box-model";
import { mediaUrl, putMedia } from "@/lib/media-store";
import CompactField from "@/components/shared/CompactField";
import EducoColorField from "@/components/shared/EducoColorField";
import INSPECTOR from "@/config/inspector.json";
import { MEDIA } from "@/lib/educo-ui/layout";

const W = INSPECTOR.bgVideo;
const label = "text-[0.6875rem] font-semibold text-muted";
const pick = "w-full flex items-center justify-center gap-2 text-sm px-3 py-2 pointer-coarse:min-h-11 rounded-lg border border-dashed border-gray-300 dark:border-white/15 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-white/5 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500";

/**
 * The first frame of a video file, as a photo File for `importPhoto` — or null, never a throw and never a wait without end
 * (LE5-7: the video is already kept when this runs, so a poster that cannot be made must not lose the upload).
 */
export async function firstFrame(file: Blob, waitMs = 8000): Promise<File | null> {
  let url = "";
  const within = <T,>(p: Promise<T>) => Promise.race([p, new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), waitMs))]);
  try {
    url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.muted = true; v.playsInline = true; v.preload = "auto"; v.src = url;
    await within(new Promise<void>((resolve, reject) => { v.onloadeddata = () => resolve(); v.onerror = () => reject(new Error("decode")); }));
    await within(new Promise<void>((resolve) => { v.onseeked = () => resolve(); v.currentTime = Math.min(0.1, (v.duration || 1) / 2); }));
    const c = document.createElement("canvas");
    c.width = v.videoWidth; c.height = v.videoHeight;
    const ctx = c.getContext("2d");
    if (!ctx || !c.width) return null;
    ctx.drawImage(v, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) => c.toBlob(resolve, "image/jpeg", 0.85));
    return blob ? new File([blob], "poster.jpg", { type: "image/jpeg" }) : null;
  } catch {
    return null;
  } finally {
    if (url) URL.revokeObjectURL(url);
  }
}

export function BackgroundVideoControls({ node, onPatch }: { node: BoxNode; onPatch: (p: Partial<BoxNode>) => void }) {
  const videoRef = useRef<HTMLInputElement>(null);
  const posterRef = useRef<HTMLInputElement>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const problemId = useId();
  const has = !!bgVideoSrc(node);

  const upload = async (f: File) => {
    setBusy(true);
    setProblem(null);
    const kept = await putMedia(f);
    if ("error" in kept) { setProblem(kept.error); setBusy(false); return; }
    const frame = await firstFrame(f);
    const poster = frame ? (await importPhoto(frame)).src || undefined : undefined;
    onPatch({ bgVideo: kept.ref, bgVideoPoster: poster, ...tintFor(node) }); // LE5-14: a tint arrives with it
    setBusy(false);
  };
  const address = (v: string) => {
    const url = v.trim();
    if (!url) { setProblem(null); if (!isMediaRef(node.bgVideo)) onPatch({ bgVideo: undefined }); return; }
    if (!isVideoFileUrl(url)) { setProblem(W.notAFile); return; }
    setProblem(null);
    onPatch({ bgVideo: url, ...tintFor(node) });
  };

  return (
    <div className="space-y-1.5" role="group" aria-labelledby={`${problemId}-h`}>
      <span id={`${problemId}-h`} className={`${label} flex items-center gap-1.5`}><Film className="w-3.5 h-3.5" aria-hidden="true" /> {W.heading}</span>
      <button type="button" disabled={busy} onClick={() => videoRef.current?.click()} className={pick} aria-describedby={problem ? problemId : undefined}>
        <Upload className="w-3.5 h-3.5" aria-hidden="true" /> {busy ? W.saving : isMediaRef(node.bgVideo) ? W.replace : W.upload}
      </button>
      <input ref={videoRef} type="file" accept={MEDIA.videoTypes.join(",")} className="hidden" aria-label={W.upload}
        onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) void upload(f); }} />
      <CompactField draft label={W.address} ariaLabel={W.address} placeholder={isMediaRef(node.bgVideo) ? W.uploaded : W.addressPlaceholder}
        value={node.bgVideo && !isMediaRef(node.bgVideo) ? node.bgVideo : ""} onChange={address} />
      {problem && <p id={problemId} role="alert" className="text-[0.6875rem] text-red-600 dark:text-red-400 midnight:text-red-300 purple:text-red-300">{problem}</p>}
      {has && (
        <>
          <div className="flex items-center gap-2">
            {node.bgVideoPoster && <img src={node.bgVideoPoster} alt="" className="h-10 w-16 shrink-0 rounded object-cover" />}
            <button type="button" onClick={() => posterRef.current?.click()} className={pick}><ImagePlus className="w-3.5 h-3.5" aria-hidden="true" /> {W.poster}</button>
          </div>
          <input ref={posterRef} type="file" accept="image/*" className="hidden" aria-label={W.poster}
            onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ""; if (!f) return; const { src } = await importPhoto(f); if (src) onPatch({ bgVideoPoster: src }); }} />
          <p className="text-[0.625rem] text-muted">{W.posterHint}</p>
          {/* With a photo the tint already sits under "Tint over background"; a video alone needs it here */}
          {!node.bgImage && <EducoColorField label="Tint over background" ariaLabel="Tint over background" value={node.bgOverlay ?? ""} onChange={(c) => onPatch({ bgOverlay: c })} onClear={() => onPatch({ bgOverlay: undefined })} />}
          <button type="button" onClick={() => { setProblem(null); onPatch({ bgVideo: undefined, bgVideoPoster: undefined }); }} className="text-[0.6875rem] text-red-600 dark:text-red-400 midnight:text-red-300 purple:text-red-300 hover:underline">{W.remove}</button>
        </>
      )}
    </div>
  );
}

/**
 * The video on the canvas: the published markup's own classes, so `bgVideoCss` lays it out the same. It plays (muted) unless
 * the person building asked for less motion; the Play / Pause disc is drawn but inert here — on the canvas a click selects.
 */
export function CanvasBgVideo({ node }: { node: BoxNode }) {
  const src = bgVideoSrc(node);
  const [url, setUrl] = useState<string | null>(null);
  const [still, setStill] = useState(false);
  useEffect(() => { setStill(typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  useEffect(() => {
    let live = true;
    setUrl(null);
    if (node.bgVideo && src) void mediaUrl(node.bgVideo).then((u) => { if (live) setUrl(u); });
    return () => { live = false; };
  }, [node.bgVideo, src]);
  if (!src) return null;
  const shade = bgVideoShade(node);
  return (
    <>
      <video className="eu-bgvideo" data-canvas-bgvideo muted loop playsInline autoPlay={!still} preload="auto" aria-hidden="true" tabIndex={-1}
        poster={node.bgVideoPoster} src={url ?? undefined} />
      {shade && <span className="eu-bgvideo__shade" aria-hidden="true" style={{ background: shade }} />}
      <span className="eu-bgvideo__toggle" aria-hidden="true" style={{ display: "grid", placeItems: "center", pointerEvents: "none" }}>{still ? "▶" : "❚❚"}</span>
    </>
  );
}
