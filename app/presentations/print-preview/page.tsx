"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PrintPreview from "@/components/shared/PrintPreview";
import { slideStorage } from "@/lib/slide-storage";

export default function PresentationPrintPreviewPage() {
  const router = useRouter();
  const [slides, setSlides] = useState<{ id: string; content: string; notes?: string; background?: string }[]>([]);
  const [title, setTitle] = useState("");
  const [presId, setPresId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;
    setPresId(id);
    const pres = slideStorage.get(id);
    if (pres) {
      setSlides(pres.slides);
      setTitle(pres.title);
    }
  }, []);

  if (slides.length === 0) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PrintPreview
        type="presentation"
        title={title}
        slides={slides}
        onBack={() => {
          if (presId) router.push(`/presentations/editor?id=${presId}`);
          else router.push("/presentations");
        }}
      />
    </MainLayout>
  );
}
