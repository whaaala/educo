import type { WhiteboardElement } from "./whiteboard-types";

export interface WhiteboardTemplate {
  id: string;
  name: string;
  category: "education" | "agile" | "project";
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

// ─── Project/Product Manager Templates ───────────────────

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

// ─── Export all templates ────────────────────────────────

export const TEMPLATES: WhiteboardTemplate[] = [
  // Education
  { id: "kwl-chart", name: "KWL Chart", category: "education", description: "Know, Want to Know, Learned columns", elements: kwlChart() },
  { id: "mind-map", name: "Mind Map", category: "education", description: "Central topic with branching subtopics", elements: mindMap() },
  { id: "venn-diagram", name: "Venn Diagram", category: "education", description: "Two overlapping sets comparison", elements: vennDiagram() },
  { id: "lesson-plan", name: "Lesson Plan", category: "education", description: "Structured lesson with objectives and activities", elements: lessonPlan() },
  { id: "timeline", name: "Timeline", category: "education", description: "Horizontal timeline with events", elements: timeline() },
  { id: "rubric", name: "Rubric", category: "education", description: "Assessment criteria grid", elements: rubric() },

  // Agile
  { id: "scrum-board", name: "Scrum Board", category: "agile", description: "Backlog, To Do, In Progress, Done columns", elements: scrumBoard() },
  { id: "sprint-retro", name: "Sprint Retrospective", category: "agile", description: "What went well, what didn't, action items", elements: sprintRetro() },
  { id: "kanban-board", name: "Kanban Board", category: "agile", description: "5-column workflow board", elements: kanbanBoard() },
  { id: "user-story-map", name: "User Story Map", category: "agile", description: "Activities, steps, and user stories hierarchy", elements: userStoryMap() },

  // Project/Product
  { id: "swot", name: "SWOT Analysis", category: "project", description: "Strengths, Weaknesses, Opportunities, Threats", elements: swotAnalysis() },
  { id: "product-roadmap", name: "Product Roadmap", category: "project", description: "Quarterly timeline with feature cards", elements: productRoadmap() },
  { id: "stakeholder-map", name: "Stakeholder Map", category: "project", description: "Power vs Interest quadrant chart", elements: stakeholderMap() },
  { id: "risk-matrix", name: "Risk Matrix", category: "project", description: "Likelihood vs Impact grid", elements: riskMatrix() },
  { id: "decision-matrix", name: "Decision Matrix", category: "project", description: "Compare options against criteria", elements: decisionMatrix() },
];

export const TEMPLATE_CATEGORIES = [
  { id: "education" as const, label: "Education" },
  { id: "agile" as const, label: "Agile" },
  { id: "project" as const, label: "Project & Product" },
];
