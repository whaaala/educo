"use client";

import { useState } from "react";
import DocEditor, { type DocEditorValue } from "@/components/shared/DocEditor/DocEditor";

export default function DocEditorTestPage() {
  const [doc, setDoc] = useState<DocEditorValue>({
    title: "Untitled document",
    html: "",
    language: "en",
  });

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-3">
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">
            Doc Editor Test
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-200/60 purple:text-pink-200/60">
            Use the toolbar + templates, then confirm the HTML updates below.
          </p>
        </div>

        <DocEditor value={doc} onChange={setDoc} />

        <div className="mt-6">
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 mb-2">
            Saved HTML preview
          </div>
          <pre className="whitespace-pre-wrap break-words bg-gray-50 dark:bg-gray-950 midnight:bg-[#0b1220] purple:bg-[#170a27] p-3 rounded-lg border border-gray-200 dark:border-gray-800 midnight:border-cyan-500/10 purple:border-pink-500/10 text-[11px] text-gray-600 dark:text-gray-300 overflow-auto max-h-[240px]">
            {doc.html}
          </pre>
        </div>
      </div>
    </div>
  );
}

