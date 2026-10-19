"use client";
/**
 * ASK FOR A NAME (BATCH LE-15): "Save as my section", "Make global", "Save page as template" each name what they keep.
 * The shared Modal (focus in and back, Escape), FormInput and Button — never `prompt()` (CLAUDE.md). Enter saves; a blank
 * name cannot be saved; `error` says why a save was refused (the limit).
 */
import { useEffect, useState } from "react";
import Modal from "@/components/shared/Modal";
import FormInput from "@/components/shared/FormInput";
import Button from "@/components/shared/Button";

export default function NameDialog({ open, title, label, start = "", confirm, error, onCancel, onConfirm }: {
  open: boolean; title: string; label: string; start?: string; confirm: string; error?: string;
  onCancel: () => void; onConfirm: (name: string) => void;
}) {
  const [name, setName] = useState(start);
  useEffect(() => { if (open) setName(start); }, [open, start]);
  const ok = name.trim().length > 0;
  return (
    <Modal isOpen={open} onClose={onCancel} title={title} maxWidth="md"
      footer={<div className="flex justify-end gap-2"><Button variant="secondary" onClick={onCancel}>Cancel</Button><Button variant="primary" disabled={!ok} onClick={() => ok && onConfirm(name.trim())}>{confirm}</Button></div>}>
      <form onSubmit={(e) => { e.preventDefault(); if (ok) onConfirm(name.trim()); }}>
        <FormInput label={label} value={name} onChange={setName} required error={error} />
      </form>
    </Modal>
  );
}
