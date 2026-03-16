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
    html: [
      "<h2>Meeting notes</h2>",
      "<p><strong>Date:</strong> </p>",
      "<p><strong>Attendees:</strong> </p>",
      "<h3>Agenda</h3>",
      "<ul><li></li></ul>",
      "<h3>Notes</h3>",
      "<ul><li></li></ul>",
      "<h3>Action items</h3>",
      '<ul><li><strong>Owner</strong> — </li></ul>',
    ].join(""),
  },
  {
    id: "email-draft",
    label: "Email draft",
    icon: Mail,
    html: [
      "<h2>Email draft</h2>",
      "<p><strong>To:</strong> </p>",
      "<p><strong>Subject:</strong> </p>",
      "<p>Hello,</p>",
      "<p></p>",
      "<p>Best regards,</p>",
    ].join(""),
  },
];

export default function DocEditorTestPage() {
  const [doc, setDoc] = useState<DocEditorValue>({
    title: "Untitled document",
    html: "",
    language: "en",
  });
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [docId, setDocId] = useState<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);

  // Load document on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

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
          // Create a new saved document
          const id = docStorage.create({ title, html, language });
          setDocId(id);
          setDoc({ title, html, language });
          // Update URL to reflect the new doc ID
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

  return (
    <MainLayout>
      <div className="-mt-4 -mx-4 lg:-mt-6 lg:-mx-8 -mb-4 lg:-mb-6 h-[calc(100vh-64px)] overflow-hidden">
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
