import { describe, it, expect } from "vitest";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * RULE DOCS — documentation clean, complete and kept current.
 * Every guide page must have front matter; every file the sidebar names must exist.
 * Failing here means a page is invisible to users or has broken metadata.
 */

const GUIDE_DIR = join(__dirname, "../../docs/guide");
const SIDEBAR_PATH = join(__dirname, "../../docs-site/sidebars.js");

// Files excluded from the user-facing site (internal engineering docs)
const EXCLUDED = new Set(["README.md"]);

// Required front-matter keys for every guide page
const REQUIRED_KEYS = ["title", "sidebar_position", "description"];

function parseFrontMatter(src: string): Record<string, string> {
  if (!src.startsWith("---")) return {};
  const end = src.indexOf("\n---", 3);
  if (end < 0) return {};
  const block = src.slice(4, end);
  const out: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const m = /^(\w[\w_-]*):\s*(.+)$/.exec(line.trim());
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}

function guideFiles(): string[] {
  return readdirSync(GUIDE_DIR)
    .filter((f) => f.endsWith(".md") && !EXCLUDED.has(f));
}

describe("docs-guard", () => {
  it("every guide page has the required front-matter keys", () => {
    const missing: string[] = [];
    for (const file of guideFiles()) {
      const src = readFileSync(join(GUIDE_DIR, file), "utf8").replace(/\r\n/g, "\n");
      const fm = parseFrontMatter(src);
      for (const key of REQUIRED_KEYS) {
        if (!fm[key]) missing.push(`${file}: missing '${key}'`);
      }
    }
    expect(missing, missing.join("\n")).toEqual([]);
  });

  it("sidebar references only files that exist", () => {
    // Extract the doc IDs from the sidebars.js text (simple scan — no need to evaluate JS)
    const src = readFileSync(SIDEBAR_PATH, "utf8").replace(/\r\n/g, "\n");
    // Doc IDs are lowercase-and-hyphen strings (e.g. 'layout-story'); labels/types are Title Case or keywords.
    const ids = [...src.matchAll(/'([a-z][a-z0-9-]+)'/g)]
      .map((m) => m[1])
      .filter((id) => !["guideSidebar", "type", "category", "items", "collapsed"].includes(id));
    const missing: string[] = [];
    for (const id of ids) {
      const expected = join(GUIDE_DIR, `${id}.md`);
      if (!existsSync(expected)) missing.push(`sidebars.js references '${id}' but docs/guide/${id}.md does not exist`);
    }
    expect(missing, missing.join("\n")).toEqual([]);
  });

  it("no guide page has a broken relative link to a file that does not exist", () => {
    const broken: string[] = [];
    for (const file of guideFiles()) {
      const src = readFileSync(join(GUIDE_DIR, file), "utf8").replace(/\r\n/g, "\n");
      // Match markdown links: [text](target) where target does not start with http or #
      const links = [...src.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)];
      for (const [, , href] of links) {
        if (href.startsWith("http") || href.startsWith("#") || href.startsWith("/")) continue;
        // A file with its own extension (a picture) is checked as itself (D3-20); a page link is a doc ID → <id>.md
        const rel = href.replace(/^\.\//, "");
        const targetFile = /\.(webp|png|jpe?g|svg|gif)$/i.test(rel) ? join(GUIDE_DIR, rel) : join(GUIDE_DIR, `${rel.replace(/\.md$/, "")}.md`);
        if (!existsSync(targetFile)) broken.push(`${file} → ${href}`);
      }
    }
    expect(broken, broken.join("\n")).toEqual([]);
  });

  // D3-21: Docusaurus 3 reads a callout title only in brackets — `:::tip Title` is printed as plain text
  it("every callout title uses the bracket syntax", () => {
    const old: string[] = [];
    for (const file of guideFiles()) {
      readFileSync(join(GUIDE_DIR, file), "utf8").replace(/\r\n/g, "\n").split("\n").forEach((line, i) => {
        if (/^:::(tip|note|info|warning|danger|caution)\s+\S/.test(line)) old.push(`${file}:${i + 1} ${line}`);
      });
    }
    expect(old, old.join("\n")).toEqual([]);
  });

  // D3-1: Infima sets --ifm-font-size-base as the html (root) size; using it again on an element applies it twice
  it("the base font size is applied once, on html only", () => {
    const css = readFileSync(join(__dirname, "../../docs-site/src/css/custom.css"), "utf8").replace(/\r\n/g, "\n");
    expect(css).not.toMatch(/font-size:\s*var\(--ifm-font-size-base\)/);
  });
});
