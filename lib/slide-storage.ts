/**
 * Slide presentation storage layer — persists presentations to localStorage.
 */

export interface SlideData {
  id: string;
  content: string; // HTML content for the slide
  notes: string;
  background: string; // CSS background value
  transition: "none" | "fade" | "dissolve" | "flip" | "cube";
}

export interface StoredPresentation {
  id: string;
  title: string;
  slides: SlideData[];
  theme: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  starred: boolean;
}

const STORAGE_KEY = "educo_presentations";

function getAll(): StoredPresentation[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}

function saveAll(items: StoredPresentation[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function makeSlide(content = "", bg = "#ffffff"): SlideData {
  return { id: `slide-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, content, notes: "", background: bg, transition: "fade" };
}

export const slideStorage = {
  list(): StoredPresentation[] {
    return getAll().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  get(id: string): StoredPresentation | null {
    return getAll().find(d => d.id === id) || null;
  },

  create(data: { title?: string; slides?: SlideData[]; theme?: string }): string {
    const items = getAll();
    const id = `pres-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();
    items.push({
      id,
      title: data.title || "Untitled presentation",
      slides: data.slides || [makeSlide('<h1 style="text-align:center;font-size:36px;margin-top:120px;">Untitled Presentation</h1><p style="text-align:center;color:#6b7280;font-size:18px;">Click to add subtitle</p>')],
      theme: data.theme || "default",
      owner: "Me",
      createdAt: now,
      updatedAt: now,
      starred: false,
    });
    saveAll(items);
    return id;
  },

  update(id: string, data: Partial<Pick<StoredPresentation, "title" | "slides" | "theme">>) {
    const items = getAll();
    const idx = items.findIndex(d => d.id === id);
    if (idx === -1) return;
    if (data.title !== undefined) items[idx].title = data.title;
    if (data.slides !== undefined) items[idx].slides = data.slides;
    if (data.theme !== undefined) items[idx].theme = data.theme;
    items[idx].updatedAt = new Date().toISOString();
    saveAll(items);
  },

  toggleStar(id: string) {
    const items = getAll();
    const idx = items.findIndex(d => d.id === id);
    if (idx === -1) return;
    items[idx].starred = !items[idx].starred;
    saveAll(items);
  },

  remove(id: string) {
    saveAll(getAll().filter(d => d.id !== id));
  },

  makeSlide,
};
