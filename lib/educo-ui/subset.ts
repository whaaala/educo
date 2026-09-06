/**
 * CSS SUBSETTING — ship a page only the component rules it actually uses.
 *
 * `COMPONENT_CSS` is ~65 KB and identical on every page, but a given page uses a fraction of it: a term-dates
 * page of text and a table needs nothing from the accordion, the alert, the rating or the form controls. Sending
 * all of it to every visitor is the single biggest avoidable cost in the export.
 *
 * HOW IT DECIDES. Not by inspecting the node tree and guessing which classes that will produce — that guess
 * would drift the moment a renderer changed. It reads the classes the page ACTUALLY emitted, from the rendered
 * HTML, and keeps the rules that mention one of them. The input is the output, so it cannot be wrong about what
 * the page contains.
 *
 * WHEN IN DOUBT, KEEP. A rule that names no `eu-` class at all is kept, because we cannot attribute it and a
 * missing rule means a visibly broken page. Over-shipping a few bytes is a bad day; under-shipping is a bug on
 * a school's live site.
 */

/** Every `eu-*` class name that appears in a fragment of rendered HTML. */
export function usedEuClasses(html: string): Set<string> {
  const out = new Set<string>();
  for (const m of html.matchAll(/class="([^"]*)"/g)) {
    for (const cls of m[1].split(/\s+/)) if (cls.startsWith("eu-")) out.add(cls);
  }
  return out;
}

/**
 * Split a stylesheet into top-level blocks, respecting nesting.
 *
 * A naive split on `}` tears `@media { … }` in half, so this counts braces and only breaks at depth zero.
 */
function topLevelBlocks(css: string): string[] {
  const blocks: string[] = [];
  let depth = 0, start = 0;
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) { blocks.push(css.slice(start, i + 1)); start = i + 1; }
    }
  }
  const tail = css.slice(start).trim();
  if (tail) blocks.push(tail);
  return blocks;
}

/** Does this selector name a class the page does not have? */
function selectorIsUnused(selector: string, used: Set<string>): boolean {
  const classes = [...selector.matchAll(/\.(eu-[A-Za-z0-9_-]+)/g)].map((m) => m[1]);
  if (classes.length === 0) return false;          // names no eu- class → cannot attribute → keep
  // `.eu-root .eu-alert` is only needed if the page HAS an alert; `.eu-root` alone is always needed.
  const specific = classes.filter((c) => c !== "eu-root");
  if (specific.length === 0) return false;
  return !specific.some((c) => used.has(c));
}

/**
 * Strip CSS comments.
 *
 * They are written for whoever maintains the stylesheet, not for the browser, so removing them shrinks every
 * exported page for free. It is also REQUIRED for correctness here: a selector list is split on commas, and a
 * comment containing a comma — "…the severity colour, so an action…" — produced a fragment with no class in
 * it. The "when in doubt, keep" rule then treated that fragment as needed, so alert rules shipped to pages with
 * no alert on them. The subsetter looked like it worked; it was just quietly over-shipping.
 */
export function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

/**
 * Keep only the rules a page needs.
 *
 * `@keyframes` are kept whenever any rule survives, because a rule may reference an animation by name and a
 * missing keyframes block means the animation silently does nothing — the same class of invisible failure that
 * has bitten this project before.
 */
export function subsetCss(css: string, used: Set<string>): string {
  const kept: string[] = [];
  for (const block of topLevelBlocks(stripComments(css))) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("@keyframes") || trimmed.startsWith("@font-face")) { kept.push(trimmed); continue; }

    if (trimmed.startsWith("@")) {
      // A conditional group — subset its contents and drop the wrapper if nothing survives.
      const open = trimmed.indexOf("{");
      const prelude = trimmed.slice(0, open + 1);
      const inner = trimmed.slice(open + 1, trimmed.lastIndexOf("}"));
      const innerKept = subsetCss(inner, used);
      if (innerKept.trim()) kept.push(`${prelude}${innerKept}}`);
      continue;
    }

    const selector = trimmed.slice(0, trimmed.indexOf("{"));
    // A selector list is kept if ANY of its parts is needed — dropping the whole list because one part is
    // unused would remove styling from an element that is on the page.
    const parts = selector.split(",");
    if (parts.every((p) => selectorIsUnused(p, used))) continue;
    kept.push(trimmed);
  }
  return kept.join("\n");
}
