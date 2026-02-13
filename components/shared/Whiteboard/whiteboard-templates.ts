import type { WhiteboardElement } from "./whiteboard-types";

export type TemplateCategory =
  | "education"
  | "agile"
  | "strategy"
  | "meetings"
  | "brainstorming"
  | "design"
  | "diagrams"
  | "marketing"
  | "teambuilding";

export interface WhiteboardTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  elements: WhiteboardElement[];
}

let _uid = 0;
function uid() {
  return `tpl-${Date.now()}-${++_uid}`;
}

function rect(
  x: number,
  y: number,
  w: number,
  h: number,
  opts: Partial<WhiteboardElement> = {}
): WhiteboardElement {
  return {
    id: uid(),
    type: "rectangle",
    x,
    y,
    width: w,
    height: h,
    color: opts.color || "#374151",
    fillColor: opts.fillColor ?? "#f3f4f6",
    strokeWidth: opts.strokeWidth || 2,
    opacity: opts.opacity || 1,
    ...opts,
  };
}

function text(
  x: number,
  y: number,
  content: string,
  opts: Partial<WhiteboardElement> = {}
): WhiteboardElement {
  return {
    id: uid(),
    type: "text",
    x,
    y,
    text: content,
    color: opts.color || "#1f2937",
    strokeWidth: 1,
    opacity: 1,
    fontSize: opts.fontSize || 16,
    ...opts,
  };
}

function sticky(
  x: number,
  y: number,
  content: string,
  color = "#fef08a",
  opts: Partial<WhiteboardElement> = {}
): WhiteboardElement {
  return {
    id: uid(),
    type: "sticky",
    x,
    y,
    width: 180,
    height: 140,
    text: content,
    color: "#1f2937",
    stickyColor: color,
    strokeWidth: 1,
    opacity: 1,
    fontSize: 13,
    ...opts,
  };
}

function line(
  sx: number,
  sy: number,
  ex: number,
  ey: number,
  opts: Partial<WhiteboardElement> = {}
): WhiteboardElement {
  return {
    id: uid(),
    type: "line",
    startX: sx,
    startY: sy,
    endX: ex,
    endY: ey,
    color: opts.color || "#374151",
    strokeWidth: opts.strokeWidth || 2,
    opacity: 1,
    ...opts,
  };
}

function arrow(
  sx: number,
  sy: number,
  ex: number,
  ey: number,
  opts: Partial<WhiteboardElement> = {}
): WhiteboardElement {
  return {
    id: uid(),
    type: "arrow",
    startX: sx,
    startY: sy,
    endX: ex,
    endY: ey,
    color: opts.color || "#374151",
    strokeWidth: opts.strokeWidth || 2,
    opacity: 1,
    ...opts,
  };
}

function circle(
  x: number,
  y: number,
  w: number,
  h: number,
  opts: Partial<WhiteboardElement> = {}
): WhiteboardElement {
  return {
    id: uid(),
    type: "circle",
    x,
    y,
    width: w,
    height: h,
    color: opts.color || "#374151",
    fillColor: opts.fillColor ?? null,
    strokeWidth: opts.strokeWidth || 2,
    opacity: 1,
    ...opts,
  };
}

function diamond(
  x: number,
  y: number,
  w: number,
  h: number,
  opts: Partial<WhiteboardElement> = {}
): WhiteboardElement {
  return {
    id: uid(),
    type: "diamond",
    x,
    y,
    width: w,
    height: h,
    color: opts.color || "#374151",
    fillColor: opts.fillColor ?? "#f3f4f6",
    strokeWidth: opts.strokeWidth || 2,
    opacity: 1,
    ...opts,
  };
}

// ─── Meta-helpers (reduce code for common layouts) ───────

/** Column-based board layout (Kanban, Retro, Standup, etc.) */
function boardCols(
  title: string, titleColor: string,
  columns: { label: string; bg: string; sc?: string; st?: string }[],
  opts?: { colW?: number; colH?: number; gap?: number }
): WhiteboardElement[] {
  const colW = opts?.colW ?? 220, colH = opts?.colH ?? 380, gap = opts?.gap ?? 16;
  const x0 = 20, y0 = 70;
  const els: WhiteboardElement[] = [];
  els.push(text(x0, 20, title, { fontSize: 28, color: titleColor }));
  for (let i = 0; i < columns.length; i++) {
    const c = columns[i];
    const x = x0 + i * (colW + gap);
    els.push(rect(x, y0, colW, colH, { fillColor: c.bg, color: "#d1d5db" }));
    els.push(text(x + 16, y0 + 14, c.label, { fontSize: 16, color: "#374151" }));
    els.push(line(x + 10, y0 + 40, x + colW - 10, y0 + 40, { color: "#d1d5db" }));
    els.push(sticky(x + 20, y0 + 55, c.st || "Add notes...", c.sc || "#fef08a"));
  }
  return els;
}

/** Stacked sections layout (Lesson Plan, Agenda, etc.) */
function stackSections(
  title: string, titleColor: string,
  items: { label: string; h: number; bg: string }[],
  opts?: { w?: number }
): WhiteboardElement[] {
  const w = opts?.w ?? 700, x0 = 20;
  const els: WhiteboardElement[] = [];
  els.push(text(x0, 20, title, { fontSize: 28, color: titleColor }));
  let y = 70;
  for (const s of items) {
    els.push(rect(x0, y, w, s.h, { fillColor: s.bg, color: "#d1d5db" }));
    els.push(text(x0 + 12, y + 12, s.label, { fontSize: 16, color: "#374151" }));
    y += s.h + 10;
  }
  return els;
}

/** 2x2 quadrant grid (SWOT, Stakeholder Map, etc.) */
function quad(
  title: string, titleColor: string,
  labels: [string, string, string, string],
  colors: [string, string, string, string],
  tColors: [string, string, string, string],
  opts?: { cellW?: number; cellH?: number; xLabel?: string; yLabel?: string }
): WhiteboardElement[] {
  const cellW = opts?.cellW ?? 300, cellH = opts?.cellH ?? 250;
  const x0 = 20, y0 = 70;
  const els: WhiteboardElement[] = [];
  els.push(text(x0 + cellW - 50, 20, title, { fontSize: 28, color: titleColor }));
  if (opts?.xLabel) els.push(text(x0 + cellW - 20, y0 + cellH * 2 + 15, opts.xLabel, { fontSize: 14, color: "#6b7280" }));
  if (opts?.yLabel) els.push(text(x0 - 15, y0 - 20, opts.yLabel, { fontSize: 14, color: "#6b7280" }));
  for (let i = 0; i < 4; i++) {
    const col = i % 2, row = Math.floor(i / 2);
    const x = x0 + col * (cellW + 4), y = y0 + row * (cellH + 4);
    els.push(rect(x, y, cellW, cellH, { fillColor: colors[i], color: "#d1d5db" }));
    els.push(text(x + cellW / 2 - 50, y + 16, labels[i], { fontSize: 20, color: tColors[i] }));
    els.push(line(x + 10, y + 44, x + cellW - 10, y + 44, { color: "#d1d5db" }));
    els.push(sticky(x + 20, y + 60, "Add items...", "#fef08a", { width: 120, height: 80 }));
  }
  return els;
}

/** Sticky grid (icebreakers, brainwriting, etc.) */
function stickyGrid(
  title: string,
  titleColor: string,
  prompts: string[],
  opts?: { cols?: number; x0?: number; y0?: number; w?: number; h?: number; gap?: number; colors?: string[] }
): WhiteboardElement[] {
  const cols = opts?.cols ?? 3;
  const x0 = opts?.x0 ?? 20;
  const y0 = opts?.y0 ?? 90;
  const w = opts?.w ?? 180;
  const h = opts?.h ?? 140;
  const gap = opts?.gap ?? 14;
  const colors = opts?.colors ?? ["#fef08a", "#bbf7d0", "#bfdbfe", "#fecaca", "#e9d5ff", "#fed7aa"];

  const els: WhiteboardElement[] = [];
  els.push(text(x0, 20, title, { fontSize: 28, color: titleColor }));

  for (let i = 0; i < prompts.length; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const x = x0 + c * (w + gap);
    const y = y0 + r * (h + gap);
    els.push(sticky(x, y, prompts[i], colors[i % colors.length], { width: w, height: h, fontSize: 13 }));
  }
  return els;
}

/** Simple table grid (RACI, calendars, etc.) */
function tableGrid(
  title: string,
  titleColor: string,
  columns: string[],
  rows: string[],
  opts?: { x0?: number; y0?: number; cellW?: number; cellH?: number; headerFill?: string; rowFill?: string }
): WhiteboardElement[] {
  const x0 = opts?.x0 ?? 20;
  const y0 = opts?.y0 ?? 80;
  const cellW = opts?.cellW ?? 140;
  const cellH = opts?.cellH ?? 52;
  const headerFill = opts?.headerFill ?? "#e5e7eb";
  const rowFill = opts?.rowFill ?? "#ffffff";

  const els: WhiteboardElement[] = [];
  els.push(text(x0, 20, title, { fontSize: 28, color: titleColor }));

  // Header
  for (let c = 0; c < columns.length; c++) {
    const x = x0 + c * cellW;
    els.push(rect(x, y0, cellW, cellH, { fillColor: headerFill, color: "#9ca3af" }));
    els.push(text(x + 10, y0 + 18, columns[c], { fontSize: 12, color: "#374151" }));
  }

  // Rows
  for (let r = 0; r < rows.length; r++) {
    const y = y0 + cellH + r * cellH;
    for (let c = 0; c < columns.length; c++) {
      els.push(rect(x0 + c * cellW, y, cellW, cellH, { fillColor: rowFill, color: "#d1d5db" }));
    }
    // First column label
    els.push(text(x0 + 10, y + 18, rows[r], { fontSize: 12, color: "#374151" }));
  }
  return els;
}

// ─── Education Templates ─────────────────────────────────

function kwlChart(): WhiteboardElement[] {
  const w = 260, h = 350, gap = 20;
  const cols = ["#eff6ff", "#f0fdf4", "#fef2f2"];
  const headers = ["What I Know", "Want to Know", "What I Learned"];
  const els: WhiteboardElement[] = [];

  // Title
  els.push(text(gap, 20, "KWL Chart", { fontSize: 28, color: "#1e40af" }));

  for (let i = 0; i < 3; i++) {
    const x = gap + i * (w + gap);
    const y = 70;
    els.push(rect(x, y, w, h, { fillColor: cols[i], color: "#9ca3af" }));
    els.push(text(x + w / 2 - 60, y + 16, headers[i], { fontSize: 18, color: "#1f2937" }));
    els.push(line(x + 10, y + 44, x + w - 10, y + 44, { color: "#d1d5db" }));
  }
  return els;
}

function mindMap(): WhiteboardElement[] {
  const cx = 400, cy = 300, r = 70;
  const els: WhiteboardElement[] = [];

  // Central topic
  els.push(circle(cx - r, cy - r, r * 2, r * 2, { fillColor: "#eff6ff", color: "#3b82f6" }));
  els.push(text(cx - 45, cy - 10, "Main Topic", { fontSize: 16, color: "#1e40af" }));

  // Branches
  const branches = ["Subtopic 1", "Subtopic 2", "Subtopic 3", "Subtopic 4"];
  const angles = [-Math.PI / 4, Math.PI / 4, (3 * Math.PI) / 4, -(3 * Math.PI) / 4];
  const dist = 200;

  for (let i = 0; i < branches.length; i++) {
    const bx = cx + dist * Math.cos(angles[i]);
    const by = cy + dist * Math.sin(angles[i]);
    const bw = 120, bh = 50;
    els.push(arrow(cx + r * Math.cos(angles[i]), cy + r * Math.sin(angles[i]), bx, by, { color: "#3b82f6" }));
    els.push(rect(bx - bw / 2, by - bh / 2, bw, bh, { type: "rounded-rect" as WhiteboardElement["type"], fillColor: "#f0fdf4", color: "#22c55e", borderRadius: 12 }));
    els.push(text(bx - 45, by - 8, branches[i], { fontSize: 14, color: "#166534" }));
  }
  return els;
}

function vennDiagram(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  const r = 160;
  els.push(text(260, 30, "Venn Diagram", { fontSize: 28, color: "#7c3aed" }));
  els.push(circle(200, 120, r * 2, r * 2, { fillColor: "#eff6ff", color: "#3b82f6", opacity: 0.5 }));
  els.push(circle(340, 120, r * 2, r * 2, { fillColor: "#fef2f2", color: "#ef4444", opacity: 0.5 }));
  els.push(text(250, 200, "Group A", { fontSize: 18, color: "#1e40af" }));
  els.push(text(430, 200, "Group B", { fontSize: 18, color: "#dc2626" }));
  els.push(text(340, 200, "Both", { fontSize: 14, color: "#6b21a8" }));
  return els;
}

function lessonPlan(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  const w = 700, margin = 20;

  els.push(text(margin, 20, "Lesson Plan", { fontSize: 28, color: "#1e40af" }));

  const sections = [
    { label: "Objective", h: 60, color: "#eff6ff" },
    { label: "Materials", h: 60, color: "#f0fdf4" },
    { label: "Introduction (10 min)", h: 80, color: "#fefce8" },
    { label: "Main Activity (25 min)", h: 100, color: "#fff7ed" },
    { label: "Closing (5 min)", h: 60, color: "#f5f3ff" },
    { label: "Assessment", h: 60, color: "#fdf2f8" },
  ];

  let y = 70;
  for (const s of sections) {
    els.push(rect(margin, y, w, s.h, { fillColor: s.color, color: "#d1d5db" }));
    els.push(text(margin + 12, y + 12, s.label, { fontSize: 16, color: "#374151" }));
    y += s.h + 10;
  }
  return els;
}

function timeline(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  const y = 200, startX = 60, endX = 800;

  els.push(text(350, 30, "Timeline", { fontSize: 28, color: "#1e40af" }));
  els.push(arrow(startX, y, endX, y, { color: "#374151", strokeWidth: 3 }));

  const events = ["Event 1", "Event 2", "Event 3", "Event 4", "Event 5"];
  const spacing = (endX - startX - 60) / (events.length - 1);

  for (let i = 0; i < events.length; i++) {
    const x = startX + 30 + i * spacing;
    const above = i % 2 === 0;
    els.push(line(x, y - 8, x, y + 8, { color: "#374151", strokeWidth: 2 }));
    els.push(rect(x - 55, above ? y - 90 : y + 20, 110, 60, {
      fillColor: above ? "#eff6ff" : "#f0fdf4",
      color: above ? "#3b82f6" : "#22c55e",
      type: "rounded-rect" as WhiteboardElement["type"],
      borderRadius: 8,
    }));
    els.push(text(x - 40, above ? y - 70 : y + 40, events[i], { fontSize: 14 }));
    els.push(line(x, above ? y - 30 : y + 20, x, above ? y - 8 : y + 8, {
      color: "#9ca3af",
      strokeWidth: 1,
    }));
  }
  return els;
}

function rubric(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  const cellW = 160, cellH = 80, headerH = 40;
  const x0 = 20, y0 = 70;
  const criteria = ["Criteria 1", "Criteria 2", "Criteria 3"];
  const levels = ["Excellent", "Good", "Needs Work"];
  const colors = ["#f0fdf4", "#fefce8", "#fef2f2"];

  els.push(text(x0, 20, "Rubric", { fontSize: 28, color: "#1e40af" }));

  // Column headers
  els.push(rect(x0, y0, cellW, headerH, { fillColor: "#e5e7eb", color: "#9ca3af" }));
  els.push(text(x0 + 40, y0 + 12, "Criteria", { fontSize: 14, color: "#374151" }));
  for (let j = 0; j < levels.length; j++) {
    const lx = x0 + cellW + j * cellW;
    els.push(rect(lx, y0, cellW, headerH, { fillColor: "#e5e7eb", color: "#9ca3af" }));
    els.push(text(lx + 30, y0 + 12, levels[j], { fontSize: 14, color: "#374151" }));
  }

  // Rows
  for (let i = 0; i < criteria.length; i++) {
    const ry = y0 + headerH + i * cellH;
    els.push(rect(x0, ry, cellW, cellH, { fillColor: "#f9fafb", color: "#d1d5db" }));
    els.push(text(x0 + 20, ry + 30, criteria[i], { fontSize: 14 }));
    for (let j = 0; j < levels.length; j++) {
      els.push(rect(x0 + cellW + j * cellW, ry, cellW, cellH, { fillColor: colors[j], color: "#d1d5db" }));
    }
  }
  return els;
}

function cornellNotes(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  const x0 = 20, y0 = 70;
  const w = 760, h = 520;
  const cueW = 210;
  const summaryH = 140;

  els.push(text(x0, 20, "Cornell Notes", { fontSize: 28, color: "#1e40af" }));

  // Cue + Notes areas
  els.push(rect(x0, y0, cueW, h - summaryH - 10, { fillColor: "#fefce8", color: "#d1d5db" }));
  els.push(rect(x0 + cueW + 10, y0, w - cueW - 10, h - summaryH - 10, { fillColor: "#eff6ff", color: "#d1d5db" }));

  // Summary
  els.push(rect(x0, y0 + (h - summaryH), w, summaryH, { fillColor: "#f0fdf4", color: "#d1d5db" }));

  // Labels
  els.push(text(x0 + 12, y0 + 12, "Cues", { fontSize: 16, color: "#854d0e" }));
  els.push(text(x0 + cueW + 22, y0 + 12, "Notes", { fontSize: 16, color: "#1e40af" }));
  els.push(text(x0 + 12, y0 + (h - summaryH) + 12, "Summary", { fontSize: 16, color: "#166534" }));

  // Divider
  els.push(line(x0 + cueW + 5, y0, x0 + cueW + 5, y0 + (h - summaryH - 10), { color: "#e5e7eb" }));
  return els;
}

function conceptMapEdu(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  const cx = 420, cy = 260;
  els.push(text(20, 20, "Concept Map", { fontSize: 28, color: "#1e40af" }));

  // Center
  els.push(circle(cx - 70, cy - 70, 140, 140, { fillColor: "#f5f3ff", color: "#8b5cf6" }));
  els.push(text(cx - 42, cy - 8, "Main Idea", { fontSize: 16, color: "#7c3aed" }));

  const nodes = [
    { label: "Concept 1", x: cx - 320, y: cy - 140, c: "#eff6ff", sc: "#3b82f6", tc: "#1e40af" },
    { label: "Concept 2", x: cx + 180, y: cy - 140, c: "#f0fdf4", sc: "#22c55e", tc: "#166534" },
    { label: "Concept 3", x: cx - 320, y: cy + 120, c: "#fefce8", sc: "#eab308", tc: "#854d0e" },
    { label: "Concept 4", x: cx + 180, y: cy + 120, c: "#fdf2f8", sc: "#ec4899", tc: "#db2777" },
  ];

  for (const n of nodes) {
    const bw = 180, bh = 60;
    const bx = n.x, by = n.y;
    els.push(arrow(cx, cy, bx + bw / 2, by + bh / 2, { color: "#9ca3af", strokeWidth: 2 }));
    els.push(rect(bx, by, bw, bh, {
      type: "rounded-rect" as WhiteboardElement["type"],
      borderRadius: 12,
      fillColor: n.c,
      color: n.sc,
    }));
    els.push(text(bx + 44, by + 20, n.label, { fontSize: 14, color: n.tc }));

    // Subnodes (2)
    for (let i = 0; i < 2; i++) {
      const sx = bx + i * 95;
      const sy = by + 85;
      els.push(arrow(bx + bw / 2, by + bh, sx + 40, sy + 20, { color: "#d1d5db", strokeWidth: 2 }));
      els.push(rect(sx, sy, 85, 46, {
        type: "rounded-rect" as WhiteboardElement["type"],
        borderRadius: 10,
        fillColor: "#ffffff",
        color: "#e5e7eb",
      }));
      els.push(text(sx + 10, sy + 15, `Detail ${i + 1}`, { fontSize: 12, color: "#6b7280" }));
    }
  }

  return els;
}

function storyArc(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "Story Arc", { fontSize: 28, color: "#7c3aed" }));

  const stages = [
    { label: "Exposition", c: "#eff6ff", tc: "#1e40af" },
    { label: "Rising Action", c: "#f0fdf4", tc: "#166534" },
    { label: "Climax", c: "#fef2f2", tc: "#dc2626" },
    { label: "Falling Action", c: "#fefce8", tc: "#854d0e" },
    { label: "Resolution", c: "#f5f3ff", tc: "#7c3aed" },
  ];

  const x0 = 20, y0 = 90, w = 180, h = 120, gap = 14;
  for (let i = 0; i < stages.length; i++) {
    const x = x0 + i * (w + gap);
    els.push(rect(x, y0, w, h, {
      type: "rounded-rect" as WhiteboardElement["type"],
      borderRadius: 14,
      fillColor: stages[i].c,
      color: "#d1d5db",
    }));
    els.push(text(x + 20, y0 + 18, stages[i].label, { fontSize: 14, color: stages[i].tc }));
    els.push(text(x + 16, y0 + 52, "Add notes…", { fontSize: 12, color: "#6b7280" }));
    if (i < stages.length - 1) {
      els.push(arrow(x + w, y0 + h / 2, x + w + gap - 6, y0 + h / 2, { color: "#9ca3af" }));
    }
  }
  return els;
}

function exitTicket(): WhiteboardElement[] {
  return stackSections(
    "Exit Ticket",
    "#1e40af",
    [
      { label: "3 Things I Learned", h: 120, bg: "#eff6ff" },
      { label: "2 Questions I Have", h: 120, bg: "#fefce8" },
      { label: "1 Thing I'm Still Confused About", h: 120, bg: "#fef2f2" },
    ],
    { w: 740 }
  );
}

function graphicOrganizer(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  const x0 = 20;
  els.push(text(x0, 20, "Graphic Organizer", { fontSize: 28, color: "#1e40af" }));

  // Main idea
  els.push(rect(260, 90, 360, 80, {
    type: "rounded-rect" as WhiteboardElement["type"],
    borderRadius: 16,
    fillColor: "#eff6ff",
    color: "#3b82f6",
  }));
  els.push(text(380, 120, "Main idea", { fontSize: 16, color: "#1e40af" }));

  const details = [
    { x: 60, y: 240, label: "Detail 1", c: "#f0fdf4", tc: "#166534" },
    { x: 340, y: 240, label: "Detail 2", c: "#fefce8", tc: "#854d0e" },
    { x: 620, y: 240, label: "Detail 3", c: "#fdf2f8", tc: "#db2777" },
  ];

  for (const d of details) {
    els.push(arrow(440, 170, d.x + 90, d.y, { color: "#9ca3af", strokeWidth: 2 }));
    els.push(rect(d.x, d.y, 220, 90, {
      type: "rounded-rect" as WhiteboardElement["type"],
      borderRadius: 14,
      fillColor: d.c,
      color: "#d1d5db",
    }));
    els.push(text(d.x + 18, d.y + 18, d.label, { fontSize: 14, color: d.tc }));
    els.push(text(d.x + 18, d.y + 48, "Add supporting info…", { fontSize: 12, color: "#6b7280" }));
  }
  return els;
}

function readingResponse(): WhiteboardElement[] {
  return stackSections(
    "Reading Response",
    "#1e40af",
    [
      { label: "Title / Author", h: 60, bg: "#eff6ff" },
      { label: "Summary", h: 110, bg: "#f0fdf4" },
      { label: "Key Quotes", h: 110, bg: "#fefce8" },
      { label: "Analysis", h: 130, bg: "#f5f3ff" },
      { label: "Connections", h: 110, bg: "#fdf2f8" },
    ],
    { w: 740 }
  );
}

// ─── Agile Templates ─────────────────────────────────────

function scrumBoard(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  const colW = 200, colH = 400, gap = 16, x0 = 20, y0 = 70;
  const columns = ["Backlog", "To Do", "In Progress", "Done"];
  const colors = ["#f3f4f6", "#fefce8", "#eff6ff", "#f0fdf4"];

  els.push(text(x0, 20, "Scrum Board", { fontSize: 28, color: "#7c3aed" }));

  for (let i = 0; i < columns.length; i++) {
    const x = x0 + i * (colW + gap);
    els.push(rect(x, y0, colW, colH, { fillColor: colors[i], color: "#d1d5db" }));
    els.push(text(x + colW / 2 - 35, y0 + 12, columns[i], { fontSize: 16, color: "#374151" }));
    els.push(line(x + 8, y0 + 38, x + colW - 8, y0 + 38, { color: "#d1d5db" }));
    // Sample sticky notes
    els.push(sticky(x + 10, y0 + 50, `Task ${i + 1}`, i === 3 ? "#bbf7d0" : "#fef08a"));
  }
  return els;
}

function sprintRetro(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  const colW = 260, colH = 380, gap = 20, x0 = 20, y0 = 70;
  const columns = ["What Went Well", "What Didn't Go Well", "Action Items"];
  const colors = ["#f0fdf4", "#fef2f2", "#eff6ff"];
  const stickyColors = ["#bbf7d0", "#fecaca", "#bfdbfe"];

  els.push(text(x0, 20, "Sprint Retrospective", { fontSize: 28, color: "#7c3aed" }));

  for (let i = 0; i < columns.length; i++) {
    const x = x0 + i * (colW + gap);
    els.push(rect(x, y0, colW, colH, { fillColor: colors[i], color: "#d1d5db" }));
    els.push(text(x + 20, y0 + 14, columns[i], { fontSize: 16, color: "#374151" }));
    els.push(line(x + 10, y0 + 40, x + colW - 10, y0 + 40, { color: "#d1d5db" }));
    els.push(sticky(x + 20, y0 + 55, "Add notes here...", stickyColors[i]));
  }
  return els;
}

function kanbanBoard(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  const colW = 170, colH = 400, gap = 12, x0 = 20, y0 = 70;
  const columns = ["Backlog", "Ready", "In Progress", "Review", "Done"];
  const colors = ["#f3f4f6", "#fefce8", "#eff6ff", "#f5f3ff", "#f0fdf4"];

  els.push(text(x0, 20, "Kanban Board", { fontSize: 28, color: "#7c3aed" }));

  for (let i = 0; i < columns.length; i++) {
    const x = x0 + i * (colW + gap);
    els.push(rect(x, y0, colW, colH, { fillColor: colors[i], color: "#d1d5db" }));
    els.push(text(x + colW / 2 - 30, y0 + 12, columns[i], { fontSize: 15, color: "#374151" }));
    els.push(line(x + 8, y0 + 36, x + colW - 8, y0 + 36, { color: "#d1d5db" }));
  }
  return els;
}

function userStoryMap(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  const x0 = 20, y0 = 70;

  els.push(text(x0, 20, "User Story Map", { fontSize: 28, color: "#7c3aed" }));

  // Activities row
  const activities = ["Activity 1", "Activity 2", "Activity 3"];
  for (let i = 0; i < activities.length; i++) {
    const x = x0 + i * 280;
    els.push(rect(x, y0, 240, 50, { fillColor: "#eff6ff", color: "#3b82f6" }));
    els.push(text(x + 70, y0 + 16, activities[i], { fontSize: 16, color: "#1e40af" }));

    // Steps row
    for (let j = 0; j < 2; j++) {
      const sx = x + j * 125;
      els.push(rect(sx, y0 + 70, 115, 40, { fillColor: "#fefce8", color: "#eab308" }));
      els.push(text(sx + 20, y0 + 82, `Step ${j + 1}`, { fontSize: 13, color: "#854d0e" }));

      // Stories
      for (let k = 0; k < 2; k++) {
        els.push(sticky(sx + 5, y0 + 130 + k * 150, `Story ${k + 1}`, "#fef08a", { width: 105, height: 120 }));
      }
    }
  }
  return els;
}

function piPlanning(): WhiteboardElement[] {
  return boardCols(
    "PI Planning",
    "#7c3aed",
    [
      { label: "Sprint 1", bg: "#eff6ff", sc: "#bfdbfe" },
      { label: "Sprint 2", bg: "#f0fdf4", sc: "#bbf7d0" },
      { label: "Sprint 3", bg: "#fefce8", sc: "#fef08a" },
      { label: "Sprint 4", bg: "#f5f3ff", sc: "#ddd6fe" },
      { label: "Risks", bg: "#fef2f2", sc: "#fecaca", st: "Add risks..." },
    ],
    { colW: 170, colH: 380, gap: 12 }
  );
}

function sprintPlanning(): WhiteboardElement[] {
  return stackSections(
    "Sprint Planning",
    "#7c3aed",
    [
      { label: "Sprint Goal", h: 70, bg: "#eff6ff" },
      { label: "Selected Stories", h: 120, bg: "#f0fdf4" },
      { label: "Task Breakdown", h: 140, bg: "#fefce8" },
      { label: "Capacity", h: 70, bg: "#f5f3ff" },
      { label: "Risks", h: 70, bg: "#fef2f2" },
    ],
    { w: 740 }
  );
}

function moscowPrioritization(): WhiteboardElement[] {
  return boardCols(
    "MoSCoW Prioritization",
    "#7c3aed",
    [
      { label: "Must Have", bg: "#eff6ff", sc: "#bfdbfe" },
      { label: "Should Have", bg: "#f0fdf4", sc: "#bbf7d0" },
      { label: "Could Have", bg: "#fefce8", sc: "#fef08a" },
      { label: "Won't Have", bg: "#fef2f2", sc: "#fecaca" },
    ],
    { colW: 190, colH: 380 }
  );
}

function definitionOfDone(): WhiteboardElement[] {
  return stackSections(
    "Definition of Done",
    "#7c3aed",
    [
      { label: "Development", h: 110, bg: "#eff6ff" },
      { label: "Testing", h: 110, bg: "#f0fdf4" },
      { label: "Review", h: 110, bg: "#fefce8" },
      { label: "Deployment", h: 110, bg: "#f5f3ff" },
    ],
    { w: 740 }
  );
}

function dailyStandup(): WhiteboardElement[] {
  return boardCols(
    "Daily Standup",
    "#7c3aed",
    [
      { label: "Yesterday", bg: "#f0fdf4", sc: "#bbf7d0" },
      { label: "Today", bg: "#eff6ff", sc: "#bfdbfe" },
      { label: "Blockers", bg: "#fef2f2", sc: "#fecaca", st: "Add blockers..." },
    ],
    { colW: 230, colH: 360 }
  );
}

function productBacklog(): WhiteboardElement[] {
  return boardCols(
    "Product Backlog",
    "#7c3aed",
    [
      { label: "New", bg: "#f3f4f6", sc: "#fef08a" },
      { label: "Refined", bg: "#fefce8", sc: "#fef08a" },
      { label: "Ready", bg: "#eff6ff", sc: "#bfdbfe" },
      { label: "In Sprint", bg: "#f0fdf4", sc: "#bbf7d0" },
    ],
    { colW: 190, colH: 380 }
  );
}

function agileRoadmap(): WhiteboardElement[] {
  return boardCols(
    "Agile Roadmap",
    "#7c3aed",
    [
      { label: "Now", bg: "#eff6ff", sc: "#bfdbfe" },
      { label: "Next", bg: "#f0fdf4", sc: "#bbf7d0" },
      { label: "Later", bg: "#fefce8", sc: "#fef08a" },
      { label: "Future", bg: "#f5f3ff", sc: "#ddd6fe" },
    ],
    { colW: 190, colH: 360 }
  );
}

function sprintReview(): WhiteboardElement[] {
  return boardCols(
    "Sprint Review",
    "#7c3aed",
    [
      { label: "Completed", bg: "#f0fdf4", sc: "#bbf7d0" },
      { label: "Demo Notes", bg: "#eff6ff", sc: "#bfdbfe" },
      { label: "Feedback", bg: "#fefce8", sc: "#fef08a" },
      { label: "Next Steps", bg: "#f5f3ff", sc: "#ddd6fe" },
    ],
    { colW: 190, colH: 360 }
  );
}

// ─── Strategy & Planning Templates ───────────────────────

function swotAnalysis(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  const cellW = 300, cellH = 250, gap = 4, x0 = 20, y0 = 70;
  const labels = ["Strengths", "Weaknesses", "Opportunities", "Threats"];
  const colors = ["#f0fdf4", "#fef2f2", "#eff6ff", "#fefce8"];
  const textColors = ["#166534", "#dc2626", "#1e40af", "#854d0e"];

  els.push(text(x0 + 180, 20, "SWOT Analysis", { fontSize: 28, color: "#374151" }));

  for (let i = 0; i < 4; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = x0 + col * (cellW + gap);
    const y = y0 + row * (cellH + gap);
    els.push(rect(x, y, cellW, cellH, { fillColor: colors[i], color: "#d1d5db" }));
    els.push(text(x + cellW / 2 - 45, y + 16, labels[i], { fontSize: 20, color: textColors[i] }));
    els.push(line(x + 10, y + 44, x + cellW - 10, y + 44, { color: "#d1d5db" }));
    els.push(sticky(x + 20, y + 60, "Add items...", "#fef08a", { width: 120, height: 80 }));
  }
  return els;
}

function productRoadmap(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  const x0 = 20, y0 = 80;
  const phaseW = 200, phaseH = 300, gap = 16;
  const phases = ["Q1", "Q2", "Q3", "Q4"];
  const colors = ["#eff6ff", "#f0fdf4", "#fefce8", "#f5f3ff"];

  els.push(text(x0, 20, "Product Roadmap", { fontSize: 28, color: "#374151" }));

  // Timeline arrow
  els.push(arrow(x0, y0 - 10, x0 + phases.length * (phaseW + gap), y0 - 10, { color: "#374151", strokeWidth: 3 }));

  for (let i = 0; i < phases.length; i++) {
    const x = x0 + i * (phaseW + gap);
    els.push(rect(x, y0 + 10, phaseW, phaseH, { fillColor: colors[i], color: "#d1d5db" }));
    els.push(text(x + phaseW / 2 - 15, y0 + 24, phases[i], { fontSize: 20, color: "#374151" }));
    els.push(line(x + 10, y0 + 52, x + phaseW - 10, y0 + 52, { color: "#d1d5db" }));
    // Feature cards
    for (let j = 0; j < 3; j++) {
      els.push(rect(x + 10, y0 + 65 + j * 75, phaseW - 20, 60, {
        fillColor: "#ffffff",
        color: "#e5e7eb",
        type: "rounded-rect" as WhiteboardElement["type"],
        borderRadius: 8,
      }));
      els.push(text(x + 22, y0 + 85 + j * 75, `Feature ${j + 1}`, { fontSize: 13, color: "#6b7280" }));
    }
  }
  return els;
}

function stakeholderMap(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  const w = 300, h = 250, x0 = 20, y0 = 100;

  els.push(text(x0 + 150, 20, "Stakeholder Map", { fontSize: 28, color: "#374151" }));

  // Axis labels
  els.push(text(x0 + w - 20, y0 + h * 2 + 20, "Interest \u2192", { fontSize: 14, color: "#6b7280" }));
  els.push(text(x0 - 15, y0 - 20, "Power \u2191", { fontSize: 14, color: "#6b7280" }));

  const quadrants = [
    { label: "Keep Satisfied", color: "#fefce8" },
    { label: "Manage Closely", color: "#fef2f2" },
    { label: "Monitor", color: "#f3f4f6" },
    { label: "Keep Informed", color: "#eff6ff" },
  ];

  for (let i = 0; i < 4; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = x0 + col * w;
    const y = y0 + row * h;
    els.push(rect(x, y, w, h, { fillColor: quadrants[i].color, color: "#d1d5db" }));
    els.push(text(x + w / 2 - 55, y + h / 2 - 8, quadrants[i].label, { fontSize: 15, color: "#374151" }));
  }
  return els;
}

function riskMatrix(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  const cellW = 140, cellH = 100, x0 = 80, y0 = 100;
  const likelihoods = ["High", "Medium", "Low"];
  const impacts = ["Low", "Medium", "High"];
  const riskColors = [
    ["#fefce8", "#fff7ed", "#fef2f2"], // High likelihood
    ["#f0fdf4", "#fefce8", "#fff7ed"], // Medium
    ["#f0fdf4", "#f0fdf4", "#fefce8"], // Low
  ];

  els.push(text(x0 + 100, 20, "Risk Matrix", { fontSize: 28, color: "#374151" }));
  els.push(text(x0 - 70, y0 + cellH * 1.5 - 8, "Likelihood", { fontSize: 14, color: "#6b7280" }));
  els.push(text(x0 + cellW * 1.5 - 20, y0 + cellH * 3 + 15, "Impact", { fontSize: 14, color: "#6b7280" }));

  // Column headers
  for (let j = 0; j < impacts.length; j++) {
    els.push(text(x0 + j * cellW + cellW / 2 - 20, y0 - 20, impacts[j], { fontSize: 14, color: "#6b7280" }));
  }

  // Rows
  for (let i = 0; i < likelihoods.length; i++) {
    els.push(text(x0 - 55, y0 + i * cellH + cellH / 2 - 8, likelihoods[i], { fontSize: 14, color: "#6b7280" }));
    for (let j = 0; j < impacts.length; j++) {
      els.push(rect(x0 + j * cellW, y0 + i * cellH, cellW, cellH, {
        fillColor: riskColors[i][j],
        color: "#d1d5db",
      }));
    }
  }
  return els;
}

function decisionMatrix(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  const cellW = 140, cellH = 50, x0 = 20, y0 = 80;
  const options = ["Option A", "Option B", "Option C"];
  const criteria = ["Cost", "Time", "Quality", "Risk"];

  els.push(text(x0, 20, "Decision Matrix", { fontSize: 28, color: "#374151" }));

  // Header row
  els.push(rect(x0, y0, cellW, cellH, { fillColor: "#e5e7eb", color: "#9ca3af" }));
  els.push(text(x0 + 30, y0 + 16, "Options", { fontSize: 14, color: "#374151" }));
  for (let j = 0; j < criteria.length; j++) {
    els.push(rect(x0 + cellW + j * cellW, y0, cellW, cellH, { fillColor: "#e5e7eb", color: "#9ca3af" }));
    els.push(text(x0 + cellW + j * cellW + 30, y0 + 16, criteria[j], { fontSize: 14, color: "#374151" }));
  }
  // Total column
  els.push(rect(x0 + cellW + criteria.length * cellW, y0, cellW, cellH, { fillColor: "#e5e7eb", color: "#9ca3af" }));
  els.push(text(x0 + cellW + criteria.length * cellW + 40, y0 + 16, "Total", { fontSize: 14, color: "#374151" }));

  // Data rows
  const rowColors = ["#eff6ff", "#f0fdf4", "#fefce8"];
  for (let i = 0; i < options.length; i++) {
    const ry = y0 + cellH + i * cellH;
    els.push(rect(x0, ry, cellW, cellH, { fillColor: rowColors[i], color: "#d1d5db" }));
    els.push(text(x0 + 30, ry + 16, options[i], { fontSize: 14, color: "#374151" }));
    for (let j = 0; j <= criteria.length; j++) {
      els.push(rect(x0 + cellW + j * cellW, ry, cellW, cellH, { fillColor: "#ffffff", color: "#d1d5db" }));
    }
  }
  return els;
}

function okrBoard(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  const x0 = 20;
  els.push(text(x0, 20, "OKR Board", { fontSize: 28, color: "#374151" }));

  const rows = [
    { o: "Objective 1", c: "#eff6ff" },
    { o: "Objective 2", c: "#f0fdf4" },
    { o: "Objective 3", c: "#fefce8" },
  ];

  for (let i = 0; i < rows.length; i++) {
    const y = 90 + i * 170;
    els.push(rect(x0, y, 260, 130, {
      type: "rounded-rect" as WhiteboardElement["type"],
      borderRadius: 14,
      fillColor: rows[i].c,
      color: "#d1d5db",
    }));
    els.push(text(x0 + 14, y + 14, rows[i].o, { fontSize: 14, color: "#374151" }));
    els.push(text(x0 + 14, y + 44, "Write your objective…", { fontSize: 12, color: "#6b7280" }));

    for (let k = 0; k < 3; k++) {
      els.push(sticky(x0 + 280 + k * 200, y + 8, `Key Result ${k + 1}`, "#fef08a", { width: 180, height: 120 }));
    }
  }

  return els;
}

function businessModelCanvas(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  const x0 = 20, y0 = 80;
  const w = 920, h = 520;

  els.push(text(x0, 20, "Business Model Canvas", { fontSize: 28, color: "#374151" }));
  els.push(rect(x0, y0, w, h, { fillColor: "#ffffff", color: "#d1d5db" }));

  // Layout constants
  const colW = 180;
  const midW = 220;
  const rowH = 250;
  const bottomH = 170;

  const fillA = "#eff6ff";
  const fillB = "#f0fdf4";
  const fillC = "#fefce8";
  const fillD = "#f5f3ff";
  const fillE = "#fdf2f8";

  // Key Partners (left top)
  els.push(rect(x0, y0, colW, rowH, { fillColor: fillA, color: "#d1d5db" }));
  els.push(text(x0 + 10, y0 + 12, "Key Partners", { fontSize: 12, color: "#1e40af" }));

  // Key Activities (left middle)
  els.push(rect(x0 + colW, y0, colW, rowH / 2, { fillColor: fillB, color: "#d1d5db" }));
  els.push(text(x0 + colW + 10, y0 + 12, "Key Activities", { fontSize: 12, color: "#166534" }));

  // Key Resources (left bottom)
  els.push(rect(x0 + colW, y0 + rowH / 2, colW, rowH / 2, { fillColor: fillC, color: "#d1d5db" }));
  els.push(text(x0 + colW + 10, y0 + rowH / 2 + 12, "Key Resources", { fontSize: 12, color: "#854d0e" }));

  // Value Propositions (center)
  els.push(rect(x0 + colW * 2, y0, midW, rowH, { fillColor: fillD, color: "#d1d5db" }));
  els.push(text(x0 + colW * 2 + 10, y0 + 12, "Value Propositions", { fontSize: 12, color: "#7c3aed" }));

  // Customer Relationships (right middle)
  els.push(rect(x0 + colW * 2 + midW, y0, colW, rowH / 2, { fillColor: fillE, color: "#d1d5db" }));
  els.push(text(x0 + colW * 2 + midW + 10, y0 + 12, "Customer Relationships", { fontSize: 12, color: "#db2777" }));

  // Channels (right bottom)
  els.push(rect(x0 + colW * 2 + midW, y0 + rowH / 2, colW, rowH / 2, { fillColor: fillA, color: "#d1d5db" }));
  els.push(text(x0 + colW * 2 + midW + 10, y0 + rowH / 2 + 12, "Channels", { fontSize: 12, color: "#1e40af" }));

  // Customer Segments (far right)
  els.push(rect(x0 + colW * 3 + midW, y0, colW, rowH, { fillColor: fillB, color: "#d1d5db" }));
  els.push(text(x0 + colW * 3 + midW + 10, y0 + 12, "Customer Segments", { fontSize: 12, color: "#166534" }));

  // Bottom row: Cost / Revenue
  els.push(rect(x0, y0 + rowH, w / 2, bottomH, { fillColor: "#f3f4f6", color: "#d1d5db" }));
  els.push(text(x0 + 10, y0 + rowH + 12, "Cost Structure", { fontSize: 12, color: "#374151" }));
  els.push(rect(x0 + w / 2, y0 + rowH, w / 2, bottomH, { fillColor: "#f3f4f6", color: "#d1d5db" }));
  els.push(text(x0 + w / 2 + 10, y0 + rowH + 12, "Revenue Streams", { fontSize: 12, color: "#374151" }));

  return els;
}

function projectCharterBoard(): WhiteboardElement[] {
  return stackSections(
    "Project Charter",
    "#374151",
    [
      { label: "Project Name", h: 60, bg: "#eff6ff" },
      { label: "Objective", h: 90, bg: "#f0fdf4" },
      { label: "Scope", h: 90, bg: "#fefce8" },
      { label: "Stakeholders", h: 90, bg: "#f5f3ff" },
      { label: "Timeline", h: 70, bg: "#f3f4f6" },
      { label: "Budget", h: 70, bg: "#fdf2f8" },
      { label: "Success Criteria", h: 90, bg: "#eff6ff" },
    ],
    { w: 760 }
  );
}

function pestAnalysis(): WhiteboardElement[] {
  return quad(
    "PEST Analysis",
    "#374151",
    ["Political", "Economic", "Social", "Technological"],
    ["#eff6ff", "#f0fdf4", "#fefce8", "#f5f3ff"],
    ["#1e40af", "#166534", "#854d0e", "#7c3aed"]
  );
}

function actionPlan(): WhiteboardElement[] {
  return tableGrid(
    "Action Plan",
    "#374151",
    ["Action", "Owner", "Due Date", "Status", "Priority"],
    ["Action 1", "Action 2", "Action 3", "Action 4", "Action 5"],
    { cellW: 150, cellH: 52 }
  );
}

function smartGoalsBoard(): WhiteboardElement[] {
  return stackSections(
    "SMART Goals",
    "#374151",
    [
      { label: "Specific", h: 90, bg: "#eff6ff" },
      { label: "Measurable", h: 90, bg: "#f0fdf4" },
      { label: "Achievable", h: 90, bg: "#fefce8" },
      { label: "Relevant", h: 90, bg: "#f5f3ff" },
      { label: "Time-bound", h: 90, bg: "#fdf2f8" },
    ],
    { w: 760 }
  );
}

function competitiveAnalysis(): WhiteboardElement[] {
  return tableGrid(
    "Competitive Analysis",
    "#374151",
    ["Feature", "Us", "Competitor A", "Competitor B", "Competitor C"],
    ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5", "Feature 6"],
    { cellW: 150, cellH: 52 }
  );
}

// ─── Meetings & Workshops Templates ──────────────────────

function meetingAgenda(): WhiteboardElement[] {
  return stackSections(
    "Meeting Agenda",
    "#374151",
    [
      { label: "Meeting Title", h: 60, bg: "#eff6ff" },
      { label: "Date / Time", h: 55, bg: "#f0fdf4" },
      { label: "Attendees", h: 80, bg: "#fefce8" },
      { label: "Agenda Items", h: 140, bg: "#eff6ff" },
      { label: "Discussion Notes", h: 140, bg: "#f3f4f6" },
      { label: "Action Items", h: 110, bg: "#fef2f2" },
    ],
    { w: 760 }
  );
}

function workshopPlanner(): WhiteboardElement[] {
  return stackSections(
    "Workshop Planner",
    "#374151",
    [
      { label: "Workshop Goal", h: 70, bg: "#eff6ff" },
      { label: "Prep / Materials", h: 80, bg: "#f0fdf4" },
      { label: "Ice Breaker (10 min)", h: 70, bg: "#fefce8" },
      { label: "Activity 1 (20 min)", h: 90, bg: "#eff6ff" },
      { label: "Activity 2 (20 min)", h: 90, bg: "#f0fdf4" },
      { label: "Break", h: 55, bg: "#f3f4f6" },
      { label: "Activity 3 (20 min)", h: 90, bg: "#f5f3ff" },
      { label: "Wrap-up", h: 70, bg: "#fdf2f8" },
    ],
    { w: 760 }
  );
}

function actionItemsTracker(): WhiteboardElement[] {
  return boardCols(
    "Action Items Tracker",
    "#374151",
    [
      { label: "To Do", bg: "#fefce8", sc: "#fef08a" },
      { label: "In Progress", bg: "#eff6ff", sc: "#bfdbfe" },
      { label: "Done", bg: "#f0fdf4", sc: "#bbf7d0" },
      { label: "Blocked", bg: "#fef2f2", sc: "#fecaca" },
    ],
    { colW: 190, colH: 360 }
  );
}

function meetingNotes(): WhiteboardElement[] {
  return stackSections(
    "Meeting Notes",
    "#374151",
    [
      { label: "Date / Attendees", h: 70, bg: "#eff6ff" },
      { label: "Key Discussion Points", h: 160, bg: "#f0fdf4" },
      { label: "Decisions Made", h: 110, bg: "#fefce8" },
      { label: "Action Items", h: 120, bg: "#fef2f2" },
      { label: "Follow-up", h: 90, bg: "#f3f4f6" },
    ],
    { w: 760 }
  );
}

function weeklyReview(): WhiteboardElement[] {
  return boardCols(
    "Weekly Review",
    "#374151",
    [
      { label: "Wins", bg: "#f0fdf4", sc: "#bbf7d0" },
      { label: "Challenges", bg: "#fef2f2", sc: "#fecaca" },
      { label: "Learnings", bg: "#eff6ff", sc: "#bfdbfe" },
      { label: "Next Week Focus", bg: "#fefce8", sc: "#fef08a" },
    ],
    { colW: 190, colH: 360 }
  );
}

function oneOnOneMeeting(): WhiteboardElement[] {
  return stackSections(
    "1-on-1 Meeting",
    "#374151",
    [
      { label: "Check-in", h: 80, bg: "#eff6ff" },
      { label: "Updates", h: 110, bg: "#f0fdf4" },
      { label: "Feedback", h: 110, bg: "#fefce8" },
      { label: "Goals Progress", h: 120, bg: "#f5f3ff" },
      { label: "Action Items", h: 90, bg: "#fef2f2" },
    ],
    { w: 760 }
  );
}

function teamSync(): WhiteboardElement[] {
  return boardCols(
    "Team Sync",
    "#374151",
    [
      { label: "Updates", bg: "#eff6ff", sc: "#bfdbfe" },
      { label: "Blockers", bg: "#fef2f2", sc: "#fecaca", st: "Add blockers..." },
      { label: "Needs Help", bg: "#fefce8", sc: "#fef08a" },
      { label: "Announcements", bg: "#f0fdf4", sc: "#bbf7d0" },
    ],
    { colW: 190, colH: 360 }
  );
}

function allHandsMeeting(): WhiteboardElement[] {
  return stackSections(
    "All-Hands Meeting",
    "#374151",
    [
      { label: "Company Updates", h: 120, bg: "#eff6ff" },
      { label: "Team Highlights", h: 120, bg: "#f0fdf4" },
      { label: "Q&A", h: 130, bg: "#fefce8" },
      { label: "Announcements", h: 110, bg: "#f5f3ff" },
      { label: "Action Items", h: 90, bg: "#fef2f2" },
    ],
    { w: 760 }
  );
}

function statusUpdate(): WhiteboardElement[] {
  return boardCols(
    "Status Update",
    "#374151",
    [
      { label: "On Track", bg: "#f0fdf4", sc: "#bbf7d0" },
      { label: "At Risk", bg: "#fefce8", sc: "#fef08a" },
      { label: "Blocked", bg: "#fef2f2", sc: "#fecaca" },
      { label: "Completed", bg: "#eff6ff", sc: "#bfdbfe" },
    ],
    { colW: 190, colH: 360 }
  );
}

function icebreakerBoard(): WhiteboardElement[] {
  return stickyGrid(
    "Icebreaker Board",
    "#374151",
    [
      "Favorite hobby?",
      "Dream vacation?",
      "Best book/movie?",
      "Coffee or tea?",
      "Morning or night?",
      "Hidden talent?",
      "Most used app?",
      "One fun fact!",
      "Biggest goal this year?",
    ],
    { cols: 3 }
  );
}

// ─── Brainstorming & Ideation Templates ───────────────────

function brainstormBoard(): WhiteboardElement[] {
  return boardCols(
    "Brainstorm Board",
    "#1e40af",
    [
      { label: "Ideas", bg: "#eff6ff", sc: "#bfdbfe" },
      { label: "Likes", bg: "#f0fdf4", sc: "#bbf7d0" },
      { label: "Wishes", bg: "#fefce8", sc: "#fef08a" },
      { label: "Questions", bg: "#fef2f2", sc: "#fecaca" },
    ],
    { colW: 190, colH: 360 }
  );
}

function affinityMap(): WhiteboardElement[] {
  return boardCols(
    "Affinity Map",
    "#1e40af",
    [
      { label: "Group 1", bg: "#eff6ff", sc: "#bfdbfe" },
      { label: "Group 2", bg: "#f0fdf4", sc: "#bbf7d0" },
      { label: "Group 3", bg: "#fefce8", sc: "#fef08a" },
      { label: "Group 4", bg: "#f5f3ff", sc: "#ddd6fe" },
      { label: "Group 5", bg: "#fdf2f8", sc: "#fbcfe8" },
    ],
    { colW: 170, colH: 360, gap: 12 }
  );
}

function crazy8s(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "Crazy 8s", { fontSize: 28, color: "#1e40af" }));
  const x0 = 20, y0 = 90, w = 220, h = 140, gap = 14;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 4; c++) {
      const x = x0 + c * (w + gap);
      const y = y0 + r * (h + gap);
      els.push(rect(x, y, w, h, {
        type: "rounded-rect" as WhiteboardElement["type"],
        borderRadius: 14,
        fillColor: "#f3f4f6",
        color: "#d1d5db",
      }));
      els.push(text(x + 12, y + 12, `Sketch ${r * 4 + c + 1}`, { fontSize: 12, color: "#6b7280" }));
    }
  }
  return els;
}

function sixThinkingHats(): WhiteboardElement[] {
  return boardCols(
    "Six Thinking Hats",
    "#1e40af",
    [
      { label: "White (Facts)", bg: "#f3f4f6", sc: "#bfdbfe" },
      { label: "Red (Feelings)", bg: "#fef2f2", sc: "#fecaca" },
      { label: "Black (Risks)", bg: "#f3f4f6", sc: "#e5e7eb" },
      { label: "Yellow (Benefits)", bg: "#fefce8", sc: "#fef08a" },
      { label: "Green (Ideas)", bg: "#f0fdf4", sc: "#bbf7d0" },
      { label: "Blue (Process)", bg: "#eff6ff", sc: "#bfdbfe" },
    ],
    { colW: 150, colH: 360, gap: 12 }
  );
}

function scamper(): WhiteboardElement[] {
  return stackSections(
    "SCAMPER",
    "#1e40af",
    [
      { label: "Substitute", h: 70, bg: "#eff6ff" },
      { label: "Combine", h: 70, bg: "#f0fdf4" },
      { label: "Adapt", h: 70, bg: "#fefce8" },
      { label: "Modify", h: 70, bg: "#f5f3ff" },
      { label: "Put to other use", h: 70, bg: "#fdf2f8" },
      { label: "Eliminate", h: 70, bg: "#fef2f2" },
      { label: "Reverse", h: 70, bg: "#f3f4f6" },
    ],
    { w: 760 }
  );
}

function reverseBrainstorming(): WhiteboardElement[] {
  return boardCols(
    "Reverse Brainstorming",
    "#1e40af",
    [
      { label: "Problem Statement", bg: "#eff6ff", sc: "#bfdbfe", st: "Define the problem..." },
      { label: "How to Cause It", bg: "#fef2f2", sc: "#fecaca", st: "List causes..." },
      { label: "Reverse Solutions", bg: "#f0fdf4", sc: "#bbf7d0", st: "Flip into solutions..." },
      { label: "Action Plan", bg: "#fefce8", sc: "#fef08a", st: "Next steps..." },
    ],
    { colW: 180, colH: 360, gap: 12 }
  );
}

function brainwriting(): WhiteboardElement[] {
  return stickyGrid(
    "Brainwriting (6-3-5)",
    "#1e40af",
    Array.from({ length: 9 }, (_, i) => `Idea ${i + 1}`),
    { cols: 3, colors: ["#fef08a", "#bbf7d0", "#bfdbfe"] }
  );
}

function lotusDiagram(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "Lotus Diagram", { fontSize: 28, color: "#1e40af" }));
  const x0 = 20, y0 = 90;
  const w = 180, h = 120, gap = 12;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const x = x0 + c * (w + gap);
      const y = y0 + r * (h + gap);
      const isCenter = r === 1 && c === 1;
      els.push(rect(x, y, w, h, {
        type: "rounded-rect" as WhiteboardElement["type"],
        borderRadius: 14,
        fillColor: isCenter ? "#f5f3ff" : "#eff6ff",
        color: "#d1d5db",
      }));
      els.push(text(x + 14, y + 14, isCenter ? "Main Topic" : `Topic ${r * 3 + c + 1}`, { fontSize: 13, color: isCenter ? "#7c3aed" : "#1e40af" }));
    }
  }
  return els;
}

function visionBoardTemplate(): WhiteboardElement[] {
  return quad(
    "Vision Board",
    "#1e40af",
    ["Goals", "Inspiration", "Values", "Actions"],
    ["#eff6ff", "#fdf2f8", "#fefce8", "#f0fdf4"],
    ["#1e40af", "#db2777", "#854d0e", "#166534"]
  );
}

function ideaBoard(): WhiteboardElement[] {
  return boardCols(
    "Idea Board",
    "#1e40af",
    [
      { label: "New Ideas", bg: "#eff6ff", sc: "#bfdbfe" },
      { label: "Promising", bg: "#f0fdf4", sc: "#bbf7d0" },
      { label: "Needs Research", bg: "#fefce8", sc: "#fef08a" },
      { label: "Ready to Execute", bg: "#f5f3ff", sc: "#ddd6fe" },
    ],
    { colW: 180, colH: 360 }
  );
}

// ─── Research & Design Templates ─────────────────────────

function customerJourneyMap(): WhiteboardElement[] {
  return tableGrid(
    "Customer Journey Map",
    "#374151",
    ["Map", "Awareness", "Consideration", "Purchase", "Onboarding", "Retention"],
    ["Actions", "Touchpoints", "Emotions", "Pain Points"],
    { cellW: 150, cellH: 60, headerFill: "#e5e7eb", rowFill: "#ffffff" }
  );
}

function empathyMap(): WhiteboardElement[] {
  const els = quad(
    "Empathy Map",
    "#374151",
    ["Says", "Thinks", "Does", "Feels"],
    ["#eff6ff", "#f0fdf4", "#fefce8", "#fdf2f8"],
    ["#1e40af", "#166534", "#854d0e", "#db2777"]
  );
  // Center user
  els.push(circle(320, 220, 180, 180, { fillColor: "#ffffff", color: "#d1d5db" }));
  els.push(text(370, 305, "User", { fontSize: 18, color: "#374151" }));
  return els;
}

function designSprint(): WhiteboardElement[] {
  return boardCols(
    "Design Sprint (5 days)",
    "#374151",
    [
      { label: "Monday (Map)", bg: "#eff6ff", sc: "#bfdbfe" },
      { label: "Tuesday (Sketch)", bg: "#f0fdf4", sc: "#bbf7d0" },
      { label: "Wednesday (Decide)", bg: "#fefce8", sc: "#fef08a" },
      { label: "Thursday (Prototype)", bg: "#f5f3ff", sc: "#ddd6fe" },
      { label: "Friday (Test)", bg: "#fdf2f8", sc: "#fbcfe8" },
    ],
    { colW: 170, colH: 360, gap: 12 }
  );
}

function wireframeLayout(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "Wireframe Layout", { fontSize: 28, color: "#374151" }));
  const x0 = 20, y0 = 90, w = 820;
  els.push(rect(x0, y0, w, 60, { fillColor: "#f3f4f6", color: "#d1d5db" }));
  els.push(text(x0 + 10, y0 + 20, "Header", { fontSize: 12, color: "#6b7280" }));
  els.push(rect(x0, y0 + 70, 180, 380, { fillColor: "#eff6ff", color: "#d1d5db" }));
  els.push(text(x0 + 10, y0 + 90, "Nav", { fontSize: 12, color: "#1e40af" }));
  els.push(rect(x0 + 190, y0 + 70, w - 190, 140, { fillColor: "#ffffff", color: "#d1d5db" }));
  els.push(text(x0 + 200, y0 + 90, "Hero", { fontSize: 12, color: "#6b7280" }));
  const colW = (w - 210) / 3;
  for (let i = 0; i < 3; i++) {
    els.push(rect(x0 + 190 + i * (colW + 10), y0 + 220, colW, 150, { fillColor: "#f0fdf4", color: "#d1d5db" }));
    els.push(text(x0 + 200 + i * (colW + 10), y0 + 240, `Content ${i + 1}`, { fontSize: 12, color: "#166534" }));
  }
  els.push(rect(x0 + 190, y0 + 380, w - 190, 70, { fillColor: "#f3f4f6", color: "#d1d5db" }));
  els.push(text(x0 + 200, y0 + 404, "Footer", { fontSize: 12, color: "#6b7280" }));
  return els;
}

function userPersona(): WhiteboardElement[] {
  const els = stackSections(
    "User Persona",
    "#374151",
    [
      { label: "Photo / Name / Role", h: 120, bg: "#eff6ff" },
      { label: "Demographics", h: 90, bg: "#f0fdf4" },
      { label: "Goals", h: 90, bg: "#fefce8" },
      { label: "Pain Points", h: 90, bg: "#fef2f2" },
      { label: "Behaviors", h: 90, bg: "#f5f3ff" },
      { label: "Quote", h: 70, bg: "#fdf2f8" },
    ],
    { w: 760 }
  );
  // Add a photo placeholder circle in the first section
  els.push(circle(40, 110, 90, 90, { fillColor: "#ffffff", color: "#d1d5db" }));
  els.push(text(58, 146, "Photo", { fontSize: 12, color: "#6b7280" }));
  return els;
}

function storyboardTemplate(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "Storyboard", { fontSize: 28, color: "#374151" }));
  const x0 = 20, y0 = 90, w = 260, h = 150, gap = 14;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const x = x0 + c * (w + gap);
      const y = y0 + r * (h + 70 + gap);
      els.push(rect(x, y, w, h, { fillColor: "#ffffff", color: "#d1d5db" }));
      els.push(text(x + 10, y + 10, `Frame ${r * 3 + c + 1}`, { fontSize: 12, color: "#6b7280" }));
      els.push(rect(x, y + h + 8, w, 50, { fillColor: "#f3f4f6", color: "#e5e7eb" }));
      els.push(text(x + 10, y + h + 24, "Caption…", { fontSize: 12, color: "#6b7280" }));
    }
  }
  return els;
}

function moodboard(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "Moodboard", { fontSize: 28, color: "#374151" }));
  const x0 = 20, y0 = 90, w = 240, h = 160, gap = 14;
  for (let i = 0; i < 9; i++) {
    const r = Math.floor(i / 3);
    const c = i % 3;
    const x = x0 + c * (w + gap);
    const y = y0 + r * (h + gap);
    els.push(rect(x, y, w, h, {
      type: "rounded-rect" as WhiteboardElement["type"],
      borderRadius: 16,
      fillColor: "#f3f4f6",
      color: "#d1d5db",
    }));
    els.push(text(x + 70, y + 72, "Add Image", { fontSize: 12, color: "#6b7280" }));
  }
  return els;
}

function creativeBrief(): WhiteboardElement[] {
  return stackSections(
    "Creative Brief",
    "#374151",
    [
      { label: "Project Overview", h: 90, bg: "#eff6ff" },
      { label: "Objective", h: 80, bg: "#f0fdf4" },
      { label: "Target Audience", h: 80, bg: "#fefce8" },
      { label: "Key Message", h: 80, bg: "#f5f3ff" },
      { label: "Deliverables", h: 90, bg: "#fdf2f8" },
      { label: "Timeline", h: 70, bg: "#f3f4f6" },
      { label: "Budget", h: 70, bg: "#fef2f2" },
    ],
    { w: 760 }
  );
}

function raciMatrix(): WhiteboardElement[] {
  return tableGrid(
    "RACI Matrix",
    "#374151",
    ["Task", "Responsible", "Accountable", "Consulted", "Informed"],
    ["Task 1", "Task 2", "Task 3", "Task 4", "Task 5"],
    { cellW: 160, cellH: 52 }
  );
}

function uxResearchBoard(): WhiteboardElement[] {
  return boardCols(
    "UX Research Board",
    "#374151",
    [
      { label: "Research Questions", bg: "#eff6ff", sc: "#bfdbfe" },
      { label: "Findings", bg: "#f0fdf4", sc: "#bbf7d0" },
      { label: "Insights", bg: "#fefce8", sc: "#fef08a" },
      { label: "Recommendations", bg: "#f5f3ff", sc: "#ddd6fe" },
    ],
    { colW: 190, colH: 360 }
  );
}

// ─── Diagrams Templates ──────────────────────────────────

function basicFlowchart(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "Basic Flowchart", { fontSize: 28, color: "#374151" }));

  const x0 = 80;
  const y0 = 110;
  const w = 180, h = 70, gapY = 70;

  // Start
  els.push(rect(x0, y0, w, h, { type: "flowchart-terminal", fillColor: "#f0fdf4", color: "#22c55e" }));
  els.push(text(x0 + 65, y0 + 26, "Start", { fontSize: 14, color: "#166534" }));

  // Process
  els.push(rect(x0, y0 + h + gapY, w, h, { type: "flowchart-process", fillColor: "#eff6ff", color: "#3b82f6" }));
  els.push(text(x0 + 50, y0 + h + gapY + 26, "Process", { fontSize: 14, color: "#1e40af" }));
  els.push(arrow(x0 + w / 2, y0 + h, x0 + w / 2, y0 + h + gapY, { color: "#9ca3af" }));

  // Decision
  const dx = x0 + 20;
  const dy = y0 + (h + gapY) * 2;
  els.push(diamond(dx, dy, w - 40, h + 20, { fillColor: "#fefce8", color: "#eab308" }));
  els.push(text(dx + 40, dy + 30, "Decision?", { fontSize: 14, color: "#854d0e" }));
  els.push(arrow(x0 + w / 2, y0 + h + gapY + h, x0 + w / 2, dy, { color: "#9ca3af" }));

  // Branches
  els.push(rect(x0 - 220, dy + 140, w, h, { type: "flowchart-process", fillColor: "#fef2f2", color: "#ef4444" }));
  els.push(text(x0 - 168, dy + 166, "No", { fontSize: 14, color: "#dc2626" }));
  els.push(rect(x0 + 220, dy + 140, w, h, { type: "flowchart-process", fillColor: "#f0fdf4", color: "#22c55e" }));
  els.push(text(x0 + 278, dy + 166, "Yes", { fontSize: 14, color: "#166534" }));
  els.push(arrow(dx, dy + 50, x0 - 220 + w / 2, dy + 140, { color: "#9ca3af" }));
  els.push(arrow(dx + (w - 40), dy + 50, x0 + 220 + w / 2, dy + 140, { color: "#9ca3af" }));

  // End
  els.push(rect(x0, dy + 260, w, h, { type: "flowchart-terminal", fillColor: "#f3f4f6", color: "#9ca3af" }));
  els.push(text(x0 + 72, dy + 286, "End", { fontSize: 14, color: "#374151" }));
  els.push(arrow(x0 - 220 + w / 2, dy + 140 + h, x0 + w / 2, dy + 260, { color: "#9ca3af" }));
  els.push(arrow(x0 + 220 + w / 2, dy + 140 + h, x0 + w / 2, dy + 260, { color: "#9ca3af" }));

  return els;
}

function orgChart(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "Org Chart", { fontSize: 28, color: "#374151" }));

  const topX = 380, topY = 90;
  const boxW = 220, boxH = 70;
  const vpY = 210;
  const dirY = 330;

  // CEO
  els.push(rect(topX, topY, boxW, boxH, { type: "rounded-rect" as WhiteboardElement["type"], borderRadius: 14, fillColor: "#eff6ff", color: "#3b82f6" }));
  els.push(text(topX + 78, topY + 24, "CEO", { fontSize: 14, color: "#1e40af" }));

  const vps = ["VP 1", "VP 2", "VP 3"];
  for (let i = 0; i < 3; i++) {
    const x = 140 + i * 280;
    els.push(arrow(topX + boxW / 2, topY + boxH, x + boxW / 2, vpY, { color: "#d1d5db" }));
    els.push(rect(x, vpY, boxW, boxH, { type: "rounded-rect" as WhiteboardElement["type"], borderRadius: 14, fillColor: "#f0fdf4", color: "#22c55e" }));
    els.push(text(x + 80, vpY + 24, vps[i], { fontSize: 14, color: "#166534" }));

    // Two directors under each VP
    for (let j = 0; j < 2; j++) {
      const dx = x - 60 + j * 170;
      els.push(arrow(x + boxW / 2, vpY + boxH, dx + 150 / 2, dirY, { color: "#e5e7eb" }));
      els.push(rect(dx, dirY, 150, 62, { type: "rounded-rect" as WhiteboardElement["type"], borderRadius: 12, fillColor: "#fefce8", color: "#eab308" }));
      els.push(text(dx + 18, dirY + 22, `Director ${i * 2 + j + 1}`, { fontSize: 12, color: "#854d0e" }));
    }
  }

  return els;
}

function swimlaneDiagram(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "Swimlane Diagram", { fontSize: 28, color: "#374151" }));

  const x0 = 20, y0 = 90, w = 900, laneH = 120, gap = 10;
  const lanes = ["Lane 1", "Lane 2", "Lane 3"];
  const fills = ["#eff6ff", "#f0fdf4", "#fefce8"];

  for (let i = 0; i < lanes.length; i++) {
    const y = y0 + i * (laneH + gap);
    els.push(rect(x0, y, w, laneH, { fillColor: fills[i], color: "#d1d5db" }));
    els.push(text(x0 + 12, y + 12, lanes[i], { fontSize: 12, color: "#374151" }));
    // Steps
    for (let s = 0; s < 3; s++) {
      const sx = x0 + 140 + s * 240;
      els.push(rect(sx, y + 35, 200, 60, { type: "rounded-rect" as WhiteboardElement["type"], borderRadius: 14, fillColor: "#ffffff", color: "#e5e7eb" }));
      els.push(text(sx + 16, y + 58, `Step ${s + 1}`, { fontSize: 12, color: "#6b7280" }));
      if (s < 2) els.push(arrow(sx + 200, y + 65, sx + 240 - 10, y + 65, { color: "#9ca3af" }));
    }
  }
  return els;
}

function ganttChart(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "Gantt Chart", { fontSize: 28, color: "#374151" }));

  const x0 = 20, y0 = 90;
  const taskW = 200;
  const gridW = 700;
  const rowH = 56;
  const rows = ["Task 1", "Task 2", "Task 3", "Task 4", "Task 5"];

  // Header
  els.push(rect(x0, y0, taskW, rowH, { fillColor: "#e5e7eb", color: "#9ca3af" }));
  els.push(text(x0 + 10, y0 + 18, "Tasks", { fontSize: 12, color: "#374151" }));
  els.push(rect(x0 + taskW, y0, gridW, rowH, { fillColor: "#e5e7eb", color: "#9ca3af" }));
  els.push(text(x0 + taskW + 10, y0 + 18, "Timeline", { fontSize: 12, color: "#374151" }));

  for (let i = 0; i < rows.length; i++) {
    const y = y0 + rowH + i * rowH;
    els.push(rect(x0, y, taskW, rowH, { fillColor: "#ffffff", color: "#d1d5db" }));
    els.push(text(x0 + 10, y + 18, rows[i], { fontSize: 12, color: "#374151" }));
    els.push(rect(x0 + taskW, y, gridW, rowH, { fillColor: "#ffffff", color: "#d1d5db" }));

    // Bar
    const barX = x0 + taskW + 20 + i * 40;
    const barW = 220 + (i % 2) * 90;
    const barFill = ["#bfdbfe", "#bbf7d0", "#fef08a", "#ddd6fe", "#fbcfe8"][i % 5];
    els.push(rect(barX, y + 14, barW, 28, { type: "rounded-rect" as WhiteboardElement["type"], borderRadius: 14, fillColor: barFill, color: "#d1d5db" }));
  }

  return els;
}

function networkDiagram(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "Network Diagram", { fontSize: 28, color: "#374151" }));

  const nodes = [
    { x: 120, y: 150, c: "#bfdbfe" },
    { x: 320, y: 110, c: "#bbf7d0" },
    { x: 520, y: 150, c: "#fef08a" },
    { x: 220, y: 310, c: "#ddd6fe" },
    { x: 420, y: 330, c: "#fbcfe8" },
    { x: 640, y: 290, c: "#fecaca" },
  ];

  // Edges
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if ((i + j) % 3 === 0) {
        els.push(line(nodes[i].x + 30, nodes[i].y + 30, nodes[j].x + 30, nodes[j].y + 30, { color: "#d1d5db" }));
      }
    }
  }

  // Nodes
  for (let i = 0; i < nodes.length; i++) {
    els.push(circle(nodes[i].x, nodes[i].y, 60, 60, { fillColor: nodes[i].c, color: "#9ca3af" }));
    els.push(text(nodes[i].x + 16, nodes[i].y + 22, `Node ${i + 1}`, { fontSize: 12, color: "#374151" }));
  }

  return els;
}

function fishboneDiagram(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "Fishbone Diagram", { fontSize: 28, color: "#374151" }));

  const spineY = 260;
  els.push(arrow(60, spineY, 900, spineY, { color: "#9ca3af", strokeWidth: 3 }));
  els.push(text(820, spineY - 30, "Problem", { fontSize: 14, color: "#374151" }));

  const bones = ["People", "Process", "Materials", "Equipment", "Environment", "Management"];
  for (let i = 0; i < bones.length; i++) {
    const x = 180 + i * 110;
    const up = i % 2 === 0;
    const y2 = up ? spineY - 120 : spineY + 120;
    els.push(line(x, spineY, x - 80, y2, { color: "#d1d5db", strokeWidth: 3 }));
    els.push(text(x - 125, up ? y2 - 18 : y2 + 6, bones[i], { fontSize: 12, color: "#6b7280" }));
  }
  return els;
}

function processMap(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "Process Map", { fontSize: 28, color: "#374151" }));
  const steps = ["Input", "Step 1", "Step 2", "Decision", "Step 3", "Output"];
  const x0 = 20, y0 = 140, w = 150, h = 70, gap = 18;
  for (let i = 0; i < steps.length; i++) {
    const x = x0 + i * (w + gap);
    if (steps[i] === "Decision") {
      els.push(diamond(x + 25, y0 - 10, w - 50, h + 20, { fillColor: "#fefce8", color: "#eab308" }));
      els.push(text(x + 52, y0 + 20, "Decision", { fontSize: 12, color: "#854d0e" }));
    } else {
      els.push(rect(x, y0, w, h, { type: "rounded-rect" as WhiteboardElement["type"], borderRadius: 14, fillColor: "#eff6ff", color: "#d1d5db" }));
      els.push(text(x + 46, y0 + 26, steps[i], { fontSize: 12, color: "#374151" }));
    }
    if (i < steps.length - 1) {
      els.push(arrow(x + w, y0 + h / 2, x + w + gap - 8, y0 + h / 2, { color: "#9ca3af" }));
    }
  }
  return els;
}

function sipocDiagram(): WhiteboardElement[] {
  return tableGrid(
    "SIPOC Diagram",
    "#374151",
    ["Suppliers", "Inputs", "Process", "Outputs", "Customers"],
    ["Item 1", "Item 2", "Item 3", "Item 4"],
    { cellW: 190, cellH: 56 }
  );
}

function bpmnProcess(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "BPMN Process", { fontSize: 28, color: "#374151" }));
  const y = 180;
  els.push(circle(60, y, 60, 60, { fillColor: "#f0fdf4", color: "#22c55e" }));
  els.push(text(78, y + 22, "Start", { fontSize: 12, color: "#166534" }));
  els.push(rect(160, y, 180, 60, { type: "flowchart-process", fillColor: "#eff6ff", color: "#3b82f6" }));
  els.push(text(220, y + 22, "Task", { fontSize: 12, color: "#1e40af" }));
  els.push(diamond(420, y - 10, 80, 80, { fillColor: "#fefce8", color: "#eab308" }));
  els.push(text(438, y + 22, "GW", { fontSize: 12, color: "#854d0e" }));
  els.push(rect(540, y, 180, 60, { type: "flowchart-process", fillColor: "#f5f3ff", color: "#8b5cf6" }));
  els.push(text(598, y + 22, "Task", { fontSize: 12, color: "#7c3aed" }));
  els.push(circle(780, y, 60, 60, { fillColor: "#fef2f2", color: "#ef4444" }));
  els.push(text(802, y + 22, "End", { fontSize: 12, color: "#dc2626" }));
  els.push(arrow(120, y + 30, 160, y + 30, { color: "#9ca3af" }));
  els.push(arrow(340, y + 30, 420, y + 30, { color: "#9ca3af" }));
  els.push(arrow(500, y + 30, 540, y + 30, { color: "#9ca3af" }));
  els.push(arrow(720, y + 30, 780, y + 30, { color: "#9ca3af" }));
  return els;
}

function umlClassDiagram(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "UML Class Diagram", { fontSize: 28, color: "#374151" }));
  const classes = [
    { x: 60, y: 110, name: "ClassA" },
    { x: 360, y: 110, name: "ClassB" },
    { x: 660, y: 110, name: "ClassC" },
  ];
  for (const c of classes) {
    els.push(rect(c.x, c.y, 240, 170, { fillColor: "#ffffff", color: "#d1d5db" }));
    els.push(line(c.x, c.y + 50, c.x + 240, c.y + 50, { color: "#d1d5db" }));
    els.push(line(c.x, c.y + 110, c.x + 240, c.y + 110, { color: "#d1d5db" }));
    els.push(text(c.x + 80, c.y + 18, c.name, { fontSize: 14, color: "#374151" }));
    els.push(text(c.x + 10, c.y + 66, "+ attribute: type", { fontSize: 12, color: "#6b7280" }));
    els.push(text(c.x + 10, c.y + 126, "+ method(): void", { fontSize: 12, color: "#6b7280" }));
  }
  els.push(line(300, 195, 360, 195, { color: "#9ca3af" }));
  els.push(line(600, 195, 660, 195, { color: "#9ca3af" }));
  return els;
}

function sequenceDiagram(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "Sequence Diagram", { fontSize: 28, color: "#374151" }));
  const actors = ["Client", "Service", "DB"];
  const xs = [140, 420, 700];
  const topY = 90;
  const bottomY = 430;
  for (let i = 0; i < actors.length; i++) {
    els.push(rect(xs[i] - 70, topY, 140, 50, { fillColor: "#f3f4f6", color: "#d1d5db" }));
    els.push(text(xs[i] - 24, topY + 18, actors[i], { fontSize: 12, color: "#374151" }));
    els.push(line(xs[i], topY + 55, xs[i], bottomY, { color: "#9ca3af", strokeWidth: 2, strokeDash: "dashed" }));
  }
  // Messages
  els.push(arrow(xs[0], 190, xs[1], 190, { color: "#3b82f6" }));
  els.push(text(xs[0] + 60, 168, "request()", { fontSize: 12, color: "#1e40af" }));
  els.push(arrow(xs[1], 260, xs[2], 260, { color: "#22c55e" }));
  els.push(text(xs[1] + 60, 238, "query()", { fontSize: 12, color: "#166534" }));
  els.push(arrow(xs[2], 330, xs[1], 330, { color: "#22c55e" }));
  els.push(text(xs[1] + 60, 308, "result", { fontSize: 12, color: "#166534" }));
  els.push(arrow(xs[1], 390, xs[0], 390, { color: "#3b82f6" }));
  els.push(text(xs[0] + 80, 368, "response", { fontSize: 12, color: "#1e40af" }));
  return els;
}

function erDiagram(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "ER Diagram", { fontSize: 28, color: "#374151" }));
  const entities = [
    { x: 60, y: 120, name: "User" },
    { x: 390, y: 120, name: "Order" },
    { x: 720, y: 120, name: "Product" },
  ];
  for (const e of entities) {
    els.push(rect(e.x, e.y, 220, 150, { fillColor: "#ffffff", color: "#d1d5db" }));
    els.push(text(e.x + 86, e.y + 16, e.name, { fontSize: 14, color: "#374151" }));
    els.push(line(e.x, e.y + 44, e.x + 220, e.y + 44, { color: "#d1d5db" }));
    els.push(text(e.x + 10, e.y + 62, "id (PK)", { fontSize: 12, color: "#6b7280" }));
    els.push(text(e.x + 10, e.y + 84, "field", { fontSize: 12, color: "#6b7280" }));
  }
  // Relationships
  els.push(diamond(300, 320, 120, 90, { fillColor: "#fefce8", color: "#eab308" }));
  els.push(text(325, 356, "places", { fontSize: 12, color: "#854d0e" }));
  els.push(diamond(630, 320, 120, 90, { fillColor: "#fefce8", color: "#eab308" }));
  els.push(text(650, 356, "contains", { fontSize: 12, color: "#854d0e" }));
  els.push(line(280, 270, 360, 320, { color: "#9ca3af" }));
  els.push(line(500, 270, 360, 320, { color: "#9ca3af" }));
  els.push(line(610, 270, 690, 320, { color: "#9ca3af" }));
  els.push(line(830, 270, 690, 320, { color: "#9ca3af" }));
  return els;
}

// ─── Marketing Templates ─────────────────────────────────

function marketingPlan(): WhiteboardElement[] {
  return stackSections(
    "Marketing Plan",
    "#374151",
    [
      { label: "Executive Summary", h: 90, bg: "#eff6ff" },
      { label: "Target Market", h: 90, bg: "#f0fdf4" },
      { label: "Goals", h: 80, bg: "#fefce8" },
      { label: "Strategy", h: 110, bg: "#f5f3ff" },
      { label: "Budget", h: 70, bg: "#fdf2f8" },
      { label: "Timeline", h: 70, bg: "#f3f4f6" },
      { label: "Metrics", h: 80, bg: "#fef2f2" },
    ],
    { w: 760 }
  );
}

function contentCalendar(): WhiteboardElement[] {
  return tableGrid(
    "Content Calendar",
    "#374151",
    ["Week", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    ["Week 1", "Week 2", "Week 3", "Week 4"],
    { cellW: 110, cellH: 56 }
  );
}

function buyerPersonaMarketing(): WhiteboardElement[] {
  return stackSections(
    "Buyer Persona",
    "#374151",
    [
      { label: "Name / Photo", h: 110, bg: "#eff6ff" },
      { label: "Demographics", h: 80, bg: "#f0fdf4" },
      { label: "Goals & Motivations", h: 100, bg: "#fefce8" },
      { label: "Pain Points", h: 90, bg: "#fef2f2" },
      { label: "Preferred Channels", h: 80, bg: "#f5f3ff" },
      { label: "Buying Triggers", h: 80, bg: "#fdf2f8" },
    ],
    { w: 760 }
  );
}

function campaignPlanner(): WhiteboardElement[] {
  return stackSections(
    "Campaign Planner",
    "#374151",
    [
      { label: "Campaign Name", h: 70, bg: "#eff6ff" },
      { label: "Objective", h: 80, bg: "#f0fdf4" },
      { label: "Target Audience", h: 80, bg: "#fefce8" },
      { label: "Channels", h: 90, bg: "#f5f3ff" },
      { label: "Timeline", h: 70, bg: "#f3f4f6" },
      { label: "Budget", h: 70, bg: "#fdf2f8" },
      { label: "KPIs", h: 80, bg: "#fef2f2" },
    ],
    { w: 760 }
  );
}

function socialMediaCalendar(): WhiteboardElement[] {
  return tableGrid(
    "Social Media Calendar",
    "#374151",
    ["Platform", "Mon", "Tue", "Wed", "Thu", "Fri"],
    ["Instagram", "TikTok", "LinkedIn", "X", "YouTube"],
    { cellW: 150, cellH: 56 }
  );
}

function customerSegmentation(): WhiteboardElement[] {
  return quad(
    "Customer Segmentation",
    "#374151",
    [
      "High Value / Low Effort",
      "High Value / High Effort",
      "Low Value / Low Effort",
      "Low Value / High Effort",
    ],
    ["#f0fdf4", "#fefce8", "#eff6ff", "#fef2f2"],
    ["#166534", "#854d0e", "#1e40af", "#dc2626"],
    { cellW: 320, cellH: 240 }
  );
}

function brandStrategy(): WhiteboardElement[] {
  return stackSections(
    "Brand Strategy",
    "#374151",
    [
      { label: "Mission", h: 80, bg: "#eff6ff" },
      { label: "Vision", h: 80, bg: "#f0fdf4" },
      { label: "Values", h: 90, bg: "#fefce8" },
      { label: "Brand Voice", h: 80, bg: "#f5f3ff" },
      { label: "Target Audience", h: 80, bg: "#fdf2f8" },
      { label: "Unique Value Proposition", h: 90, bg: "#f3f4f6" },
    ],
    { w: 760 }
  );
}

function salesFunnel(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "Sales Funnel", { fontSize: 28, color: "#374151" }));
  const stages = ["Awareness", "Interest", "Consideration", "Intent", "Purchase"];
  const fills = ["#eff6ff", "#f0fdf4", "#fefce8", "#f5f3ff", "#fdf2f8"];
  const x0 = 60, y0 = 100;
  for (let i = 0; i < stages.length; i++) {
    const w = 820 - i * 120;
    const x = x0 + i * 60;
    const y = y0 + i * 70;
    els.push(rect(x, y, w, 56, { type: "rounded-rect" as WhiteboardElement["type"], borderRadius: 18, fillColor: fills[i], color: "#d1d5db" }));
    els.push(text(x + 18, y + 18, stages[i], { fontSize: 13, color: "#374151" }));
  }
  return els;
}

function goToMarketPlan(): WhiteboardElement[] {
  return stackSections(
    "Go-To-Market Plan",
    "#374151",
    [
      { label: "Product", h: 70, bg: "#eff6ff" },
      { label: "Target Market", h: 80, bg: "#f0fdf4" },
      { label: "Pricing Strategy", h: 70, bg: "#fefce8" },
      { label: "Distribution Channels", h: 80, bg: "#f5f3ff" },
      { label: "Marketing Strategy", h: 90, bg: "#fdf2f8" },
      { label: "Sales Strategy", h: 90, bg: "#fef2f2" },
      { label: "Launch Timeline", h: 70, bg: "#f3f4f6" },
    ],
    { w: 760 }
  );
}

function marketingMix4ps(): WhiteboardElement[] {
  return quad(
    "Marketing Mix (4Ps)",
    "#374151",
    ["Product", "Price", "Place", "Promotion"],
    ["#eff6ff", "#f0fdf4", "#fefce8", "#fdf2f8"],
    ["#1e40af", "#166534", "#854d0e", "#db2777"]
  );
}

// ─── Team Building Templates ─────────────────────────────

function teamCharter(): WhiteboardElement[] {
  return stackSections(
    "Team Charter",
    "#374151",
    [
      { label: "Team Name / Mission", h: 80, bg: "#eff6ff" },
      { label: "Team Members & Roles", h: 100, bg: "#f0fdf4" },
      { label: "Goals", h: 90, bg: "#fefce8" },
      { label: "Working Agreements", h: 100, bg: "#f5f3ff" },
      { label: "Communication Plan", h: 90, bg: "#fdf2f8" },
      { label: "Decision Making Process", h: 90, bg: "#f3f4f6" },
    ],
    { w: 760 }
  );
}

function icebreakerGrid(): WhiteboardElement[] {
  return stickyGrid(
    "Icebreaker Grid",
    "#374151",
    [
      "What are you proud of?",
      "Your superpower?",
      "A song you love?",
      "Favorite food?",
      "A hobby to try?",
      "Best advice?",
      "A recent win?",
      "One word mood?",
      "Pet peeve?",
    ],
    { cols: 3 }
  );
}

function kudosBoard(): WhiteboardElement[] {
  return boardCols(
    "Kudos Board",
    "#374151",
    [
      { label: "Shoutouts", bg: "#eff6ff", sc: "#bfdbfe" },
      { label: "Thank You", bg: "#f0fdf4", sc: "#bbf7d0" },
      { label: "Great Work", bg: "#fefce8", sc: "#fef08a" },
      { label: "Above & Beyond", bg: "#fdf2f8", sc: "#fbcfe8" },
    ],
    { colW: 190, colH: 360 }
  );
}

function teamVisionBoard(): WhiteboardElement[] {
  return quad(
    "Team Vision Board",
    "#374151",
    ["Where We Are", "Where We Want to Be", "How We'll Get There", "What Success Looks Like"],
    ["#eff6ff", "#f0fdf4", "#fefce8", "#f5f3ff"],
    ["#1e40af", "#166534", "#854d0e", "#7c3aed"],
    { cellW: 320, cellH: 240 }
  );
}

function teamRoles(): WhiteboardElement[] {
  return tableGrid(
    "Team Roles",
    "#374151",
    ["Name", "Role", "Responsibilities", "Availability"],
    ["Member 1", "Member 2", "Member 3", "Member 4", "Member 5"],
    { cellW: 220, cellH: 56 }
  );
}

function teamHealthCheck(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "Team Health Check", { fontSize: 28, color: "#374151" }));
  const areas = ["Teamwork", "Codebase Health", "Speed", "Mission", "Fun", "Learning", "Support", "Ownership"];
  const x0 = 20, y0 = 90, w = 760, h = 54, gap = 10;
  for (let i = 0; i < areas.length; i++) {
    const y = y0 + i * (h + gap);
    els.push(rect(x0, y, w, h, { fillColor: i % 2 === 0 ? "#f3f4f6" : "#ffffff", color: "#d1d5db" }));
    els.push(text(x0 + 12, y + 18, areas[i], { fontSize: 12, color: "#374151" }));
    // Traffic light circles
    els.push(circle(x0 + w - 140, y + 14, 26, 26, { fillColor: "#fecaca", color: "#d1d5db" }));
    els.push(circle(x0 + w - 100, y + 14, 26, 26, { fillColor: "#fef08a", color: "#d1d5db" }));
    els.push(circle(x0 + w - 60, y + 14, 26, 26, { fillColor: "#bbf7d0", color: "#d1d5db" }));
  }
  return els;
}

function valuesExercise(): WhiteboardElement[] {
  return boardCols(
    "Values Exercise",
    "#374151",
    [
      { label: "Customer", bg: "#eff6ff", sc: "#bfdbfe" },
      { label: "Team", bg: "#f0fdf4", sc: "#bbf7d0" },
      { label: "Quality", bg: "#fefce8", sc: "#fef08a" },
      { label: "Innovation", bg: "#f5f3ff", sc: "#ddd6fe" },
      { label: "Growth", bg: "#fdf2f8", sc: "#fbcfe8" },
    ],
    { colW: 160, colH: 360, gap: 12 }
  );
}

function teamRetrospective(): WhiteboardElement[] {
  return boardCols(
    "Team Retrospective",
    "#374151",
    [
      { label: "Start Doing", bg: "#eff6ff", sc: "#bfdbfe" },
      { label: "Stop Doing", bg: "#fef2f2", sc: "#fecaca" },
      { label: "Continue Doing", bg: "#f0fdf4", sc: "#bbf7d0" },
    ],
    { colW: 230, colH: 360 }
  );
}

// ─── Additional Miro-style Templates (from category links) ───────────────

function yearInReview(): WhiteboardElement[] {
  return stackSections(
    "Year in Review",
    "#374151",
    [
      { label: "Highlights", h: 100, bg: "#eff6ff" },
      { label: "Challenges", h: 100, bg: "#fef2f2" },
      { label: "Learnings", h: 100, bg: "#f0fdf4" },
      { label: "Metrics / Milestones", h: 120, bg: "#fefce8" },
      { label: "Next Year Goals", h: 120, bg: "#f5f3ff" },
    ],
    { w: 760 }
  );
}

function digitalEventsRunbook(): WhiteboardElement[] {
  return stackSections(
    "Digital Events Runbook",
    "#374151",
    [
      { label: "Event Info", h: 80, bg: "#eff6ff" },
      { label: "Run of Show / Agenda", h: 140, bg: "#f0fdf4" },
      { label: "Speakers & Roles", h: 110, bg: "#fefce8" },
      { label: "Audience Engagement", h: 110, bg: "#fdf2f8" },
      { label: "Tech Checklist", h: 110, bg: "#f3f4f6" },
      { label: "Follow-ups", h: 90, bg: "#fef2f2" },
    ],
    { w: 760 }
  );
}

function todoList(): WhiteboardElement[] {
  return tableGrid(
    "To-Do List",
    "#374151",
    ["Task", "Owner", "Due", "Status"],
    ["Task 1", "Task 2", "Task 3", "Task 4", "Task 5", "Task 6", "Task 7", "Task 8"],
    { cellW: 220, cellH: 52 }
  );
}

function weeklyCalendar(): WhiteboardElement[] {
  return tableGrid(
    "Weekly Calendar",
    "#374151",
    ["Week", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    ["This week"],
    { cellW: 110, cellH: 120 }
  );
}

function spiderDiagram(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "Spider Diagram", { fontSize: 28, color: "#1e40af" }));
  const cx = 420, cy = 260;
  els.push(circle(cx - 70, cy - 70, 140, 140, { fillColor: "#eff6ff", color: "#3b82f6" }));
  els.push(text(cx - 40, cy - 8, "Topic", { fontSize: 16, color: "#1e40af" }));

  const legs = ["Idea 1", "Idea 2", "Idea 3", "Idea 4", "Idea 5", "Idea 6"];
  const angles = [0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3];
  for (let i = 0; i < legs.length; i++) {
    const dist = 240;
    const x = cx + dist * Math.cos(angles[i]);
    const y = cy + dist * Math.sin(angles[i]);
    els.push(line(cx, cy, x, y, { color: "#9ca3af", strokeWidth: 2 }));
    els.push(circle(x - 50, y - 35, 100, 70, { fillColor: "#f0fdf4", color: "#22c55e" }));
    els.push(text(x - 34, y - 8, legs[i], { fontSize: 12, color: "#166534" }));
  }
  return els;
}

function marketingStrategy(): WhiteboardElement[] {
  return stackSections(
    "Marketing Strategy",
    "#374151",
    [
      { label: "Objectives", h: 90, bg: "#eff6ff" },
      { label: "Target Segments", h: 90, bg: "#f0fdf4" },
      { label: "Positioning", h: 90, bg: "#fefce8" },
      { label: "Channels", h: 110, bg: "#f5f3ff" },
      { label: "Messaging", h: 90, bg: "#fdf2f8" },
      { label: "Budget & Resources", h: 90, bg: "#f3f4f6" },
      { label: "KPIs", h: 80, bg: "#fef2f2" },
    ],
    { w: 760 }
  );
}

function businessPlan(): WhiteboardElement[] {
  return stackSections(
    "Business Plan",
    "#374151",
    [
      { label: "Executive Summary", h: 90, bg: "#eff6ff" },
      { label: "Problem", h: 90, bg: "#fef2f2" },
      { label: "Solution", h: 90, bg: "#f0fdf4" },
      { label: "Market & Customers", h: 100, bg: "#fefce8" },
      { label: "Competition", h: 90, bg: "#f5f3ff" },
      { label: "Go-To-Market", h: 100, bg: "#fdf2f8" },
      { label: "Operations", h: 90, bg: "#f3f4f6" },
      { label: "Financials", h: 110, bg: "#eff6ff" },
    ],
    { w: 760 }
  );
}

function projectPlan(): WhiteboardElement[] {
  return tableGrid(
    "Project Plan",
    "#374151",
    ["Task", "Owner", "Start", "End", "Status"],
    ["Task 1", "Task 2", "Task 3", "Task 4", "Task 5", "Task 6"],
    { cellW: 160, cellH: 56 }
  );
}

function presentationDeck(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "Presentation Deck", { fontSize: 28, color: "#374151" }));
  const x0 = 20, y0 = 90, w = 820, h = 180, gap = 16;
  for (let i = 0; i < 3; i++) {
    const y = y0 + i * (h + gap);
    els.push(rect(x0, y, w, h, { fillColor: "#ffffff", color: "#d1d5db" }));
    els.push(rect(x0, y, w, 44, { fillColor: "#eff6ff", color: "#d1d5db" }));
    els.push(text(x0 + 12, y + 14, i === 0 ? "Title Slide" : `Slide ${i + 1}`, { fontSize: 14, color: "#1e40af" }));
    els.push(text(x0 + 12, y + 74, "Add content…", { fontSize: 12, color: "#6b7280" }));
  }
  return els;
}

function graphsAndCharts(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "Graphs & Charts", { fontSize: 28, color: "#374151" }));
  const charts = ["bar", "line", "pie", "column"] as const;
  for (let i = 0; i < charts.length; i++) {
    const chartType = charts[i];
    const x = 20 + (i % 2) * 420;
    const y = 90 + Math.floor(i / 2) * 270;
    els.push({
      id: uid(),
      type: "chart",
      x,
      y,
      width: 380,
      height: 240,
      chartType,
      chartTitle: `${chartType.toUpperCase()} chart`,
      chartTitleColor: "#374151",
      color: "#3b82f6",
      strokeWidth: 1,
      opacity: 1,
      chartData: {
        labels: ["A", "B", "C", "D"],
        values: [25, 50, 35, 65],
        colors: ["#3b82f6", "#22c55e", "#eab308", "#ef4444"],
      },
    });
  }
  return els;
}

function appWireframe(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "App Wireframe", { fontSize: 28, color: "#374151" }));
  const phoneX = 60, phoneY = 90, phoneW = 320, phoneH = 620;
  els.push(rect(phoneX, phoneY, phoneW, phoneH, { type: "rounded-rect" as WhiteboardElement["type"], borderRadius: 28, fillColor: "#ffffff", color: "#d1d5db" }));
  els.push(rect(phoneX + 20, phoneY + 60, phoneW - 40, 120, { fillColor: "#f3f4f6", color: "#e5e7eb" }));
  els.push(text(phoneX + 30, phoneY + 74, "Hero", { fontSize: 12, color: "#6b7280" }));
  for (let i = 0; i < 3; i++) {
    els.push(rect(phoneX + 20, phoneY + 200 + i * 110, phoneW - 40, 90, { fillColor: "#eff6ff", color: "#d1d5db" }));
    els.push(text(phoneX + 30, phoneY + 232 + i * 110, `Card ${i + 1}`, { fontSize: 12, color: "#1e40af" }));
  }
  els.push(rect(phoneX + 20, phoneY + phoneH - 80, phoneW - 40, 60, { fillColor: "#f3f4f6", color: "#e5e7eb" }));
  els.push(text(phoneX + 30, phoneY + phoneH - 62, "Bottom nav", { fontSize: 12, color: "#6b7280" }));
  return els;
}

function dashboardPrototype(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(420, 20, "Dashboard Prototype", { fontSize: 28, color: "#374151" }));
  const x0 = 420, y0 = 90, w = 520, h = 520;
  els.push(rect(x0, y0, w, h, { fillColor: "#ffffff", color: "#d1d5db" }));
  els.push(rect(x0, y0, w, 56, { fillColor: "#eff6ff", color: "#d1d5db" }));
  els.push(text(x0 + 16, y0 + 18, "Header", { fontSize: 12, color: "#1e40af" }));
  // Cards
  for (let i = 0; i < 4; i++) {
    const cx = x0 + 16 + (i % 2) * 252;
    const cy = y0 + 76 + Math.floor(i / 2) * 168;
    els.push(rect(cx, cy, 236, 150, { fillColor: "#f3f4f6", color: "#e5e7eb" }));
    els.push(text(cx + 12, cy + 14, `Widget ${i + 1}`, { fontSize: 12, color: "#6b7280" }));
  }
  return els;
}

function cloudArchitecture(): WhiteboardElement[] {
  const els: WhiteboardElement[] = [];
  els.push(text(20, 20, "Cloud Architecture", { fontSize: 28, color: "#374151" }));
  const x0 = 40, y0 = 120;
  // Client
  els.push(rect(x0, y0, 140, 70, { type: "rounded-rect" as WhiteboardElement["type"], borderRadius: 16, fillColor: "#eff6ff", color: "#3b82f6" }));
  els.push(text(x0 + 44, y0 + 26, "Client", { fontSize: 13, color: "#1e40af" }));
  // LB
  els.push(rect(x0 + 220, y0, 170, 70, { type: "rounded-rect" as WhiteboardElement["type"], borderRadius: 16, fillColor: "#f0fdf4", color: "#22c55e" }));
  els.push(text(x0 + 260, y0 + 26, "Load Balancer", { fontSize: 13, color: "#166534" }));
  // App
  els.push(rect(x0 + 470, y0 - 90, 170, 70, { type: "rounded-rect" as WhiteboardElement["type"], borderRadius: 16, fillColor: "#f5f3ff", color: "#8b5cf6" }));
  els.push(text(x0 + 520, y0 - 64, "App", { fontSize: 13, color: "#7c3aed" }));
  els.push(rect(x0 + 470, y0 + 90, 170, 70, { type: "rounded-rect" as WhiteboardElement["type"], borderRadius: 16, fillColor: "#f5f3ff", color: "#8b5cf6" }));
  els.push(text(x0 + 514, y0 + 116, "App", { fontSize: 13, color: "#7c3aed" }));
  // DB + Cache
  els.push(rect(x0 + 720, y0 - 90, 170, 70, { type: "rounded-rect" as WhiteboardElement["type"], borderRadius: 16, fillColor: "#fefce8", color: "#eab308" }));
  els.push(text(x0 + 776, y0 - 64, "DB", { fontSize: 13, color: "#854d0e" }));
  els.push(rect(x0 + 720, y0 + 90, 170, 70, { type: "rounded-rect" as WhiteboardElement["type"], borderRadius: 16, fillColor: "#fdf2f8", color: "#ec4899" }));
  els.push(text(x0 + 770, y0 + 116, "Cache", { fontSize: 13, color: "#db2777" }));

  // Arrows
  els.push(arrow(x0 + 140, y0 + 35, x0 + 220, y0 + 35, { color: "#9ca3af" }));
  els.push(arrow(x0 + 390, y0 + 35, x0 + 470, y0 - 55, { color: "#9ca3af" }));
  els.push(arrow(x0 + 390, y0 + 35, x0 + 470, y0 + 125, { color: "#9ca3af" }));
  els.push(arrow(x0 + 640, y0 - 55, x0 + 720, y0 - 55, { color: "#9ca3af" }));
  els.push(arrow(x0 + 640, y0 + 125, x0 + 720, y0 + 125, { color: "#9ca3af" }));
  return els;
}

function awsDiagram(): WhiteboardElement[] {
  const els = cloudArchitecture();
  // Replace title for clarity
  els.unshift(text(20, 60, "AWS Diagram (example)", { fontSize: 14, color: "#6b7280" }));
  return els;
}

function prioritizationMatrix(): WhiteboardElement[] {
  return quad(
    "Prioritization Matrix",
    "#7c3aed",
    ["Quick Wins", "Big Bets", "Fill-ins", "Time Sinks"],
    ["#f0fdf4", "#eff6ff", "#fefce8", "#fef2f2"],
    ["#166534", "#1e40af", "#854d0e", "#dc2626"],
    { xLabel: "Effort →", yLabel: "Impact ↑", cellW: 320, cellH: 240 }
  );
}

function retrospective4Ls(): WhiteboardElement[] {
  return boardCols(
    "Retrospective (4Ls)",
    "#7c3aed",
    [
      { label: "Liked", bg: "#f0fdf4", sc: "#bbf7d0" },
      { label: "Learned", bg: "#eff6ff", sc: "#bfdbfe" },
      { label: "Lacked", bg: "#fef2f2", sc: "#fecaca" },
      { label: "Longed For", bg: "#fefce8", sc: "#fef08a" },
    ],
    { colW: 190, colH: 360 }
  );
}

// ─── Export all templates ────────────────────────────────

export const TEMPLATES: WhiteboardTemplate[] = [
  // Education
  { id: "kwl-chart", name: "KWL Chart", category: "education", description: "Know, Want to Know, Learned columns", elements: kwlChart() },
  { id: "mind-map", name: "Mind Map", category: "education", description: "Central topic with branching subtopics", elements: mindMap() },
  { id: "venn-diagram", name: "Venn Diagram", category: "education", description: "Two overlapping sets comparison", elements: vennDiagram() },
  { id: "lesson-plan", name: "Lesson Plan", category: "education", description: "Structured lesson with objectives and activities", elements: lessonPlan() },
  { id: "timeline", name: "Timeline", category: "education", description: "Horizontal timeline with events", elements: timeline() },
  { id: "rubric", name: "Rubric", category: "education", description: "Assessment criteria grid", elements: rubric() },
  { id: "cornell-notes", name: "Cornell Notes", category: "education", description: "Cues, notes, and summary layout", elements: cornellNotes() },
  { id: "concept-map", name: "Concept Map", category: "education", description: "Central idea with linked concepts and details", elements: conceptMapEdu() },
  { id: "story-arc", name: "Story Arc", category: "education", description: "Exposition → Rising Action → Climax → Falling Action → Resolution", elements: storyArc() },
  { id: "exit-ticket", name: "Exit Ticket", category: "education", description: "3-2-1 reflection prompts", elements: exitTicket() },
  { id: "graphic-organizer", name: "Graphic Organizer", category: "education", description: "Main idea with supporting details", elements: graphicOrganizer() },
  { id: "reading-response", name: "Reading Response", category: "education", description: "Structured reading notes and analysis", elements: readingResponse() },

  // Agile
  { id: "scrum-board", name: "Scrum Board", category: "agile", description: "Backlog, To Do, In Progress, Done columns", elements: scrumBoard() },
  { id: "sprint-retro", name: "Sprint Retrospective", category: "agile", description: "What went well, what didn't, action items", elements: sprintRetro() },
  { id: "kanban-board", name: "Kanban Board", category: "agile", description: "5-column workflow board", elements: kanbanBoard() },
  { id: "user-story-map", name: "User Story Map", category: "agile", description: "Activities, steps, and user stories hierarchy", elements: userStoryMap() },
  { id: "pi-planning", name: "PI Planning", category: "agile", description: "Sprints + risks planning board", elements: piPlanning() },
  { id: "sprint-planning", name: "Sprint Planning", category: "agile", description: "Goal, stories, tasks, capacity, risks", elements: sprintPlanning() },
  { id: "moscow", name: "MoSCoW Prioritization", category: "agile", description: "Must/Should/Could/Won't prioritization", elements: moscowPrioritization() },
  { id: "definition-of-done", name: "Definition of Done", category: "agile", description: "Development, testing, review, deployment checklist", elements: definitionOfDone() },
  { id: "daily-standup", name: "Daily Standup", category: "agile", description: "Yesterday, today, blockers columns", elements: dailyStandup() },
  { id: "product-backlog", name: "Product Backlog", category: "agile", description: "New → refined → ready → in sprint workflow", elements: productBacklog() },
  { id: "agile-roadmap", name: "Agile Roadmap", category: "agile", description: "Now / Next / Later / Future roadmap", elements: agileRoadmap() },
  { id: "sprint-review", name: "Sprint Review", category: "agile", description: "Completed, demo notes, feedback, next steps", elements: sprintReview() },
  { id: "prioritization-matrix", name: "Prioritization Matrix", category: "agile", description: "Impact vs effort 2×2", elements: prioritizationMatrix() },
  { id: "retro-4ls", name: "Retrospective (4Ls)", category: "agile", description: "Liked, learned, lacked, longed for", elements: retrospective4Ls() },

  // Strategy & Planning
  { id: "swot", name: "SWOT Analysis", category: "strategy", description: "Strengths, Weaknesses, Opportunities, Threats", elements: swotAnalysis() },
  { id: "product-roadmap", name: "Product Roadmap", category: "strategy", description: "Quarterly timeline with feature cards", elements: productRoadmap() },
  { id: "stakeholder-map", name: "Stakeholder Map", category: "strategy", description: "Power vs Interest quadrant chart", elements: stakeholderMap() },
  { id: "risk-matrix", name: "Risk Matrix", category: "strategy", description: "Likelihood vs Impact grid", elements: riskMatrix() },
  { id: "decision-matrix", name: "Decision Matrix", category: "strategy", description: "Compare options against criteria", elements: decisionMatrix() },
  { id: "okr-board", name: "OKR Board", category: "strategy", description: "Objectives with key results", elements: okrBoard() },
  { id: "business-model-canvas", name: "Business Model Canvas", category: "strategy", description: "9-block business model canvas", elements: businessModelCanvas() },
  { id: "project-charter", name: "Project Charter", category: "strategy", description: "Project summary and key details", elements: projectCharterBoard() },
  { id: "pest-analysis", name: "PEST Analysis", category: "strategy", description: "Political, economic, social, technological", elements: pestAnalysis() },
  { id: "action-plan", name: "Action Plan", category: "strategy", description: "Actions with owners, dates, status", elements: actionPlan() },
  { id: "smart-goals", name: "SMART Goals", category: "strategy", description: "Specific, measurable, achievable, relevant, time-bound", elements: smartGoalsBoard() },
  { id: "competitive-analysis", name: "Competitive Analysis", category: "strategy", description: "Compare competitors by features", elements: competitiveAnalysis() },
  { id: "todo-list", name: "To-Do List", category: "strategy", description: "Task list with owner, due date, status", elements: todoList() },
  { id: "business-plan", name: "Business Plan", category: "strategy", description: "High-level plan sections (summary → financials)", elements: businessPlan() },
  { id: "project-plan", name: "Project Plan", category: "strategy", description: "Tasks with owners, dates, and status", elements: projectPlan() },

  // Meetings & Workshops
  { id: "meeting-agenda", name: "Meeting Agenda", category: "meetings", description: "Agenda, notes, and actions", elements: meetingAgenda() },
  { id: "workshop-planner", name: "Workshop Planner", category: "meetings", description: "Workshop schedule and activities", elements: workshopPlanner() },
  { id: "action-items-tracker", name: "Action Items Tracker", category: "meetings", description: "Track action items through completion", elements: actionItemsTracker() },
  { id: "meeting-notes", name: "Meeting Notes", category: "meetings", description: "Discussion points, decisions, follow-up", elements: meetingNotes() },
  { id: "weekly-review", name: "Weekly Review", category: "meetings", description: "Wins, challenges, learnings, next week focus", elements: weeklyReview() },
  { id: "one-on-one", name: "1-on-1 Meeting", category: "meetings", description: "Check-in, updates, feedback, goals", elements: oneOnOneMeeting() },
  { id: "team-sync", name: "Team Sync", category: "meetings", description: "Updates, blockers, help, announcements", elements: teamSync() },
  { id: "all-hands", name: "All-Hands Meeting", category: "meetings", description: "Company updates, highlights, Q&A", elements: allHandsMeeting() },
  { id: "status-update", name: "Status Update", category: "meetings", description: "On track / at risk / blocked / completed", elements: statusUpdate() },
  { id: "icebreaker-board", name: "Icebreaker Board", category: "meetings", description: "Fun prompts to warm up the room", elements: icebreakerBoard() },
  { id: "weekly-calendar", name: "Weekly Calendar", category: "meetings", description: "Simple week planning grid", elements: weeklyCalendar() },
  { id: "digital-events", name: "Digital Events Runbook", category: "meetings", description: "Agenda, speakers, engagement, and tech checklist", elements: digitalEventsRunbook() },
  { id: "year-in-review", name: "Year in Review", category: "meetings", description: "Reflect on highlights and set next goals", elements: yearInReview() },

  // Brainstorming
  { id: "brainstorm-board", name: "Brainstorm Board", category: "brainstorming", description: "Ideas, likes, wishes, questions", elements: brainstormBoard() },
  { id: "affinity-map", name: "Affinity Map", category: "brainstorming", description: "Group ideas into themes", elements: affinityMap() },
  { id: "crazy-8s", name: "Crazy 8s", category: "brainstorming", description: "8 rapid sketch frames", elements: crazy8s() },
  { id: "six-thinking-hats", name: "Six Thinking Hats", category: "brainstorming", description: "Six perspectives for ideation", elements: sixThinkingHats() },
  { id: "scamper", name: "SCAMPER", category: "brainstorming", description: "Structured idea prompts", elements: scamper() },
  { id: "reverse-brainstorming", name: "Reverse Brainstorming", category: "brainstorming", description: "Find causes then invert to solutions", elements: reverseBrainstorming() },
  { id: "brainwriting", name: "Brainwriting", category: "brainstorming", description: "Silent idea generation grid", elements: brainwriting() },
  { id: "lotus-diagram", name: "Lotus Diagram", category: "brainstorming", description: "Expand a main topic into sub-topics", elements: lotusDiagram() },
  { id: "spider-diagram", name: "Spider Diagram", category: "brainstorming", description: "Central topic with six idea legs", elements: spiderDiagram() },
  { id: "vision-board", name: "Vision Board", category: "brainstorming", description: "Goals, inspiration, values, actions", elements: visionBoardTemplate() },
  { id: "idea-board", name: "Idea Board", category: "brainstorming", description: "New → promising → research → execute", elements: ideaBoard() },

  // Research & Design
  { id: "customer-journey-map", name: "Customer Journey Map", category: "design", description: "Track actions, touchpoints, emotions, pain points", elements: customerJourneyMap() },
  { id: "empathy-map", name: "Empathy Map", category: "design", description: "Says, thinks, does, feels", elements: empathyMap() },
  { id: "design-sprint", name: "Design Sprint", category: "design", description: "5-day sprint board", elements: designSprint() },
  { id: "wireframe-layout", name: "Wireframe Layout", category: "design", description: "Simple page layout wireframe", elements: wireframeLayout() },
  { id: "app-wireframe", name: "App Wireframe", category: "design", description: "Mobile app wireframe frame + cards", elements: appWireframe() },
  { id: "dashboard-prototype", name: "Dashboard Prototype", category: "design", description: "Webapp dashboard layout with widgets", elements: dashboardPrototype() },
  { id: "user-persona", name: "User Persona", category: "design", description: "Persona details and insights", elements: userPersona() },
  { id: "storyboard", name: "Storyboard", category: "design", description: "6-frame storyboard with captions", elements: storyboardTemplate() },
  { id: "moodboard", name: "Moodboard", category: "design", description: "3×3 image placeholders", elements: moodboard() },
  { id: "creative-brief", name: "Creative Brief", category: "design", description: "Project overview and constraints", elements: creativeBrief() },
  { id: "raci-matrix", name: "RACI Matrix", category: "design", description: "Roles and responsibilities grid", elements: raciMatrix() },
  { id: "ux-research", name: "UX Research Board", category: "design", description: "Questions, findings, insights, recommendations", elements: uxResearchBoard() },

  // Diagrams
  { id: "basic-flowchart", name: "Basic Flowchart", category: "diagrams", description: "Start → process → decision → end", elements: basicFlowchart() },
  { id: "org-chart", name: "Org Chart", category: "diagrams", description: "3-level organization structure", elements: orgChart() },
  { id: "swimlane-diagram", name: "Swimlane Diagram", category: "diagrams", description: "Process steps by lane", elements: swimlaneDiagram() },
  { id: "gantt-chart", name: "Gantt Chart", category: "diagrams", description: "Tasks with timeline bars", elements: ganttChart() },
  { id: "network-diagram", name: "Network Diagram", category: "diagrams", description: "Nodes with connections", elements: networkDiagram() },
  { id: "fishbone-diagram", name: "Fishbone Diagram", category: "diagrams", description: "Root cause analysis layout", elements: fishboneDiagram() },
  { id: "process-map", name: "Process Map", category: "diagrams", description: "Input → steps → output", elements: processMap() },
  { id: "sipoc", name: "SIPOC Diagram", category: "diagrams", description: "Suppliers, inputs, process, outputs, customers", elements: sipocDiagram() },
  { id: "bpmn", name: "BPMN Process", category: "diagrams", description: "Basic BPMN-style process flow", elements: bpmnProcess() },
  { id: "uml-class", name: "UML Class Diagram", category: "diagrams", description: "Classes with attributes and methods", elements: umlClassDiagram() },
  { id: "sequence-diagram", name: "Sequence Diagram", category: "diagrams", description: "Messages across lifelines", elements: sequenceDiagram() },
  { id: "er-diagram", name: "ER Diagram", category: "diagrams", description: "Entities and relationships", elements: erDiagram() },
  { id: "presentation-deck", name: "Presentation Deck", category: "diagrams", description: "Slide placeholders for presenting", elements: presentationDeck() },
  { id: "graphs-and-charts", name: "Graphs & Charts", category: "diagrams", description: "Chart placeholders you can edit", elements: graphsAndCharts() },
  { id: "cloud-architecture", name: "Cloud Architecture", category: "diagrams", description: "Client → LB → app → data stores", elements: cloudArchitecture() },
  { id: "aws-diagram", name: "AWS Diagram", category: "diagrams", description: "AWS-style architecture starting point", elements: awsDiagram() },

  // Marketing
  { id: "marketing-plan", name: "Marketing Plan", category: "marketing", description: "Goals, strategy, budget, timeline, metrics", elements: marketingPlan() },
  { id: "marketing-strategy", name: "Marketing Strategy", category: "marketing", description: "Objectives, segments, positioning, channels, KPIs", elements: marketingStrategy() },
  { id: "content-calendar", name: "Content Calendar", category: "marketing", description: "Monthly planning grid", elements: contentCalendar() },
  { id: "buyer-persona", name: "Buyer Persona", category: "marketing", description: "Customer persona for marketing", elements: buyerPersonaMarketing() },
  { id: "campaign-planner", name: "Campaign Planner", category: "marketing", description: "Plan campaign objective, channels, KPIs", elements: campaignPlanner() },
  { id: "social-media-calendar", name: "Social Media Calendar", category: "marketing", description: "Platform posting schedule", elements: socialMediaCalendar() },
  { id: "customer-segmentation", name: "Customer Segmentation", category: "marketing", description: "Value vs effort segmentation", elements: customerSegmentation() },
  { id: "brand-strategy", name: "Brand Strategy", category: "marketing", description: "Mission, vision, values, voice", elements: brandStrategy() },
  { id: "sales-funnel", name: "Sales Funnel", category: "marketing", description: "Awareness to purchase funnel", elements: salesFunnel() },
  { id: "go-to-market", name: "Go-To-Market Plan", category: "marketing", description: "GTM planning board", elements: goToMarketPlan() },
  { id: "marketing-mix-4ps", name: "Marketing Mix (4Ps)", category: "marketing", description: "Product, price, place, promotion", elements: marketingMix4ps() },

  // Team Building
  { id: "team-charter", name: "Team Charter", category: "teambuilding", description: "Mission, roles, agreements, communication", elements: teamCharter() },
  { id: "icebreaker-grid", name: "Icebreaker Grid", category: "teambuilding", description: "3×3 fun prompts", elements: icebreakerGrid() },
  { id: "kudos-board", name: "Kudos Board", category: "teambuilding", description: "Celebrate wins and gratitude", elements: kudosBoard() },
  { id: "team-vision", name: "Team Vision Board", category: "teambuilding", description: "Where we are, where we want to be, how, success", elements: teamVisionBoard() },
  { id: "team-roles", name: "Team Roles", category: "teambuilding", description: "Roles and responsibilities table", elements: teamRoles() },
  { id: "team-health-check", name: "Team Health Check", category: "teambuilding", description: "Rate team areas with traffic lights", elements: teamHealthCheck() },
  { id: "values-exercise", name: "Values Exercise", category: "teambuilding", description: "Capture team values by theme", elements: valuesExercise() },
  { id: "team-retro", name: "Team Retrospective", category: "teambuilding", description: "Start/Stop/Continue retro board", elements: teamRetrospective() },
];

export const TEMPLATE_CATEGORIES = [
  { id: "education" as const, label: "Education" },
  { id: "agile" as const, label: "Agile & Scrum" },
  { id: "strategy" as const, label: "Strategy & Planning" },
  { id: "meetings" as const, label: "Meetings & Workshops" },
  { id: "brainstorming" as const, label: "Brainstorming" },
  { id: "design" as const, label: "Research & Design" },
  { id: "diagrams" as const, label: "Diagrams" },
  { id: "marketing" as const, label: "Marketing" },
  { id: "teambuilding" as const, label: "Team Building" },
];
