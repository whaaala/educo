"use client";

/**
 * Shared Print Preview Component
 *
 * Used by both presentation and document print preview pages.
 * Context-aware: presentations show slide cards, documents show A4 pages.
 */

import { useState, useRef, useCallback } from "react";
import Button from "@/components/shared/Button";
import Tooltip from "@/components/shared/Tooltip";
import CustomDropdown from "@/components/shared/CustomDropdown";
import {
  Printer, Download, ArrowLeft, ZoomIn, ZoomOut,
  Eye, EyeOff, StickyNote, Loader2,
} from "lucide-react";

// ── Types ──

export interface SlideContent {
  id: string;
  content: string;
  notes?: string;
  background?: string;
}

export interface PrintPreviewProps {
  /** "presentation" shows slide cards, "document" shows A4 pages */
  type: "presentation" | "document";
  title: string;
  /** For presentations: array of slides */
  slides?: SlideContent[];
  /** For documents: HTML content */
  html?: string;
  /** Navigate back */
  onBack: () => void;
}

// ── Slide Card (presentations only) ──

function SlideCard({
  slide, index, layout, showBg, zoom, showNotes,
}: {
  slide: SlideContent; index: number; layout: string; showBg: boolean; zoom: number; showNotes: boolean;
}) {
  return (
    <div className="pp-slide-wrap flex justify-center" data-slide-index={index}>
      <div
        className="pp-slide-card bg-white shadow-lg rounded overflow-hidden relative transition-all duration-200"
        style={{
          width: `${Math.min(960, 960 * zoom / 100)}px`,
          aspectRatio: layout === "landscape" ? "16/9" : "9/16",
          background: showBg ? (slide.background || "#fff") : "#fff",
        }}
      >
        <div className="w-full h-full px-[8%] py-[6%] overflow-hidden flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: slide.content }} />
        <span className="pp-slide-num absolute bottom-2 right-3 text-[0.625rem] text-gray-400/70 tabular-nums">{index + 1}</span>
      </div>
      {showNotes && slide.notes && (
        <div className="ml-3 w-[220px] shrink-0 self-stretch bg-white/[0.06] backdrop-blur rounded-lg p-3 text-[0.6875rem] text-gray-400 leading-relaxed border border-white/10">
          <div className="flex items-center gap-1 text-[0.5625rem] uppercase tracking-wider text-gray-500 font-semibold mb-2">
            <StickyNote className="w-3 h-3" /> Notes
          </div>
          <p className="whitespace-pre-wrap">{slide.notes}</p>
        </div>
      )}
    </div>
  );
}

// ── Document Page (documents only) ──

function DocumentPage({ html, zoom, layout }: { html: string; zoom: number; layout: string }) {
  return (
    <div
      className="pp-doc-page bg-white shadow-lg rounded overflow-hidden transition-all duration-200"
      style={{
        width: `${Math.min(816, 816 * zoom / 100)}px`,
        minHeight: `${Math.min(1056, 1056 * zoom / 100)}px`,
        aspectRatio: layout === "portrait" ? "8.5/11" : "11/8.5",
      }}
    >
      <div
        className="w-full h-full px-[10%] py-[8%] text-[0.875rem] leading-relaxed text-gray-900"
        style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
        dangerouslySetInnerHTML={{ __html: html || "<p>&nbsp;</p>" }}
      />
    </div>
  );
}

// ── Download PDF Button ──

function DownloadPdfButton({ title, html, slides, type, layout }: {
  title: string; html: string; slides: SlideContent[]; type: string; layout: string;
}) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const orientation = layout === "landscape" ? "landscape" : "portrait";
      const doc = new jsPDF({ unit: "pt", format: "a4", orientation });
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 40;

      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-10000px";
      container.style.top = "0";
      container.style.width = `${Math.floor((pageW / 72) * 96)}px`;
      container.style.background = "white";
      container.style.color = "black";
      container.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      container.style.fontSize = "12pt";
      container.style.lineHeight = "1.5";

      if (type === "document") {
        container.innerHTML = html || "<p>&nbsp;</p>";
      } else {
        container.innerHTML = slides.map(s => `<div style="page-break-after:always;padding:40px;">${s.content}</div>`).join("");
      }

      document.body.appendChild(container);

      await doc.html(container, {
        x: margin, y: margin,
        width: pageW - margin * 2,
        windowWidth: container.scrollWidth,
        autoPaging: "text",
        html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
        // html2canvas/jsPDF hands the finished document back here.
        callback: (d: { output: (kind: string) => Blob; save: (name?: string) => void }) => {
          try {
            const blob = d.output("blob") as Blob;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${title || "document"}.pdf`;
            a.rel = "noopener";
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
          } catch {
            d.save(`${title || "document"}.pdf`);
          }
        },
      } as Parameters<typeof doc.html>[1]);

      container.remove();
    } catch {
      // Fallback to print dialog
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Tooltip content="Download as PDF file">
      <Button
        variant="outline"
        size="sm"
        icon={downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
        onClick={handleDownload}
        disabled={downloading}
        className="!rounded-full"
      >
        <span className="hidden sm:inline">{downloading ? "Preparing..." : "Download as PDF"}</span>
      </Button>
    </Tooltip>
  );
}

// ── Main Component ──

export default function PrintPreview({ type, title, slides = [], html = "", onBack }: PrintPreviewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(75);
  const [layout, setLayout] = useState<string>(type === "presentation" ? "landscape" : "portrait");
  const [showBg, setShowBg] = useState(true);
  const [notes, setNotes] = useState<string>("without");
  const [currentSlide, setCurrentSlide] = useState(1);

  const isPresentation = type === "presentation";

  // Filter empty slides
  const displaySlides = slides.filter(s => s.content.replace(/<[^>]*>/g, "").trim().length > 0);
  const finalSlides = displaySlides.length > 0 ? displaySlides : slides;

  // Track visible slide on scroll
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !isPresentation) return;
    const container = scrollRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setCurrentSlide(finalSlides.length);
      return;
    }
    const slideEls = container.querySelectorAll("[data-slide-index]");
    const viewCenter = scrollTop + clientHeight / 2;
    let closest = 0;
    let closestDist = Infinity;
    slideEls.forEach((el, i) => {
      const htmlEl = el as HTMLElement;
      const slideCenter = htmlEl.offsetTop + htmlEl.offsetHeight / 2;
      const dist = Math.abs(viewCenter - slideCenter);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    });
    setCurrentSlide(closest + 1);
  }, [isPresentation, finalSlides.length]);

  return (
    <>
      {/* Print styles */}
      <style>{`
        @page { size: ${layout}; margin: 0; }
        @media print {
          .pp-toolbar, .pp-statusbar, nav, header, aside, [role="complementary"], [role="banner"] { display: none !important; }
          body > div > div > aside, body > div > div > nav, body > div > div > header { display: none !important; }
          body > div > div > div:first-child { display: none !important; }
          main { padding: 0 !important; margin: 0 !important; max-width: none !important; position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; }
          .pp-preview { background: white !important; padding: 0 !important; gap: 0 !important; }
          .pp-slide-wrap, .pp-doc-page { break-after: page; width: 100vw !important; height: 100vh !important; display: flex !important; align-items: center !important; justify-content: center !important; padding: 0 !important; margin: 0 !important; }
          .pp-slide-wrap:last-child, .pp-doc-page:last-child { break-after: avoid; }
          .pp-slide-card, .pp-doc-page { width: 100vw !important; height: 100vh !important; max-width: none !important; box-shadow: none !important; border-radius: 0 !important; }
          .pp-slide-card *, .pp-doc-page * { color-adjust: exact !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .pp-slide-num { display: none !important; }
        }
      `}</style>

      <style>{`main { overflow: hidden !important; } body { overflow: hidden !important; }`}</style>

      <div className="flex flex-col -mx-6 -mt-6 -mb-6 overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
        {/* ── Toolbar ── */}
        <div className="pp-toolbar flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border-b border-gray-200 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 shrink-0 z-20">
          {/* Back */}
          <Tooltip content={`Back to ${isPresentation ? "presentation" : "document"} editor`}>
            <button onClick={onBack}
              className="flex items-center gap-1.5 text-[0.8125rem] text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium cursor-pointer transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{title || "Back"}</span>
            </button>
          </Tooltip>

          <div className="w-px h-5 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] mx-1" />

          {/* Slide count + notes dropdown (presentations only) */}
          {isPresentation && (
            <CustomDropdown
              value={notes}
              options={[
                { label: `${finalSlides.length} slide${finalSlides.length !== 1 ? "s" : ""} without notes`, value: "without" },
                { label: `${finalSlides.length} slide${finalSlides.length !== 1 ? "s" : ""} with notes`, value: "with" },
              ]}
              onChange={v => setNotes(String(v))}
            />
          )}

          {/* Orientation dropdown */}
          <CustomDropdown
            value={layout}
            options={[
              { label: "Landscape", value: "landscape" },
              { label: "Portrait", value: "portrait" },
            ]}
            onChange={v => setLayout(String(v))}
          />

          {/* Hide background toggle (presentations only) */}
          {isPresentation && (
            <Tooltip content={showBg ? "Hide slide backgrounds for printing" : "Show slide backgrounds"}>
              <button onClick={() => setShowBg(!showBg)}
                className={`flex items-center gap-1.5 text-[0.75rem] px-2.5 py-1.5 rounded-lg cursor-pointer transition-all ${
                  !showBg
                    ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 font-medium"
                    : "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"
                }`}>
                {showBg ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span className="hidden md:inline">{showBg ? "Hide background" : "Show background"}</span>
              </button>
            </Tooltip>
          )}

          <div className="flex-1" />

          {/* Download as PDF — generates and saves a PDF file */}
          <DownloadPdfButton title={title} html={html} slides={finalSlides} type={type} layout={layout} />

          {/* Print — opens browser print dialog */}
          <Tooltip content="Print">
            <Button
              size="sm"
              icon={<Printer className="w-3.5 h-3.5" />}
              onClick={() => window.print()}
              className="!rounded-full"
            >
              Print
            </Button>
          </Tooltip>
        </div>

        {/* ── Content ── */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="pp-preview flex-1 overflow-auto bg-[#525659] dark:bg-[#1a1a1a] py-6 px-4"
          style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}
        >
          {isPresentation ? (
            finalSlides.map((slide, i) => (
              <SlideCard
                key={slide.id}
                slide={slide}
                index={i}
                layout={layout}
                showBg={showBg}
                zoom={zoom}
                showNotes={notes === "with"}
              />
            ))
          ) : (
            <DocumentPage html={html} zoom={zoom} layout={layout} />
          )}
        </div>

        {/* ── Status bar ── */}
        <div className="pp-statusbar flex items-center justify-center gap-3 px-4 py-1.5 bg-[#3c4043] dark:bg-[#202124] shrink-0">
          {isPresentation && (
            <>
              <span className="text-[0.6875rem] text-gray-400">Slide</span>
              <span className="text-[0.75rem] text-white bg-white/10 px-2 py-0.5 rounded tabular-nums min-w-[28px] text-center">{currentSlide}</span>
              <span className="text-[0.6875rem] text-gray-400">of {finalSlides.length}</span>
              <div className="w-px h-3.5 bg-gray-600 mx-1" />
            </>
          )}

          <Tooltip content="Zoom out">
            <button onClick={() => setZoom(z => Math.max(30, z - 10))} className="text-gray-400 hover:text-white cursor-pointer transition-colors p-0.5">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
          <span className="text-[0.6875rem] text-gray-400 tabular-nums min-w-[32px] text-center">{zoom}%</span>
          <Tooltip content="Zoom in">
            <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="text-gray-400 hover:text-white cursor-pointer transition-colors p-0.5">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
