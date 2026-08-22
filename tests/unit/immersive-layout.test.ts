import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const read = (p: string) => fs.readFileSync(path.resolve(__dirname, "../../", p), "utf-8");

describe("Immersive workspace mode — MainLayout", () => {
  const layout = read("components/layout/MainLayout.tsx");

  it("MainLayout accepts an `immersive` prop", () => {
    expect(layout).toContain("immersive?: boolean");
    expect(layout).toContain("immersive = false");
  });

  it("auto-collapses the sidebar on entering immersive mode and restores on exit", () => {
    expect(layout).toContain("setIsCollapsed(true)");
    expect(layout).toContain("prevCollapsedRef");
    expect(layout).toContain("if (prevCollapsedRef.current !== null) setIsCollapsed(prevCollapsedRef.current)");
  });

  it("hides the global top bar by default in immersive, with a reveal handle", () => {
    expect(layout).toContain("const showHeader = !immersive || topBarShown");
    expect(layout).toContain("{showHeader && (");
    // the reveal handle toggles topBarShown and is labelled for a11y
    expect(layout).toContain("setTopBarShown((v) => !v)");
    expect(layout).toMatch(/aria-label=\{topBarShown \? "Hide top bar" : "Show top bar"\}/);
  });

  it("lets the editor fill the space (no page padding) while immersive", () => {
    expect(layout).toContain('immersive\n              ? "flex-1 overflow-hidden');
  });
});

describe("Immersive workspace mode — editor pages opt in", () => {
  it("the presentation editor is immersive", () => {
    expect(read("app/presentations/editor/page.tsx")).toContain("<MainLayout immersive>");
  });
  it("the document editor is immersive", () => {
    expect(read("app/doc-editor-test/page.tsx")).toContain("<MainLayout immersive>");
  });
});
