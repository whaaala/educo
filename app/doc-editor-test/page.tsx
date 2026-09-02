"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FileText, Mail } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import DocEditor, { type DocEditorValue, type DocTemplate } from "@/components/shared/DocEditor/DocEditor";
import { docStorage } from "@/lib/doc-storage";

const defaultTemplates: DocTemplate[] = [
  {
    id: "meeting-notes",
    label: "Meeting notes",
    icon: FileText,
    html: '<h2>Meeting notes</h2><p><strong>Date:</strong> </p><p><strong>Attendees:</strong> </p><h3>Agenda</h3><ul><li></li></ul><h3>Notes</h3><ul><li></li></ul><h3>Action items</h3><ul><li><strong>Owner</strong> — </li></ul>',
  },
  {
    id: "email-draft",
    label: "Email draft",
    icon: Mail,
    html: '<h2>Email draft</h2><p><strong>To:</strong> </p><p><strong>Subject:</strong> </p><p>Hello,</p><p></p><p>Best regards,</p>',
  },
];

export default function DocEditorTestPage() {
  const [doc, setDoc] = useState<DocEditorValue | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [docId, setDocId] = useState<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load document on mount — doc stays null until loaded
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Handle "Make a copy" or template injection
    if (params.get("copy") === "true") {
      const copyData = localStorage.getItem("educo_doc_pending_copy");
      if (copyData) {
        localStorage.removeItem("educo_doc_pending_copy");
        try {
          const parsed = JSON.parse(copyData) as DocEditorValue;
          const title = parsed.title || "Untitled document";
          const html = parsed.html || "";
          const language = parsed.language || "en";
          const id = docStorage.create({ title, html, language });
          setDocId(id);
          setDoc({ title, html, language });
          window.history.replaceState({}, "", `/doc-editor-test?id=${id}`);
        } catch { /* ignore */ }
      }
      return;
    }

    // Load existing document by ID
    const id = params.get("id") || params.get("doc");
    if (id) {
      const saved = docStorage.get(id);
      if (saved) {
        setDocId(id);
        setDoc({ title: saved.title, html: saved.html, language: saved.language });
        return;
      }
    }

    // Handle shared document
    const sharedId = params.get("shared");
    if (sharedId) {
      try {
        const sharedDocs = JSON.parse(localStorage.getItem("educo_shared_documents") || "[]");
        const sharedDoc = sharedDocs.find((d: { id: string }) => d.id === sharedId);
        if (sharedDoc) {
          setDoc({
            title: sharedDoc.title || "Untitled document",
            html: sharedDoc.html || "",
            language: sharedDoc.language || "en",
          });
          if (sharedDoc.role === "viewer") setIsReadOnly(true);
        }
      } catch { /* ignore */ }
      return;
    }

    // No ID — create a new blank document
    const newId = docStorage.create({ title: "Untitled document", html: "", language: "en" });
    setDocId(newId);
    setDoc({ title: "Untitled document", html: "", language: "en" });
    window.history.replaceState({}, "", `/doc-editor-test?id=${newId}`);
  }, []);

  // Auto-save on changes (debounced 1s)
  const handleChange = useCallback((value: DocEditorValue) => {
    setDoc(value);
    if (!docId) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      docStorage.update(docId, {
        title: value.title,
        html: value.html,
        language: value.language,
      });
    }, 1000);
  }, [docId]);

  // Don't render the editor until the doc is loaded — this prevents the editor
  // from initializing with empty content and overwriting the saved document
  if (!doc) {
    return (
      <MainLayout immersive>
        <div className="-mt-4 -mx-4 lg:-mt-6 lg:-mx-8 -mb-4 lg:-mb-6 h-[calc(100vh-64px)] flex items-center justify-center">
          <div className="text-gray-400 text-[0.8125rem]">Loading document...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout immersive>
      <div className="-mt-4 -mx-4 lg:-mt-6 lg:-mx-8 -mb-4 lg:-mb-6 h-[calc(100vh-64px)] overflow-hidden print:!m-0 print:!h-auto print:!overflow-visible">
        <DocEditor
          value={doc}
          onChange={handleChange}
          templates={defaultTemplates}
          readOnly={isReadOnly}
        />
      </div>
      <pre data-testid="html-output" className="hidden">{doc.html}</pre>
    </MainLayout>
  );
}
