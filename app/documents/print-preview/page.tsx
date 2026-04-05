"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PrintPreview from "@/components/shared/PrintPreview";
import { docStorage } from "@/lib/doc-storage";

export default function DocPrintPreviewPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [html, setHtml] = useState("");
  const [docId, setDocId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;
    setDocId(id);
    const doc = docStorage.get(id);
    if (doc) {
      setTitle(doc.title);
      setHtml(doc.html);
    }
  }, []);

  if (!html && !docId) {
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
        type="document"
        title={title}
        html={html}
        onBack={() => {
          if (docId) router.push(`/doc-editor-test?id=${docId}`);
          else router.push("/documents");
        }}
      />
    </MainLayout>
  );
}
