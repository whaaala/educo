import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import type { WindowClass } from "@/lib/educo-ui/layout";
import { ROLES, BAR_MAX, MORE_LABEL, LISTS, LIST_WORDS, WORDS } from "@/lib/app-shell";

/**
 * A-2 changes (3) + (4) on the web — the shell draws a role's places as the window's class says (bar · rail · sidebar), the
 * bar moves the overflow under More, the place you are on is `aria-current`, the arrows walk the places; the list-detail
 * shows one pane or two. The window class is set per test (windowClass itself is proved in tests/unit/window-class.test.ts).
 */
const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
let cls: WindowClass = { width: "phone", height: "medium", shell: "bar", panes: 1 };
vi.mock("@/hooks/useWindowClass", () => ({ useWindowClass: () => cls }));
import AppShell, { placeHref } from "@/components/app-shell/AppShell";
import ListDetail from "@/components/app-shell/ListDetail";

beforeEach(() => { cleanup(); push.mockReset(); });
const teacher = ROLES.teacher.items;
const shellAs = (shell: WindowClass["shell"], path = "/") => { cls = { ...cls, shell, panes: shell === "bar" ? 1 : 2 }; return render(<AppShell role="teacher" path={path}><p>content</p></AppShell>); };

describe("AppShell", () => {
  it("a bar: the first barMax − 1 places, and More holding the rest", () => {
    shellAs("bar"); const nav = screen.getByRole("navigation", { name: "Main" });
    expect(nav.dataset.shell).toBe("bar");
    expect(screen.getAllByRole("link").map((a) => a.textContent)).toEqual(teacher.slice(0, BAR_MAX - 1).map((p) => p.label));
    const more = screen.getByRole("button", { name: MORE_LABEL }); expect(more).toHaveAttribute("aria-expanded", "false");
    act(() => { fireEvent.click(more); });
    expect(screen.getAllByRole("menuitem").map((m) => m.textContent)).toEqual(teacher.slice(BAR_MAX - 1).map((p) => p.label));
    fireEvent.click(screen.getByRole("menuitem", { name: teacher[BAR_MAX].label }));
    expect(push).toHaveBeenCalledWith(placeHref("teacher", teacher[BAR_MAX].href));
  });
  it.each(["rail", "sidebar"] as const)("a %s: every place, no More", (shell) => {
    shellAs(shell);
    expect(screen.getAllByRole("link")).toHaveLength(teacher.length);
    expect(screen.queryByRole("button", { name: MORE_LABEL })).toBeNull();
  });
  it("the place you are on is aria-current, and its sub-pages keep it so", () => {
    shellAs("rail", "/classes/jss1a");
    expect(screen.getByRole("link", { name: "Classes" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Today" })).not.toHaveAttribute("aria-current");
  });
  it("a place under More marks More while you are on it", () => {
    shellAs("bar", teacher[BAR_MAX].href);
    expect(screen.getByRole("button", { name: MORE_LABEL }).className).toMatch(/text-brand/);
  });
  it("the arrows walk the places along the shell — down a rail, across a bar — and wrap", () => {
    shellAs("rail"); const links = screen.getAllByRole("link"); links[0].focus();
    fireEvent.keyDown(links[0], { key: "ArrowDown" }); expect(document.activeElement).toBe(links[1]);
    fireEvent.keyDown(links[1], { key: "ArrowUp" }); fireEvent.keyDown(links[0], { key: "ArrowUp" }); expect(document.activeElement).toBe(links[links.length - 1]);
    cleanup(); shellAs("bar"); const bar = screen.getAllByRole("link"); bar[0].focus();
    fireEvent.keyDown(bar[0], { key: "ArrowRight" }); expect(document.activeElement).toBe(bar[1]);
    fireEvent.keyDown(bar[1], { key: "End" }); expect(document.activeElement).toBe(screen.getByRole("button", { name: MORE_LABEL }));
  });
});

describe("ListDetail (web)", () => {
  const place = teacher.find((p) => p.list === "classes")!; const rows = LISTS.classes.rows;
  it("one pane: the list (each row a link to its own URL, marked Sample); a row's URL shows its detail with Back", () => {
    render(<ListDetail role="teacher" place={place} openId={null} panes={1} />);
    expect(screen.getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual(rows.map((r) => `${placeHref("teacher", place.href)}/${r.id}`));
    expect(screen.getAllByText(WORDS.sample)).toHaveLength(rows.length);
    cleanup(); render(<ListDetail role="teacher" place={place} openId={rows[2].id} panes={1} />);
    expect(screen.getByRole("heading", { name: rows[2].title })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: LIST_WORDS.back })).toHaveAttribute("href", placeHref("teacher", place.href));
  });
  it("two panes: the list beside the first row's detail, that row current; no Back", () => {
    render(<ListDetail role="teacher" place={place} openId={null} panes={2} />);
    expect(screen.getByRole("heading", { name: rows[0].title })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: new RegExp(rows[0].title) })).toHaveAttribute("aria-current", "true");
    expect(screen.queryByRole("link", { name: LIST_WORDS.back })).toBeNull();
  });
  it("a missing row and an empty list say so", () => {
    render(<ListDetail role="teacher" place={place} openId="nope" panes={1} />); expect(screen.getByRole("status")).toHaveTextContent(LIST_WORDS.missing);
    cleanup(); render(<ListDetail role="teacher" place={teacher.find((p) => p.list === "empty")!} openId={null} panes={2} />);
    expect(screen.getByText(LIST_WORDS.empty)).toBeInTheDocument();
  });
});
