/**
 * @educo/chart core — the platform-agnostic heart of the reusable Chart component.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  PURE TypeScript ONLY. No DOM, no React, no react-native, no imports.   │
 * │  This is what lets ONE chart definition render on every surface:        │
 * │                                                                          │
 * │    lib/chart/  (types · palette · geometry)   ← you are here            │
 * │         ├── components/shared/Chart/Chart.tsx        → web   (SVG)      │
 * │         └── apps/mobile/components/Chart/Chart.tsx   → native (RN SVG)  │
 * │                                                                          │
 * │  Anything added here must stay platform-free so BOTH renderers — and    │
 * │  any future workspace (docs, whiteboard, admin, reports) — can use it.  │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

export * from "./types";
export * from "./palette";
export * from "./geometry";
