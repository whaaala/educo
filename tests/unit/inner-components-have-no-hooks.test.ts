import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * A COMPONENT DECLARED INSIDE ANOTHER COMPONENT MAY NOT CALL HOOKS.
 *
 * This is the rule behind a crash that was "fixed" twice and came back both times.
 *
 * React identifies a component by its function. One declared inside another is a NEW function on every
 * render, so React cannot match it to the previous tree: it unmounts the old instance and mounts a fresh
 * one, every render. Every piece of per-instance memory resets with it — `useState` goes back to its
 * initial value, `useRef` forgets, and **an effect re-runs on mount no matter what its dependency array
 * says**.
 *
 * That last one is what made this so hard to see. Both inner components in `BoxCanvas` carried a guard
 * against "Maximum update depth exceeded", each written by someone who had met the crash:
 *
 *   • `ChromeMirror` kept a `measured` ref so only the FIRST measurement was synchronous and every one
 *     after it waited for a `requestAnimationFrame` — the frame boundary being what breaks a
 *     measure → setState → measure chain.
 *   • `NodeToolbar` gave its measuring effect a `[node.id]` dependency array so it would not run on
 *     every render.
 *
 * Both guards were correct. Neither could run: a remount resets the ref and re-runs the effect. The crash
 * returned whenever a block was RESIZED, because that is the one time the geometry changes every frame —
 * and `setState` with an unchanged value is a no-op, so a still page looked perfectly healthy.
 *
 * The remedy is structural, which is why this is a test and not a comment: move the component to module
 * scope (`ChromeMirror`), or move its state up to the parent and leave it a pure render (`NodeToolbar`).
 *
 * A hook-free inner component is merely wasteful — it re-mounts, which costs a little work and nothing
 * else — so only hooks are rejected here.
 */

// Normalised at the point of reading — a CRLF checkout otherwise breaks assertions that span a line break.
const FILES = [
  "components/website/box/BoxCanvas.tsx",
  "components/website/box/BoxInspector.tsx",
  "app/website/box-demo/page.tsx",
];

/** Every hook call React recognises, plus any custom `useThing()` a file defines. */
const HOOK_CALL = /\buse[A-Z]\w*\s*\(/;

/**
 * Components declared INSIDE another function, with their bodies.
 *
 * "Inside" is read from the indentation: a top-level declaration starts at column 0, so anything indented
 * is nested in something. The body runs to the first line that closes at the same indentation.
 */
/**
 * An indented capitalised component, in each shape a component is written (BDD1-37: only `function Name(` was
 * read, so `const Name = (…) => {…}` and `const Name = function (…) {…}` slipped through):
 *   function Name(  ·  const Name = (…) =>  ·  const Name = async (…) =>  ·  const Name = function  ·  const Name = memo((…) =>
 */
const INNER_DECL = /^(\s+)(?:function\s+([A-Z]\w*)\s*[(<]|(?:const|let|var)\s+([A-Z]\w*)\s*(?::[^=]+)?=\s*(?:(?:React\.)?(?:memo|forwardRef)\s*\(\s*)?(?:async\s+)?(?:function\b|\(|[a-z_]\w*\s*=>))/;

function innerComponents(src: string): { name: string; body: string; line: number }[] {
  const lines = src.split("\n");
  const found: { name: string; body: string; line: number }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = INNER_DECL.exec(lines[i]);
    if (!m) continue;
    const indent = m[1];
    const name = m[2] ?? m[3];
    // A body closes on its own indentation: `}` for a function, `};` / `});` / `})` for an arrow or a memo().
    const closes = [`${indent}}`, `${indent}};`, `${indent}})`, `${indent}});`, `${indent})`, `${indent});`];
    let end = lines.length - 1;
    // A one-line arrow (`const A = () => <b/>;`) has no body below it.
    if (/;\s*$/.test(lines[i]) && !/[{(]\s*$/.test(lines[i])) end = i;
    else for (let j = i + 1; j < lines.length; j++) {
      if (closes.includes(lines[j])) { end = j; break; }
    }
    found.push({ name, body: lines.slice(i, end + 1).join("\n"), line: i + 1 });
  }
  return found;
}

describe("components declared inside other components", () => {
  it("the scan finds the inner components that exist, so an empty match cannot pass", () => {
    // Without this, a regex that stopped matching would make every assertion below trivially true — the
    // exact shape of failure this repo keeps meeting.
    const all = FILES.flatMap((f) => innerComponents(readFileSync(resolve(process.cwd(), f), "utf8").replace(/\r\n/g, "\n")));
    expect(all.length, "inner components are expected to exist — they are legal, just not with hooks")
      .toBeGreaterThan(0);
  });

  it("the scan reads every shape a component is written in — function, arrow, function expression, memo", () => {
    // BDD1-37: a planted arrow component that calls a hook must be caught, not only `function Name(`.
    const planted = [
      "export function Outer() {",
      "  function Decl() {",
      "    const [a] = useState(0);",
      "    return a;",
      "  }",
      "  const Arrow = ({ n }: { n: number }) => {",
      "    const r = useRef(n);",
      "    return r.current;",
      "  };",
      "  const Expr = function () {",
      "    useEffect(() => {});",
      "    return null;",
      "  };",
      "  const Memo = memo((p: { x: number }) => {",
      "    const v = useMemo(() => p.x, [p.x]);",
      "    return v;",
      "  });",
      "  const Pure = () => <b />;",
      "  const width = (3 + 4);",
      "  return <Decl />;",
      "}",
    ].join("\n");
    const found = innerComponents(planted);
    expect(found.map((c) => c.name)).toEqual(["Decl", "Arrow", "Expr", "Memo", "Pure"]);
    expect(found.filter((c) => HOOK_CALL.test(c.body)).map((c) => c.name)).toEqual(["Decl", "Arrow", "Expr", "Memo"]);
  });

  it.each(FILES)("%s: no inner component calls a hook", (file) => {
    const src = readFileSync(resolve(process.cwd(), file), "utf8").replace(/\r\n/g, "\n");
    const offenders = innerComponents(src)
      .filter((c) => HOOK_CALL.test(c.body))
      .map((c) => {
        const hook = HOOK_CALL.exec(c.body)?.[0].replace(/\s*\($/, "");
        return `${c.name} (line ${c.line}) calls ${hook}`;
      });
    expect(
      offenders,
      "an inner component re-mounts every render, so its state resets and its effects re-run — move it to "
      + "module scope, or lift its state to the parent and leave it a pure render",
    ).toEqual([]);
  });
});
