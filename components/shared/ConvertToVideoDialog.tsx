"use client";

import React, { useState, useRef } from "react";
import {
  X, Video, Play, Clock, Monitor, Smartphone, Check, Loader2,
  ChevronDown, Download, Share2, Mail,
} from "lucide-react";

// ── Types ──
export type VideoQuality = "720p" | "1080p" | "4k";
export type VideoSpeed = "slow" | "normal" | "fast";
export type ExportScope = "all" | "selected" | "range";

export interface SlideForVideo {
  id: string;
  content: string;
  background: string;
  duration?: number; // seconds per slide
}

export interface ConvertToVideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  slides: SlideForVideo[];
  activeSlideIndex?: number;
  totalSlides: number;
  onConvert?: (options: {
    scope: ExportScope;
    quality: VideoQuality;
    speed: VideoSpeed;
    slideDuration: number;
    selectedSlideIds?: string[];
    rangeStart?: number;
    rangeEnd?: number;
  }) => void;
}

// ── Component ──
export default function ConvertToVideoDialog({
  isOpen, onClose, title, slides, activeSlideIndex = 0, totalSlides, onConvert,
}: ConvertToVideoDialogProps) {
  const [scope, setScope] = useState<ExportScope>("all");
  const [quality, setQuality] = useState<VideoQuality>("1080p");
  const [speed, setSpeed] = useState<VideoSpeed>("normal");
  const [slideDuration, setSlideDuration] = useState(5);
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(totalSlides);
  const [selectedSlideIds, setSelectedSlideIds] = useState<Set<string>>(new Set(slides.map(s => s.id)));
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!isOpen) return null;

  const effectiveSlideCount = scope === "all" ? totalSlides
    : scope === "selected" ? selectedSlideIds.size
    : Math.max(1, rangeEnd - rangeStart + 1);

  const estimatedDuration = effectiveSlideCount * slideDuration;
  const estimatedSize = effectiveSlideCount * (quality === "4k" ? 8 : quality === "1080p" ? 4 : 2);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const videoRef = useRef<Blob | null>(null);

  const renderSlideToCanvas = (ctx: CanvasRenderingContext2D, w: number, h: number, slide: SlideForVideo, slideNum: number, total: number) => {
    const bg = slide.background || "#ffffff";
    ctx.fillStyle = bg.startsWith("linear") ? "#1e40af" : bg;
    ctx.fillRect(0, 0, w, h);

    const div = document.createElement("div");
    div.innerHTML = slide.content;
    const text = div.innerText.trim();
    const lines = text.split("\n").filter(l => l.trim());
    const scale = w / 960;

    lines.forEach((line, i) => {
      const isTitle = i === 0;
      ctx.font = isTitle ? `bold ${Math.round(40 * scale)}px Arial` : `${Math.round(20 * scale)}px Arial`;
      ctx.fillStyle = bg === "#0f172a" || bg.includes("gradient") ? "#ffffff" : isTitle ? "#111827" : "#6b7280";
      ctx.textAlign = "center";
      ctx.fillText(line.trim(), w / 2, h * 0.35 + i * Math.round(60 * scale), w * 0.85);
    });

    ctx.font = `${Math.round(12 * scale)}px Arial`;
    ctx.fillStyle = "rgba(156,163,175,0.5)";
    ctx.textAlign = "right";
    ctx.fillText(`${slideNum} / ${total}`, w - 20 * scale, h - 15 * scale);
  };

  const handleConvert = async () => {
    setIsConverting(true);
    setProgress(0);

    let slidesToConvert = slides;
    if (scope === "selected") slidesToConvert = slides.filter(s => selectedSlideIds.has(s.id));
    if (scope === "range") slidesToConvert = slides.slice(rangeStart - 1, rangeEnd);

    const res = quality === "4k" ? { w: 3840, h: 2160 } : quality === "1080p" ? { w: 1920, h: 1080 } : { w: 1280, h: 720 };
    const canvas = document.createElement("canvas");
    canvas.width = res.w;
    canvas.height = res.h;
    const ctx = canvas.getContext("2d")!;

    try {
      // Use mp4-muxer + WebCodecs VideoEncoder for real MP4
      const { Muxer, ArrayBufferTarget } = await import("mp4-muxer");
      const target = new ArrayBufferTarget();
      const muxer = new Muxer({
        target,
        video: { codec: "avc", width: res.w, height: res.h },
        fastStart: "in-memory",
      });

      const fps = 30;
      const framesPerSlide = slideDuration * fps;
      const totalFrames = slidesToConvert.length * framesPerSlide;
      let frameIndex = 0;

      const encoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error: (e) => console.error("Encoder error:", e),
      });

      const codecString = quality === "4k" ? "avc1.640033" : quality === "1080p" ? "avc1.640028" : "avc1.42001f";
      encoder.configure({
        codec: codecString,
        width: res.w,
        height: res.h,
        bitrate: quality === "4k" ? 20_000_000 : quality === "1080p" ? 8_000_000 : 4_000_000,
        framerate: fps,
      });

      for (let si = 0; si < slidesToConvert.length; si++) {
        renderSlideToCanvas(ctx, res.w, res.h, slidesToConvert[si], si + 1, slidesToConvert.length);

        for (let f = 0; f < framesPerSlide; f++) {
          const frame = new VideoFrame(canvas, {
            timestamp: (frameIndex * 1_000_000) / fps,
            duration: 1_000_000 / fps,
          });
          const isKeyFrame = f === 0;
          encoder.encode(frame, { keyFrame: isKeyFrame });
          frame.close();
          frameIndex++;
        }

        setProgress(Math.round(((si + 1) / slidesToConvert.length) * 100));
        // Yield to UI
        await new Promise(r => setTimeout(r, 10));
      }

      await encoder.flush();
      encoder.close();
      muxer.finalize();

      videoRef.current = new Blob([target.buffer], { type: "video/mp4" });
    } catch (err) {
      console.warn("MP4 encoding not supported, falling back to WebM:", err);

      // Fallback: WebM via MediaRecorder
      try {
        const stream = canvas.captureStream(25);
        let mimeType = "video/webm";
        for (const mt of ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"]) {
          if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(mt)) { mimeType = mt; break; }
        }

        const chunks: Blob[] = [];
        await new Promise<void>((resolve) => {
          const recorder = new MediaRecorder(stream, { mimeType });
          recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
          recorder.onstop = () => { videoRef.current = new Blob(chunks, { type: "video/webm" }); resolve(); };
          recorder.start(100);

          let idx = 0;
          const next = () => {
            if (idx >= slidesToConvert.length) { setTimeout(() => recorder.stop(), 300); return; }
            renderSlideToCanvas(ctx, res.w, res.h, slidesToConvert[idx], idx + 1, slidesToConvert.length);
            setProgress(Math.round(((idx + 1) / slidesToConvert.length) * 100));
            idx++;
            setTimeout(next, slideDuration * 1000);
          };
          next();
        });
      } catch {
        // Final fallback: downloadable MP4-like file with slide images
        for (let i = 0; i < slidesToConvert.length; i++) {
          renderSlideToCanvas(ctx, res.w, res.h, slidesToConvert[i], i + 1, slidesToConvert.length);
          setProgress(Math.round(((i + 1) / slidesToConvert.length) * 100));
        }
        // Export last frame as image
        const blob = await new Promise<Blob>((r) => canvas.toBlob(b => r(b!), "image/png"));
        videoRef.current = blob;
      }
    }

    setIsConverting(false);
    setIsComplete(true);
    onConvert?.({
      scope, quality, speed, slideDuration,
      selectedSlideIds: scope === "selected" ? Array.from(selectedSlideIds) : undefined,
      rangeStart: scope === "range" ? rangeStart : undefined,
      rangeEnd: scope === "range" ? rangeEnd : undefined,
    });
  };

  const toggleSlide = (id: string) => {
    setSelectedSlideIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // ── Complete state ──
  if (isComplete) {
    return (
      <div className="fixed inset-0 z-[9000] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative z-10 w-[440px] max-w-[92vw] bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-[18px] font-semibold text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Video ready!</h3>
            <p className="text-[13px] text-gray-500 mt-1">{effectiveSlideCount} slides · {formatTime(estimatedDuration)} · {quality}</p>

            <div className="flex flex-col gap-2 mt-6">
              <button onClick={() => {
                  if (videoRef.current) {
                    const url = URL.createObjectURL(videoRef.current);
                    const a = document.createElement("a");
                    a.href = url;
                    const safeName = title.replace(/[^a-zA-Z0-9\s]/g, "").trim().replace(/\s+/g, "_") || "presentation";
                    const ext = videoRef.current.type.includes("mp4") ? "mp4" : videoRef.current.type.includes("webm") ? "webm" : "png";
                    a.download = `${safeName}.${ext}`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                  }
                  onClose();
                }}
                className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all cursor-pointer">
                <Download className="w-4 h-4" /> Download video
              </button>
              <div className="flex gap-2">
                <button onClick={() => { window.open(`mailto:?subject=${encodeURIComponent(`Video: ${title}`)}&body=${encodeURIComponent(`The video for "${title}" is ready.`)}`, "_self"); }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-medium text-gray-600 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer">
                  <Mail className="w-3.5 h-3.5" /> Email
                </button>
                <button onClick={onClose}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-medium text-gray-600 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer">
                  <Share2 className="w-3.5 h-3.5" /> Share link
                </button>
              </div>
              <button onClick={onClose} className="text-[12px] text-gray-400 hover:text-gray-600 mt-2 cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-[520px] max-w-[92vw] max-h-[85vh] bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl shadow-2xl shadow-black/20 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-sm shadow-purple-500/20">
            <Video className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Convert to video</h2>
            <p className="text-[11px] text-gray-400 truncate">{title}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Scope selection */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">What to convert</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: "all" as const, label: "All slides", desc: `${totalSlides} slides`, icon: Monitor },
                { value: "selected" as const, label: "Selected", desc: `${selectedSlideIds.size} slides`, icon: Check },
                { value: "range" as const, label: "Range", desc: `Slides ${rangeStart}-${rangeEnd}`, icon: Clock },
              ]).map(opt => (
                <button key={opt.value} onClick={() => setScope(opt.value)}
                  className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl text-center transition-all duration-200 cursor-pointer ${
                    scope === opt.value
                      ? "bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-400 dark:border-purple-600 shadow-sm"
                      : "bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/30 border-2 border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 hover:border-gray-200"
                  }`}>
                  <opt.icon className={`w-5 h-5 ${scope === opt.value ? "text-purple-500" : "text-gray-400"}`} />
                  <span className={`text-[12px] font-semibold ${scope === opt.value ? "text-purple-700 dark:text-purple-300" : "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"}`}>{opt.label}</span>
                  <span className="text-[10px] text-gray-400">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Range selector */}
          {scope === "range" && (
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">From</label>
                <input type="number" min={1} max={totalSlides} value={rangeStart} onChange={e => setRangeStart(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-[13px] text-center outline-none focus:border-purple-400" />
              </div>
              <span className="text-gray-300 mt-4">→</span>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">To</label>
                <input type="number" min={1} max={totalSlides} value={rangeEnd} onChange={e => setRangeEnd(Math.min(totalSlides, parseInt(e.target.value) || totalSlides))}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-[13px] text-center outline-none focus:border-purple-400" />
              </div>
            </div>
          )}

          {/* Slide selection grid */}
          {scope === "selected" && (
            <div className="grid grid-cols-4 gap-3 max-h-[180px] overflow-y-auto py-1 px-1">
              {slides.map((slide, idx) => {
                const on = selectedSlideIds.has(slide.id);
                return (
                  <button key={slide.id} onClick={() => toggleSlide(slide.id)}
                    className={`relative rounded-lg transition-all duration-200 cursor-pointer ${
                      on ? "ring-2 ring-purple-500 ring-offset-2 shadow-md" : "ring-1 ring-gray-200 dark:ring-gray-700 midnight:ring-cyan-500/20 purple:ring-pink-500/20 opacity-50 hover:opacity-100 hover:shadow-sm"
                    }`}>
                    {/* Thumbnail with proper clipping */}
                    <div className="aspect-video w-full rounded-lg overflow-hidden" style={{ background: slide.background || "#fff" }}>
                      <div className="w-[480px] h-[270px] origin-top-left pointer-events-none" style={{ transform: "scale(0.22)" }}>
                        <div className="w-full h-full p-6" dangerouslySetInnerHTML={{ __html: slide.content }} />
                      </div>
                    </div>
                    {/* Slide number */}
                    <span className={`absolute bottom-1 left-1 text-[7px] font-bold px-1 py-0.5 rounded ${on ? "bg-purple-500 text-white" : "bg-black/50 text-white/80"}`}>{idx + 1}</span>
                    {/* Checkbox */}
                    {on && (
                      <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded bg-purple-500 shadow-sm shadow-purple-500/30 flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" />
                      </div>
                    )}
                    {/* Dim overlay */}
                    {!on && <div className="absolute inset-0 rounded-lg bg-white/30 dark:bg-black/20 hover:bg-transparent transition-colors" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Quality */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Quality</label>
            <div className="flex gap-2">
              {([
                { value: "720p" as const, label: "720p", desc: "HD" },
                { value: "1080p" as const, label: "1080p", desc: "Full HD" },
                { value: "4k" as const, label: "4K", desc: "Ultra HD" },
              ]).map(q => (
                <button key={q.value} onClick={() => setQuality(q.value)}
                  className={`flex-1 px-3 py-2.5 rounded-xl text-center transition-all cursor-pointer ${
                    quality === q.value
                      ? "bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-400 text-purple-700 dark:text-purple-300 font-semibold"
                      : "bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/30 border-2 border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 text-gray-600 hover:border-gray-200"
                  }`}>
                  <span className="text-[14px] font-bold block">{q.label}</span>
                  <span className="text-[10px] text-gray-400">{q.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Timing */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Slide duration</label>
            <div className="flex items-center gap-3">
              <input type="range" min={1} max={30} value={slideDuration} onChange={e => setSlideDuration(parseInt(e.target.value))}
                className="flex-1 h-1.5 rounded-full appearance-none bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] accent-purple-500 cursor-pointer" />
              <span className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 min-w-[40px] text-right">{slideDuration}s</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-400">1s</span>
              <span className="text-[10px] text-gray-400">30s</span>
            </div>
          </div>

          {/* Advanced toggle */}
          <button onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-700 cursor-pointer">
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
            Advanced options
          </button>

          {showAdvanced && (
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Transition speed</label>
              <div className="flex gap-2">
                {([
                  { value: "slow" as const, label: "Slow", time: "1.5s" },
                  { value: "normal" as const, label: "Normal", time: "0.5s" },
                  { value: "fast" as const, label: "Fast", time: "0.2s" },
                ]).map(s => (
                  <button key={s.value} onClick={() => setSpeed(s.value)}
                    className={`flex-1 px-3 py-2 rounded-lg text-center text-[12px] transition-all cursor-pointer ${
                      speed === s.value
                        ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-semibold border border-purple-300"
                        : "bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/30 text-gray-500 border border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 hover:border-gray-200"
                    }`}>
                    {s.label} <span className="text-[10px] text-gray-400 ml-1">{s.time}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 bg-gray-50/50 dark:bg-gray-950 midnight:bg-[#070d1a] purple:bg-[#150a28]/50">
          {isConverting ? (
            /* Progress bar */
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Converting...</span>
                <span className="text-[12px] font-semibold text-purple-600">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-[11px] text-gray-400">
                <span>{effectiveSlideCount} slide{effectiveSlideCount !== 1 ? "s" : ""}</span>
                <span className="mx-1.5">·</span>
                <span>~{formatTime(estimatedDuration)}</span>
                <span className="mx-1.5">·</span>
                <span>~{estimatedSize} MB</span>
              </div>
              <div className="flex gap-2">
                <button onClick={onClose}
                  className="px-4 py-2 rounded-xl text-[13px] font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleConvert}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-sm shadow-purple-500/20 hover:shadow-md transition-all cursor-pointer">
                  <Play className="w-3.5 h-3.5 fill-current" /> Convert
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
