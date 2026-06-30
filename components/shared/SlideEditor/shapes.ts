/**
 * Shape definitions for the slide editor.
 * Each shape has an SVG path (viewBox 0 0 100 100) and metadata.
 */

export interface ShapeDef {
  label: string;
  /** SVG content inside a 100x100 viewBox — can be path, rect, ellipse, polygon, etc. */
  svg: string;
  category: "shapes" | "arrows" | "callouts" | "equation";
}

// Helper to create a polygon SVG from points
const poly = (pts: string, fill = "currentColor") => `<polygon points="${pts}" fill="${fill}" />`;
const path = (d: string, fill = "currentColor") => `<path d="${d}" fill="${fill}" />`;
const rect = (x: number, y: number, w: number, h: number, rx = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="currentColor" />`;
const ellipse = (cx: number, cy: number, rx: number, ry: number) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="currentColor" />`;
const circle = (cx: number, cy: number, r: number) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="currentColor" />`;
const line = (x1: number, y1: number, x2: number, y2: number, sw = 4) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="${sw}" fill="none" />`;

export const SHAPE_DEFS: Record<string, ShapeDef> = {
  // ══════════════════════════════════════
  // SHAPES (Basic geometric shapes)
  // ══════════════════════════════════════
  // Fill (nearly) the whole bounding box so the visible rectangle matches the text
  // overlay area — otherwise top/bottom-aligned text spills outside the blue box.
  "rect":              { label: "Rectangle", category: "shapes", svg: rect(2, 2, 96, 96, 0) },
  "rect-round":        { label: "Rounded Rectangle", category: "shapes", svg: rect(2, 2, 96, 96, 10) },
  "rect-snip":         { label: "Snip Rectangle", category: "shapes", svg: path("M5 15 L80 15 L95 30 L95 85 L5 85 Z") },
  "square":            { label: "Square", category: "shapes", svg: rect(15, 15, 70, 70, 0) },
  "square-round":      { label: "Rounded Square", category: "shapes", svg: rect(15, 15, 70, 70, 12) },
  "circle":            { label: "Circle", category: "shapes", svg: circle(50, 50, 42) },
  "ellipse":           { label: "Ellipse", category: "shapes", svg: ellipse(50, 50, 45, 30) },
  "triangle":          { label: "Triangle", category: "shapes", svg: poly("50,8 95,92 5,92") },
  "triangle-right":    { label: "Right Triangle", category: "shapes", svg: poly("5,8 95,92 5,92") },
  "triangle-iso":      { label: "Isosceles Triangle", category: "shapes", svg: poly("50,8 90,92 10,92") },
  "diamond":           { label: "Diamond", category: "shapes", svg: poly("50,5 95,50 50,95 5,50") },
  "pentagon":          { label: "Pentagon", category: "shapes", svg: poly("50,5 97,38 79,95 21,95 3,38") },
  "hexagon":           { label: "Hexagon", category: "shapes", svg: poly("25,5 75,5 97,50 75,95 25,95 3,50") },
  "heptagon":          { label: "Heptagon", category: "shapes", svg: poly("50,5 88,22 97,60 74,92 26,92 3,60 12,22") },
  "octagon":           { label: "Octagon", category: "shapes", svg: poly("30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30") },
  "star":              { label: "Star (5)", category: "shapes", svg: poly("50,5 61,35 95,35 68,57 79,90 50,70 21,90 32,57 5,35 39,35") },
  "star-4":            { label: "Star (4)", category: "shapes", svg: poly("50,5 60,40 95,50 60,60 50,95 40,60 5,50 40,40") },
  "star-6":            { label: "Star (6)", category: "shapes", svg: poly("50,5 62,28 93,20 75,45 93,75 62,68 50,95 38,68 7,75 25,45 7,20 38,28") },
  "cross":             { label: "Cross", category: "shapes", svg: path("M35,5 L65,5 L65,35 L95,35 L95,65 L65,65 L65,95 L35,95 L35,65 L5,65 L5,35 L35,35 Z") },
  "heart":             { label: "Heart", category: "shapes", svg: path("M50,88 C20,65 5,45 5,30 C5,15 15,5 30,5 C40,5 47,12 50,18 C53,12 60,5 70,5 C85,5 95,15 95,30 C95,45 80,65 50,88 Z") },
  "cloud":             { label: "Cloud", category: "shapes", svg: path("M25,70 C10,70 5,58 10,50 C5,42 10,30 25,30 C28,18 42,10 55,15 C62,8 78,8 85,18 C95,22 98,35 90,45 C97,52 95,65 85,70 Z") },
  "lightning":         { label: "Lightning", category: "shapes", svg: poly("60,5 30,48 50,48 25,95 70,50 50,50") },
  "moon":              { label: "Moon", category: "shapes", svg: path("M40,5 C60,5 78,20 82,40 C86,60 75,80 58,90 C42,98 22,92 12,78 C25,85 42,78 48,62 C54,46 48,28 35,18 C30,14 35,5 40,5 Z") },
  "frame":             { label: "Frame", category: "shapes", svg: path("M5,5 L95,5 L95,95 L5,95 Z M15,15 L15,85 L85,85 L85,15 Z") },
  "parallelogram":     { label: "Parallelogram", category: "shapes", svg: poly("20,15 95,15 80,85 5,85") },
  "trapezoid":         { label: "Trapezoid", category: "shapes", svg: poly("25,15 75,15 95,85 5,85") },
  "chevron":           { label: "Chevron", category: "shapes", svg: poly("5,15 70,15 95,50 70,85 5,85 30,50") },
  "cylinder":          { label: "Cylinder", category: "shapes", svg: `${ellipse(50, 20, 40, 15)}${rect(10, 20, 80, 60, 0)}${ellipse(50, 80, 40, 15)}` },
  "ring":              { label: "Ring", category: "shapes", svg: path("M50,5 A45,45 0 1,1 49.99,5 Z M50,25 A25,25 0 1,0 50.01,25 Z") },

  // ══════════════════════════════════════
  // CHART PIE SLICES (category "chart" — used to compose a pie chart, hidden from the picker)
  // ══════════════════════════════════════
  "pie-slice-1":       { label: "Pie Slice 1", category: "chart", svg: path("M50,50 L50,8 A42,42 0 0 1 89.9,63 Z") },
  "pie-slice-2":       { label: "Pie Slice 2", category: "chart", svg: path("M50,50 L89.9,63 A42,42 0 0 1 37,89.9 Z") },
  "pie-slice-3":       { label: "Pie Slice 3", category: "chart", svg: path("M50,50 L37,89.9 A42,42 0 0 1 10.1,37 Z") },
  "pie-slice-4":       { label: "Pie Slice 4", category: "chart", svg: path("M50,50 L10.1,37 A42,42 0 0 1 50,8 Z") },

  // ══════════════════════════════════════
  // ARROWS
  // ══════════════════════════════════════
  "arrow-right":       { label: "Arrow Right", category: "arrows", svg: poly("5,30 60,30 60,10 95,50 60,90 60,70 5,70") },
  "arrow-left":        { label: "Arrow Left", category: "arrows", svg: poly("95,30 40,30 40,10 5,50 40,90 40,70 95,70") },
  "arrow-up":          { label: "Arrow Up", category: "arrows", svg: poly("30,95 30,40 10,40 50,5 90,40 70,40 70,95") },
  "arrow-down":        { label: "Arrow Down", category: "arrows", svg: poly("30,5 30,60 10,60 50,95 90,60 70,60 70,5") },
  "arrow-right-thin":  { label: "Thin Arrow Right", category: "arrows", svg: poly("5,40 65,40 65,20 95,50 65,80 65,60 5,60") },
  "arrow-left-thin":   { label: "Thin Arrow Left", category: "arrows", svg: poly("95,40 35,40 35,20 5,50 35,80 35,60 95,60") },
  "arrow-up-thin":     { label: "Thin Arrow Up", category: "arrows", svg: poly("40,95 40,35 20,35 50,5 80,35 60,35 60,95") },
  "arrow-down-thin":   { label: "Thin Arrow Down", category: "arrows", svg: poly("40,5 40,65 20,65 50,95 80,65 60,65 60,5") },
  "arrow-double-h":    { label: "Double Arrow H", category: "arrows", svg: poly("5,50 25,25 25,40 75,40 75,25 95,50 75,75 75,60 25,60 25,75") },
  "arrow-double-v":    { label: "Double Arrow V", category: "arrows", svg: poly("50,5 75,25 60,25 60,75 75,75 50,95 25,75 40,75 40,25 25,25") },
  "arrow-bent":        { label: "Bent Arrow", category: "arrows", svg: path("M15,85 L15,35 L50,35 L50,15 L85,45 L50,75 L50,55 L35,55 L35,85 Z") },
  "arrow-uturn":       { label: "U-Turn Arrow", category: "arrows", svg: path("M20,85 L20,40 C20,20 40,10 55,10 C70,10 85,20 85,40 L85,55 L95,55 L75,75 L55,55 L65,55 L65,40 C65,30 58,25 50,25 C42,25 38,32 38,40 L38,85 Z") },
  "arrow-curved":      { label: "Curved Arrow", category: "arrows", svg: path("M20,80 C20,30 50,15 80,30 L70,15 L92,25 L80,48 L72,35 C50,22 30,38 28,70 Z") },
  "arrow-striped":     { label: "Striped Arrow", category: "arrows", svg: `${poly("60,20 60,5 95,50 60,95 60,80 5,80 5,60 60,60 60,40 5,40 5,20")}` },
  "arrow-notched":     { label: "Notched Arrow", category: "arrows", svg: poly("5,30 60,30 60,10 95,50 60,90 60,70 5,70 20,50") },
  "arrow-pentagon":    { label: "Pentagon Arrow", category: "arrows", svg: poly("5,15 65,15 95,50 65,85 5,85") },
  "arrow-chevron":     { label: "Chevron Arrow", category: "arrows", svg: poly("5,15 65,15 95,50 65,85 5,85 35,50") },

  // ══════════════════════════════════════
  // CALLOUTS
  // ══════════════════════════════════════
  "callout-rect":      { label: "Rectangle Callout", category: "callouts", svg: path("M5,5 L95,5 L95,70 L45,70 L25,95 L35,70 L5,70 Z") },
  "callout-round":     { label: "Rounded Callout", category: "callouts", svg: path("M15,5 L85,5 C92,5 95,10 95,15 L95,60 C95,67 92,70 85,70 L45,70 L25,92 L33,70 L15,70 C8,70 5,67 5,60 L5,15 C5,10 8,5 15,5 Z") },
  "callout-cloud":     { label: "Cloud Callout", category: "callouts", svg: path("M25,60 C10,60 5,50 10,42 C5,35 10,25 22,22 C25,12 38,5 50,10 C58,4 72,4 80,12 C90,15 94,28 88,38 C95,44 92,56 82,60 L45,60 L25,82 L32,60 Z") },
  "callout-oval":      { label: "Oval Callout", category: "callouts", svg: path("M50,5 C78,5 95,18 95,35 C95,52 78,65 50,65 C45,65 40,64 36,63 L20,85 L30,62 C15,57 5,47 5,35 C5,18 22,5 50,5 Z") },
  "callout-line":      { label: "Line Callout", category: "callouts", svg: `${rect(5, 5, 90, 60, 4)}${line(30, 65, 20, 92, 3)}` },
  "callout-star":      { label: "Star Burst", category: "callouts", svg: poly("50,2 56,22 75,5 64,26 92,18 72,35 98,42 74,48 92,65 68,58 78,82 58,65 50,92 42,65 22,82 32,58 8,65 26,48 2,42 28,35 8,18 36,26 25,5 44,22") },
  "callout-thought":   { label: "Thought Bubble", category: "callouts", svg: path("M50,5 C78,5 95,18 95,35 C95,52 78,65 50,65 C22,65 5,52 5,35 C5,18 22,5 50,5 Z M30,68 C28,74 22,76 20,72 Z M22,78 C20,84 14,85 13,82 Z") },
  "callout-wedge":     { label: "Wedge Callout", category: "callouts", svg: path("M5,5 L95,5 L95,65 L60,65 L30,95 L50,65 L5,65 Z") },

  // ══════════════════════════════════════
  // EQUATION / MATH
  // ══════════════════════════════════════
  "eq-plus":           { label: "Plus", category: "equation", svg: `${rect(42, 15, 16, 70, 3)}${rect(15, 42, 70, 16, 3)}` },
  "eq-minus":          { label: "Minus", category: "equation", svg: rect(15, 42, 70, 16, 3) },
  "eq-multiply":       { label: "Multiply", category: "equation", svg: path("M50,35 L65,15 L75,25 L55,50 L75,75 L65,85 L50,65 L35,85 L25,75 L45,50 L25,25 L35,15 Z") },
  "eq-divide":         { label: "Divide", category: "equation", svg: `${circle(50, 20, 8)}${rect(15, 44, 70, 12, 3)}${circle(50, 80, 8)}` },
  "eq-equals":         { label: "Equals", category: "equation", svg: `${rect(15, 32, 70, 12, 3)}${rect(15, 56, 70, 12, 3)}` },
  "eq-not-equal":      { label: "Not Equal", category: "equation", svg: `${rect(15, 32, 70, 12, 3)}${rect(15, 56, 70, 12, 3)}${path("M62,18 L38,82 L44,85 L68,21 Z")}` },
  "eq-bracket-l":      { label: "Left Bracket", category: "equation", svg: path("M60,5 L40,5 C30,5 25,15 25,30 L25,70 C25,85 30,95 40,95 L60,95 L60,88 L42,88 C38,88 35,82 35,70 L35,30 C35,18 38,12 42,12 L60,12 Z") },
  "eq-bracket-r":      { label: "Right Bracket", category: "equation", svg: path("M40,5 L60,5 C70,5 75,15 75,30 L75,70 C75,85 70,95 60,95 L40,95 L40,88 L58,88 C62,88 65,82 65,70 L65,30 C65,18 62,12 58,12 L40,12 Z") },
  "eq-brace-l":        { label: "Left Brace", category: "equation", svg: path("M65,5 L55,5 C48,5 45,12 45,22 L45,38 C45,45 40,50 35,50 C40,50 45,55 45,62 L45,78 C45,88 48,95 55,95 L65,95") },
  "eq-brace-r":        { label: "Right Brace", category: "equation", svg: path("M35,5 L45,5 C52,5 55,12 55,22 L55,38 C55,45 60,50 65,50 C60,50 55,55 55,62 L55,78 C55,88 52,95 45,95 L35,95") },

  // Lines (kept from original)
  "line-h":            { label: "Horizontal Line", category: "shapes", svg: line(5, 50, 95, 50, 3) },
  "line-v":            { label: "Vertical Line", category: "shapes", svg: line(50, 5, 50, 95, 3) },
  "line-diag":         { label: "Diagonal Line", category: "shapes", svg: line(5, 95, 95, 5, 3) },
};

/** Get shapes by category */
export function getShapesByCategory(cat: ShapeDef["category"]): [string, ShapeDef][] {
  return Object.entries(SHAPE_DEFS).filter(([, d]) => d.category === cat);
}
