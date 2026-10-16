import { describe, it, expect } from "vitest";
import { ROLES, ROLE_IDS, BAR_MAX, LISTS, shellPlaces, activePlace, shellProblems, listView, type Place } from "@/lib/app-shell";

/** A-2 change 3 — the navigation shell is DATA (config/app-shell.json); these are the rules that read it. */
const make = (n: number): Place[] => Array.from({ length: n }, (_, i) => ({ id: `p${i}`, label: `P${i}`, icon: "home", href: i ? `/p${i}` : "/" }));

describe("the shell's places per window", () => {
  it("a rail and a sidebar show every place; a bar shows them all while they fit", () => {
    for (const shell of ["rail", "sidebar"] as const) expect(shellPlaces(make(BAR_MAX + 3), shell).more).toEqual([]);
    expect(shellPlaces(make(BAR_MAX), "bar")).toMatchObject({ shown: make(BAR_MAX), more: [] });
  });
  it("one place too many → the bar shows barMax − 1 and More holds the rest, in order, nothing lost", () => {
    const items = make(BAR_MAX + 2); const { shown, more } = shellPlaces(items, "bar");
    expect(shown).toHaveLength(BAR_MAX - 1); expect([...shown, ...more]).toEqual(items);
  });
});

describe("which place a path is in", () => {
  const items = make(4);
  it("home only for itself; a place for itself and what is under it", () => {
    expect(activePlace(items, "/")?.id).toBe("p0");
    expect(activePlace(items, "/p2")?.id).toBe("p2");
    expect(activePlace(items, "/p2/42/")?.id).toBe("p2");
    expect(activePlace(items, "/p22")).toBeNull(); // a prefix of the letters is not the place
    expect(activePlace(items, "/elsewhere")).toBeNull();
  });
});

describe("the data itself (config/app-shell.json)", () => {
  it("is sound: every role named, every place complete, no id twice", () => expect(shellProblems(ROLES, BAR_MAX)).toEqual([]));
  it("each fault is caught", () => {
    expect(shellProblems({ r: { label: "R", sample: true, items: [{ id: "a", label: "A", icon: "x", href: "/" }, { id: "a", label: "B", icon: "x", href: "/b" }] } }, 5)).toEqual(["r.a: the id is used twice"]);
    expect(shellProblems({ r: { label: "R", sample: true, items: [{ id: "a", label: "A", icon: "x", href: "b" }] } }, 5)[0]).toMatch(/href starting with/);
    expect(shellProblems({ r: { label: "", sample: true, items: [] } }, 1)).toHaveLength(3);
  });
  it("the parent's places are the Educo app's five tabs; the other roles are marked as samples (decision 7)", () => {
    expect(ROLES.parent.items.map((p) => p.href)).toEqual(["/", "/children", "/fees", "/messages", "/more"]);
    expect(ROLE_IDS.filter((r) => r !== "parent").every((r) => ROLES[r].sample)).toBe(true);
  });
});

describe("list-detail: what one pane and two panes show (A-2 change 4)", () => {
  const list = LISTS.classes; const [first, second] = list.rows;
  it("one pane: the list, or the opened row's detail", () => {
    expect(listView(list, null, 1)).toMatchObject({ show: "list", row: null });
    expect(listView(list, second.id, 1)).toMatchObject({ show: "detail", row: second });
  });
  it("two panes: both — the opened row, else the first", () => {
    expect(listView(list, second.id, 2)).toMatchObject({ show: "both", row: second });
    expect(listView(list, null, 2)).toMatchObject({ show: "both", row: first });
  });
  it("an id the list does not have opens nothing and says so", () => {
    expect(listView(list, "nope", 1)).toMatchObject({ show: "list", row: null, missing: true });
    expect(listView(list, "nope", 2)).toMatchObject({ row: null, missing: true });
  });
  it("an empty list: nothing to open in either", () => {
    expect(listView(LISTS.empty, null, 2)).toMatchObject({ show: "both", row: null, missing: false });
  });
  it("every row id is unique in its list (it is the detail's URL)", () => {
    for (const l of Object.values(LISTS)) expect(new Set(l.rows.map((r) => r.id)).size).toBe(l.rows.length);
  });
});
