import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, basename, relative } from "node:path";

/**
 * RULE BDD — EVERY FUNCTION STARTS FROM ITS .feature (the user, 2026-10-18: "every functionality, everything we do should have
 * [a BDD] scenario… it must be followed"). A test is how a function is guarded; the .feature is where it is described first. So
 * every test file must be NAMED by a .feature (its `Guards:` line). Measured 2026-10-18: 193 of 253 were not — they are the
 * frozen backlog in config/bdd.json, which only shrinks (BATCH BDD-1). A test added from now on with no .feature fails here.
 */
const ROOT = process.cwd();
const walk = (dir: string, keep: (f: string) => boolean): string[] =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p, keep) : keep(n) ? [p] : [];
  });
const rel = (p: string) => relative(ROOT, p).replace(/\\/g, "/");

export const testFiles = (): string[] =>
  ["tests/unit", "tests/components"].flatMap((d) => walk(join(ROOT, d), (n) => /\.test\.tsx?$/.test(n))).map(rel).sort();
const FEATURES = walk(join(ROOT, "tests/features"), (n) => n.endsWith(".feature")).map((p) => readFileSync(p, "utf8")).join("\n");
export const unnamed = (files: string[], features = FEATURES): string[] => files.filter((f) => !features.includes(basename(f)));

const BACKLOG: string[] = JSON.parse(readFileSync(join(ROOT, "config/bdd.json"), "utf8")).backlog;

describe("RULE BDD — every test is named by a .feature", () => {
  it("no test outside the frozen backlog lacks its .feature", () => {
    expect(unnamed(testFiles()).filter((f) => !BACKLOG.includes(f))).toEqual([]);
  });
  it("the backlog only shrinks: an entry that is now named, or gone, is taken out of config/bdd.json", () => {
    const now = new Set(unnamed(testFiles()));
    expect(BACKLOG.filter((f) => !existsSync(join(ROOT, f)) || !now.has(f))).toEqual([]);
  });
  it("is able to fail: a test no .feature names is caught", () => {
    expect(unnamed(["tests/unit/no-such-guard-yet.test.ts"])).toEqual(["tests/unit/no-such-guard-yet.test.ts"]);
    expect(unnamed(["tests/unit/area-progress.test.ts"])).toEqual([]);
  });
});
