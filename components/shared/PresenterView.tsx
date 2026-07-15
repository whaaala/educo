"use client";

/**
 * PresenterView — the reusable "presenter's screen" for any slide-based surface.
 *
 * Shows the CURRENT slide large, a NEXT-slide preview, the speaker NOTES, an elapsed TIMER + a
 * wall clock, and prev/next controls — the Google-Slides presenter layout. It is decoupled from
 * how a slide is drawn: the host passes a `renderSlide(index)` function, so the presentation
 * editor, a lesson player, a webinar mode, etc. all reuse this one component.
 *
 * Keyboard: →/Space/PageDown next · ←/PageUp prev · Home/End first/last · Esc end.
 */

import React from "react";
import { ChevronLeft, ChevronRight, X, Play, Pause, RotateCcw, Minus, Plus } from "lucide-react";
import { formatElapsed, formatClock } from "@/lib/presenter/timer";

export interface PresenterSlide {
  id: string;
  notes?: string;
}

export interface PresenterViewProps {
  slides: PresenterSlide[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  onEnd?: () => void;
  /** Host-supplied slide renderer (keeps this component editor-agnostic). */
  renderSlide: (index: number) => React.ReactNode;
  /** Aspect ratio of a slide (default 16:9). */
  aspect?: { w: number; h: number };
  title?: string;
}

export default function PresenterView({
  slides, currentIndex, onNavigate, onEnd, renderSlide, aspect = { w: 16, h: 9 }, title,
}: PresenterViewProps) {
  const total = slides.length;
  const clamp = (i: number) => Math.max(0, Math.min(total - 1, i));
  const goNext = React.useCallback(() => onNavigate(clamp(currentIndex + 1)), [currentIndex, onNavigate, total]);
  const goPrev = React.useCallback(() => onNavigate(clamp(currentIndex - 1)), [currentIndex, onNavigate, total]);

  // ── timer + clock ──
  const [running, setRunning] = React.useState(true);
  const [elapsed, setElapsed] = React.useState(0); // ms
  const [now, setNow] = React.useState<Date | null>(null);
  const startRef = React.useRef<number>(0);
  const baseRef = React.useRef<number>(0); // accumulated ms before the current run

  React.useEffect(() => {
    setNow(new Date());
    startRef.current = Date.now();
    const id = setInterval(() => {
      setNow(new Date());
      if (running) setElapsed(baseRef.current + (Date.now() - startRef.current));
    }, 500);
    return () => clearInterval(id);
  }, [running]);

  const toggleTimer = () => {
    if (running) { baseRef.current += Date.now() - startRef.current; setRunning(false); }
    else { startRef.current = Date.now(); setRunning(true); }
  };
  const resetTimer = () => { baseRef.current = 0; startRef.current = Date.now(); setElapsed(0); };

  // ── notes font sizing ──
  const [notesSize, setNotesSize] = React.useState(20);

  // ── keyboard ──
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); goNext(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); goPrev(); }
      else if (e.key === "Home") { e.preventDefault(); onNavigate(0); }
      else if (e.key === "End") { e.preventDefault(); onNavigate(total - 1); }
      else if (e.key === "Escape") { e.preventDefault(); onEnd?.(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, onNavigate, onEnd, total]);

  const hasNext = currentIndex < total - 1;
  const notes = slides[currentIndex]?.notes?.trim();
  const ar = `${aspect.w}/${aspect.h}`;

  return (
    <div data-presenter-view className="fixed inset-0 z-[100000] flex flex-col bg-[#0b0e14] text-white select-none">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[13px] font-semibold text-white/90 truncate">{title || "Presenter view"}</span>
          <span className="text-[11px] text-white/40">Slide {currentIndex + 1} of {total}</span>
        </div>
        <button onClick={onEnd} aria-label="Exit presenter view"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[12px] font-medium transition-colors cursor-pointer">
          <X className="w-3.5 h-3.5" /> Exit
        </button>
      </div>

      <div className="flex-1 flex min-h-0 gap-4 p-4">
        {/* Left: current slide + controls */}
        <div className="flex flex-col flex-[1.6] min-w-0">
          <div className="flex-1 flex items-center justify-center min-h-0">
            <div className="w-full max-h-full rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-white"
              style={{ aspectRatio: ar, maxWidth: "min(100%, calc((100vh - 200px) * " + aspect.w / aspect.h + "))" }}>
              {renderSlide(currentIndex)}
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 pt-4">
            <button onClick={goPrev} disabled={currentIndex === 0} aria-label="Previous slide"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-[13px] tabular-nums text-white/70 min-w-[70px] text-center">{currentIndex + 1} / {total}</span>
            <button onClick={goNext} disabled={!hasNext} aria-label="Next slide"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right: next preview + timer + notes */}
        <div className="flex flex-col flex-1 min-w-0 gap-4">
          {/* Timer + clock */}
          <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
            <div className="flex flex-col">
              <span className="text-[26px] font-bold tabular-nums leading-none" aria-label="Elapsed time">{formatElapsed(elapsed)}</span>
              <span className="text-[11px] text-white/40 mt-1">{now ? formatClock(now) : ""}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={toggleTimer} aria-label={running ? "Pause timer" : "Resume timer"}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button onClick={resetTimer} aria-label="Reset timer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Next slide preview */}
          <div>
            <div className="text-[11px] uppercase tracking-wide text-white/40 mb-1.5">{hasNext ? "Next" : "End of deck"}</div>
            <div className="rounded-lg overflow-hidden ring-1 ring-white/10 bg-white" style={{ aspectRatio: ar }}>
              {hasNext ? renderSlide(currentIndex + 1) : (
                <div className="w-full h-full flex items-center justify-center bg-[#11151d] text-white/30 text-[12px]">Last slide</div>
              )}
            </div>
          </div>

          {/* Speaker notes */}
          <div className="flex-1 flex flex-col min-h-0 rounded-xl bg-white/5">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
              <span className="text-[11px] uppercase tracking-wide text-white/40">Speaker notes</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setNotesSize(s => Math.max(12, s - 2))} aria-label="Smaller notes text"
                  className="inline-flex items-center justify-center w-6 h-6 rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"><Minus className="w-3.5 h-3.5" /></button>
                <button onClick={() => setNotesSize(s => Math.min(40, s + 2))} aria-label="Larger notes text"
                  className="inline-flex items-center justify-center w-6 h-6 rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 leading-relaxed whitespace-pre-wrap text-white/90"
              style={{ fontSize: notesSize }}>
              {notes || <span className="text-white/30">No notes for this slide.</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
