import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
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
      const src = readFileSync(join(GUIDE_DIR, file), "utf8");
      const fm = parseFrontMatter(src);
      for (const key of REQUIRED_KEYS) {
        if (!fm[key]) missing.push(`${file}: missing '${key}'`);
      }
    }
    expect(missing, missing.join("\n")).toEqual([]);
  });

  it("sidebar references only files that exist", () => {
    // Extract the doc IDs from the sidebars.js text (simple scan — no need to evaluate JS)
    const src = readFileSync(SIDEBAR_PATH, "utf8");
    // Doc IDs are lowercase-and-hyphen strings (e.g. 'layout-story'); labels/types are Title Case or keywords.
    const ids = [...src.matchAll(/'([a-z][a-z0-9-]+)'/g)]
      .map((m) => m[1])
      .filter((id) => !["guideSidebar", "type", "category", "items", "collapsed"].includes(id));
    const missing: string[] = [];
    for (const id of ids) {
      const expected = join(GUIDE_DIR, `${id}.md`);
      try {
        readFileSync(expected);
      } catch {
        missing.push(`sidebars.js references '${id}' but docs/guide/${id}.md does not exist`);
      }
    }
    expect(missing, missing.join("\n")).toEqual([]);
  });

  it("no guide page has a broken relative link to a file that does not exist", () => {
    const broken: string[] = [];
    for (const file of guideFiles()) {
      const src = readFileSync(join(GUIDE_DIR, file), "utf8");
      // Match markdown links: [text](target) where target does not start with http or #
      const links = [...src.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)];
      for (const [, , href] of links) {
        if (href.startsWith("http") || href.startsWith("#") || href.startsWith("/")) continue;
        // Relative .md link
        const target = href.replace(/\.md$/, "").replace(/^\.\//, "");
        const targetFile = join(GUIDE_DIR, `${target}.md`);
        try {
          readFileSync(targetFile);
        } catch {
          broken.push(`${file} → ${href}`);
        }
      }
    }
    expect(broken, broken.join("\n")).toEqual([]);
  });
});
