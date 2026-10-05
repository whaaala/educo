# Ponytail — the lazy-senior-dev discipline, adopted (RULE M)

Shared by the user on 2026-09-28: https://github.com/dietrichgebert/ponytail (MIT). Studied and stored here per RULE R
("captured once, extended forever"); this file is the reference the rule in `CLAUDE.md` points at.

## What it is

Ponytail is a rule set for AI coding agents (Claude Code, Copilot, Cursor and others) that makes the agent behave like a
senior developer who writes **the least code that solves the problem correctly**. Its premise: agents over-build —
they add dependencies, write components where a native feature exists, and generate verbose code. Measured by its author
against a baseline agent on twelve real tasks: **54% fewer lines, 22% fewer tokens, 20% lower cost, 27% faster, with no
cut to validation, security or accessibility.** Its own licence note: MIT, "the shortest license that works".

It ships as `AGENTS.md` (the rule set most agents auto-load), platform rule files (`.cursor/rules/ponytail.mdc`,
`.windsurf/rules/`, `.clinerules/`, `.github/copilot-instructions.md`), a `skills/` directory (`/ponytail`,
`/ponytail-review`, `/ponytail-audit`, `/ponytail-debt`, `/ponytail-gain`, `/ponytail-help`) and lifecycle `hooks/`.
Modes: `lite` · `full` · `ultra` · `off`.

## The ladder — asked in this order, AFTER the problem is understood

1. **Does this need to exist?** No → skip it (YAGNI).
2. **Already in this codebase?** Reuse it, don't rewrite.
3. **Standard library does it?** Use it.
4. **Native platform feature?** Use it (HTML, CSS, the browser, the OS).
5. **An installed dependency does it?** Use it — never add a new one for something an installed one does.
6. **One line?** One line.
7. Only then: **the minimum that works.**

## The rules, as it states them

- "The best code is the code never written."
- "Deletion over addition. Boring over clever. Fewest files possible."
- Fix the **root cause**, never the symptom, when fixing a bug.
- No unnecessary abstractions, dependencies or boilerplate. **The shortest working diff wins.**
- Mark a deliberate simplification with a known limit with a `ponytail:` comment, so `/ponytail-debt` can collect them.
- Every non-trivial piece of logic gets **one small, runnable check** that proves it works.

## What it is NOT lazy about — never on the chopping block

- Understanding the problem before writing anything.
- Input validation at trust boundaries.
- Error handling that prevents data loss.
- Security, and accessibility.
- Anything that needs calibration against real hardware.
- Explicit requirements.

## How it lands in this project

- RULE M in `CLAUDE.md` makes the ladder mandatory for every change; `tests/unit/claude-md-rules.test.ts` guards it.
- It sits beside, not above, the rules already here: Core Rule 1 (reuse `components/shared/` first — Ponytail's rung 2),
  Core Rule 11 (clean code, no `any`), rule 8 (fix what you find — Ponytail's "root cause, never the symptom"), and the
  testing rules (its "one small runnable check" is the floor; this project's BDD → unit → e2e → UAT ladder is the ceiling).
- Where Ponytail says "minimum that works" and this project says "build for every platform, theme and screen size", the
  project's scope rules decide **what** is built; Ponytail decides **how little code** builds it.
- A `ponytail:` comment is how a deliberate shortcut is recorded here too; a bug is never a shortcut (rule 8).
- The plugin itself (`/ponytail …` commands, hooks) is the user's to install; the rules apply with or without it.
