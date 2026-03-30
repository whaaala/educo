"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { slideStorage, type SlideData } from "@/lib/slide-storage";
import {
  X, Printer, Download, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Minus, Eye, EyeOff, Landscape,
} from "lucide-react";

export default function PrintPreviewPage() {
  const router = useRouter();
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [title, setTitle] = useState("Untitled presentation");
  const [theme, setTheme] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(80);
  const [showBackground, setShowBackground] = useState(true);
  const [layout, setLayout] = useState<"landscape" | "portrait">("landscape");
  const [slidesPerPage, setSlidesPerPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;
    const pres = slideStorage.get(id);
    if (pres) {
      setSlides(pres.slides);
      setTitle(pres.title);
      setTheme(pres.theme);
    }
  }, []);

  const totalPages = Math.ceil(slides.length / slidesPerPage);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print(); // Browser "Save as PDF" from print dialog
  };

  const handleClose = () => {
    router.back();
  };

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>Loading presentation...</p>
      </div>
    );
  }

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @page { size: ${layout}; margin: 0; }
        @media print {
          .print-toolbar { display: none !important; }
          .print-slide-container { break-after: page; padding: 0 !important; margin: 0 !important; }
          .print-slide-container:last-child { break-after: avoid; }
          .print-slide { width: 100vw !important; height: 100vh !important; display: flex !important; align-items: center !important; justify-content: center !important; }
          .print-slide * { color-adjust: exact !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { margin: 0; background: white; }
        }
        @media screen {
          .print-slide-container { margin: 0 auto 24px; }
        }
      `}</style>

      <div className="min-h-screen bg-[#525659] flex flex-col">
        {/* Toolbar */}
        <div className="print-toolbar bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
          {/* Close */}
          <button onClick={handleClose}
            className="flex items-center gap-1.5 text-[13px] text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
            Close preview
          </button>

          <div className="w-px h-6 bg-gray-200" />

          {/* Slides per page */}
          <select
            value={slidesPerPage}
            onChange={e => setSlidesPerPage(Number(e.target.value))}
            className="text-[12px] text-gray-700 border border-gray-300 rounded-md px-2 py-1 cursor-pointer"
          >
            <option value={1}>1 slide per page</option>
            <option value={2}>2 slides per page</option>
            <option value={4}>4 slides per page</option>
            <option value={6}>6 slides per page</option>
          </select>

          {/* Layout */}
          <select
            value={layout}
            onChange={e => setLayout(e.target.value as "landscape" | "portrait")}
            className="text-[12px] text-gray-700 border border-gray-300 rounded-md px-2 py-1 cursor-pointer"
          >
            <option value="landscape">Landscape</option>
            <option value="portrait">Portrait</option>
          </select>

          {/* Background toggle */}
          <button onClick={() => setShowBackground(!showBackground)}
            className="flex items-center gap-1 text-[12px] text-gray-600 hover:text-gray-800 px-2 py-1 rounded-md hover:bg-gray-100 cursor-pointer">
            {showBackground ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {showBackground ? "Hide background" : "Show background"}
          </button>

          <div className="flex-1" />

          {/* Download as PDF */}
          <button onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 text-[12px] text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            Download as PDF
          </button>

          {/* Print */}
          <button onClick={handlePrint}
            className="flex items-center gap-1.5 text-[12px] text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-md font-medium cursor-pointer">
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>

        {/* Slide preview area */}
        <div className="flex-1 overflow-auto py-8 px-4">
          {slides.map((slide, i) => (
            <div key={slide.id} className="print-slide-container">
              <div
                className="print-slide bg-white shadow-lg mx-auto"
                style={{
                  width: `${Math.min(900, 900 * zoom / 100)}px`,
                  aspectRatio: layout === "landscape" ? "16/9" : "9/16",
                  background: showBackground ? (slide.background || "#ffffff") : "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <div
                  className="w-full h-full px-[8%] py-[6%] overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: slide.content }}
                />
                {/* Slide number */}
                <div className="absolute bottom-2 right-3 text-[10px] text-gray-400 print:hidden">
                  {i + 1}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom status bar */}
        <div className="print-toolbar bg-[#3c4043] text-white px-4 py-2 flex items-center justify-center gap-4 sticky bottom-0">
          {/* Page navigation */}
          <span className="text-[12px] text-gray-300">Page</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={e => setCurrentPage(Math.max(1, Math.min(totalPages, Number(e.target.value))))}
            className="w-10 text-center text-[12px] bg-[#5f6368] text-white rounded px-1 py-0.5 border-none"
          />
          <span className="text-[12px] text-gray-300">/ {totalPages}</span>

          <div className="w-px h-4 bg-gray-600" />

          {/* Zoom */}
          <button onClick={() => setZoom(z => Math.max(30, z - 10))} className="text-gray-300 hover:text-white cursor-pointer">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[12px] text-gray-300 min-w-[36px] text-center">{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="text-gray-300 hover:text-white cursor-pointer">
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
