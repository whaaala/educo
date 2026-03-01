"use client";

import { useState, useEffect } from "react";
import { FileText, Mail } from "lucide-react";
import DocEditor, { type DocEditorValue, type DocTemplate } from "@/components/shared/DocEditor/DocEditor";

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

  // Load copied or shared document from localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Handle "Make a copy" — opens copy in new tab
    if (params.get("copy") === "true") {
      const copyData = localStorage.getItem("educo_doc_pending_copy");
      if (copyData) {
        localStorage.removeItem("educo_doc_pending_copy");
        try {
          const parsed = JSON.parse(copyData) as DocEditorValue;
          setDoc({
            title: parsed.title || "Untitled document",
            html: parsed.html || "",
            language: parsed.language || "en",
          });
        } catch { /* ignore invalid data */ }
      }
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }

    // Handle shared document — load by ID with permission enforcement
    const sharedId = params.get("shared");
    if (sharedId) {
      try {
        const sharedDocs = JSON.parse(
          localStorage.getItem("educo_shared_documents") || "[]"
        );
        const sharedDoc = sharedDocs.find(
          (d: { id: string }) => d.id === sharedId
        );
        if (sharedDoc) {
          setDoc({
            title: sharedDoc.title || "Untitled document",
            html: sharedDoc.html || "",
            language: sharedDoc.language || "en",
          });
          // Enforce permission: viewer = read-only, editor = full edit
          if (sharedDoc.role === "viewer") {
            setIsReadOnly(true);
          }
        }
      } catch { /* ignore invalid data */ }
      // Keep ?shared= in the URL so the link stays valid on refresh
    }
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <DocEditor
        value={doc}
        onChange={setDoc}
        templates={defaultTemplates}
        readOnly={isReadOnly}
      />
      {/* Hidden HTML output for E2E tests */}
      <pre data-testid="html-output" className="hidden">{doc.html}</pre>
    </div>
  );
}
