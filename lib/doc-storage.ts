/**
 * Document storage layer — persists documents to localStorage.
 * Used by both the Documents home page and the DocEditor.
 */

export interface StoredDocument {
  id: string;
  title: string;
  html: string;
  language: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  starred: boolean;
}

const STORAGE_KEY = "educo_documents";

function getAll(): StoredDocument[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveAll(docs: StoredDocument[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

export const docStorage = {
  /** Get all saved documents, sorted by updatedAt descending */
  list(): StoredDocument[] {
    return getAll().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  /** Get a single document by ID */
  get(id: string): StoredDocument | null {
    return getAll().find(d => d.id === id) || null;
  },

  /** Create a new document and return its ID */
  create(data: { title?: string; html?: string; language?: string }): string {
    const docs = getAll();
    const id = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();
    docs.push({
      id,
      title: data.title || "Untitled document",
      html: data.html || "",
      language: data.language || "en",
      owner: "Me",
      createdAt: now,
      updatedAt: now,
      starred: false,
    });
    saveAll(docs);
    return id;
  },

  /** Update an existing document */
  update(id: string, data: Partial<Pick<StoredDocument, "title" | "html" | "language">>) {
    const docs = getAll();
    const idx = docs.findIndex(d => d.id === id);
    if (idx === -1) return;
    if (data.title !== undefined) docs[idx].title = data.title;
    if (data.html !== undefined) docs[idx].html = data.html;
    if (data.language !== undefined) docs[idx].language = data.language;
    docs[idx].updatedAt = new Date().toISOString();
    saveAll(docs);
  },

  /** Toggle star on a document */
  toggleStar(id: string) {
    const docs = getAll();
    const idx = docs.findIndex(d => d.id === id);
    if (idx === -1) return;
    docs[idx].starred = !docs[idx].starred;
    saveAll(docs);
  },

  /** Delete a document */
  remove(id: string) {
    saveAll(getAll().filter(d => d.id !== id));
  },
};
