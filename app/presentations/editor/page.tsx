"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import MainLayout from "@/components/layout/MainLayout";
import type { SlideEditorValue } from "@/components/shared/SlideEditor/SlideEditor";
import { slideStorage } from "@/lib/slide-storage";

// Dynamic import to avoid SSR issues with contentEditable
const SlideEditor = dynamic(() => import("@/components/shared/SlideEditor/SlideEditor"), { ssr: false });

export default function PresentationEditorPage() {
  const [pres, setPres] = useState<SlideEditorValue | null>(null);
  const [presId, setPresId] = useState<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");

      if (id) {
        const saved = slideStorage.get(id);
        if (saved) {
          setPresId(id);
          setPres({ title: saved.title, slides: saved.slides, theme: saved.theme });
          setReady(true);
          return;
        }
      }

      // New blank presentation
      const newId = slideStorage.create({});
      setPresId(newId);
      const created = slideStorage.get(newId);
      if (created) {
        setPres({ title: created.title, slides: created.slides, theme: created.theme });
      }
      setReady(true);
      window.history.replaceState({}, "", `/presentations/editor?id=${newId}`);
    } catch (err) {
      console.error("Failed to load presentation:", err);
      // Fallback: create a minimal presentation
      setPres({
        title: "Untitled presentation",
        slides: [{ id: "s1", content: '<h1 style="text-align:center;font-size:36px;margin-top:120px;">New Presentation</h1>', notes: "", background: "#ffffff", transition: "fade" }],
        theme: "default",
      });
      setReady(true);
    }
  }, []);

  const handleChange = useCallback((value: SlideEditorValue) => {
    setPres(value);
    if (!presId) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      slideStorage.update(presId, { title: value.title, slides: value.slides, theme: value.theme });
    }, 1000);
  }, [presId]);

  if (!pres || !ready) {
    return (
      <MainLayout immersive>
        <div className="-mt-4 -mx-4 lg:-mt-6 lg:-mx-8 -mb-4 lg:-mb-6 h-[calc(100vh-64px)] flex items-center justify-center">
          <div className="text-gray-400 text-[13px]">Loading presentation...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout immersive>
      <div className="-mt-4 -mx-4 lg:-mt-6 lg:-mx-8 -mb-4 lg:-mb-6 h-[calc(100vh-64px)] print:!m-0 print:!h-auto print:!overflow-visible">
        <SlideEditor value={pres} onChange={handleChange} />
      </div>
    </MainLayout>
  );
}
