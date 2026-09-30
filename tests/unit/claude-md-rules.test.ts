import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * EVERY STANDING RULE IS STATED IN `CLAUDE.md`.
 *
 * The rules used to live in the memory directory and in the published Hub artifact — both of which are
 * *recalled* rather than *required*. `CLAUDE.md` is the one file a session is obliged to read, and the
 * one that says its checklists override default behaviour. A rule that is not in it is a rule that a
 * session can legitimately never see, which is exactly how "fix every bug you find" came to be broken
 * three times in one day while being, on paper, one of the project's oldest rules.
 *
 * So this asserts the register itself. It is deliberately a test rather than a promise: adding a rule
 * to the memory and forgetting to state it here is the failure mode, and a promise cannot catch it.
 *
 * Adding a rule? Put it in `CLAUDE.md` and add its key below. Never the other way round.
 */

// Line endings normalised at the point of READING — a CRLF checkout otherwise fails any assertion that
// spans a line break. Guarded by `source-reading-tests.test.ts`.
const CLAUDE = readFileSync(resolve(process.cwd(), "CLAUDE.md"), "utf8").replace(/\r\n/g, "\n");

/** Each standing rule, and a phrase that can only appear if the rule is actually stated. */
const RULES: [name: string, mustSay: RegExp][] = [
  ["Fix what you find (RULE V)", /a bug you find is a bug you \*\*fix\*\*|BUG LEDGER/i],
  ["…and it covers bugs in TESTS", /bugs in \*\*tests\*\*|bugs in TESTS/i],
  ["…and skipping one is the user's call", /never your|USER'S call/i],
  ["…nothing moves on while the ledger has an open line, at every level", /NOTHING MOVES ON WHILE THE LEDGER HAS AN OPEN LINE/],
  ["Clean code — zero errors, no `any` (RULE W)", /ZERO ERRORS/],
  ["Design galleries you can see (RULE S)", /RULE S/],
  ["Distinct, combining variations (RULE T)", /RULE T/],
  ["Playwright everything, user POV (RULE U)", /RULE U/],
  ["UAT every change in the UI (RULE X)", /RULE X/],
  ["…one UAT pass per BATCH of related changes (the user, 2026-09-30)", /ONE UAT PASS PER BATCH/],
  ["…the tree is the Bible: every request answered with where we are, where it goes, what I will do", /THE TREE IS THE BIBLE FOR EVERY REQUEST/],
  ["…every handover ends with the next session's prompt, unasked", /EVERY HANDOVER ENDS WITH THE NEXT SESSION'S PROMPT/],
  ["…say when it is time for a new session, before the heavy work", /SAY WHEN IT IS TIME FOR A NEW SESSION/],
  ["…but hand over ONLY when it is necessary: a long context AND a clean boundary", /HAND OVER ONLY WHEN IT IS NECESSARY/],
  ["…a batch is one area, at most 6 changes, its checklist written first", /at most 6 changes[\s\S]*checklist is written FIRST/],
  ["…typecheck and the unit guard still after every change", /After EVERY change, still/],
  ["…in every combination it can appear in", /EVERY combination|every combination it can appear in/i],
  ["…so the user is never the one who finds it", /user must never be the one who finds it/i],

  /**
   * RULE Y — the loophole RULE X left open, and fell through on 2026-09-26.
   *
   * "Drive the real UI in a real browser" was satisfied, on paper, by a real browser with a tree written
   * straight into `localStorage`. Six hand-seeded shapes all behaved perfectly while three separate user
   * reports stayed unreproducible, because the real drop pipeline puts wrappers, widths and stored fields
   * in the tree that no hand-written seed had. The user noticed before I did.
   */
  /**
   * RULE Z — the one that would have caught what RULE Y did not. A reversibility fix was driven on ONE
   * combination (the bottom edge of a vertical stack) and reported as done; the WIDTH round trip was never
   * run, and it lost blocks and never returned to its original size. The user found it in minutes.
   */
  ["Drive it visibly in a browser (RULE Z)", /RULE Z/],
  ["…headed, never headless, for deciding it works", /HEADED, NOT HEADLESS/],
  ["…every run labelled, and only a HEADED UAT closes a ledger line", /only a HEADED UAT closes a bug/i],
  ["…a headed UAT is the WHOLE matrix, several visible windows in parallel", /A HEADED UAT IS THE WHOLE MATRIX, RUN FAST/],
  ["…every combination at every test level, for everything, ordered 80/20", /EVERY COMBINATION, AT EVERY TEST LEVEL, FOR EVERYTHING[\s\S]*Ordered 80\/20/],
  ["…in order: UAT the function, then Preview at every size, then all combinations", /UAT → PREVIEW → ALL COMBINATIONS/],
  ["…and every step at every screen size, breakpoint and view", /EVERY STEP, AT EVERY SCREEN SIZE AND EVERY VIEW/],
  ["The design foundation is followed in everything (RULE F)", /RULE F — THE DESIGN FOUNDATION IS FOLLOWED IN EVERYTHING/],
  ["…stored in docs/web-anatomy/design-foundation/", /docs\/web-anatomy\/design-foundation\//],
  ["…with its MUST-FOLLOW checklist", /THE MUST-FOLLOW CHECKLIST is `docs\/web-anatomy\/design-foundation\/README\.md`/],
  ["…screenshot and READ the image", /READ the image/i],
  ["…functional + regression + UAT, every time", /the \*\*regression\*\* test|All three kinds, every time/i],
  ["…both axes, both directions, every arrangement", /BOTH AXES, BOTH DIRECTIONS/i],
  ["…running the suite is not the same thing", /is not this rule/i],

  /**
   * RULE Q — asked for on 2026-09-26 while the width round trip was being fixed: the repro passing is where
   * the UAT starts, and the sweep around it (structures × gestures × screens × states) is what makes a fix
   * hold for the 99th percentile of what a user actually does.
   */
  ["Sweep the combinations — the 99th percentile (RULE Q)", /RULE Q/],
  ["…the repro passing is the start, not the end", /repro passing is the START/i],
  ["…an enumerated MATRIX, not hand-picked cases", /MATRIX that is enumerated/i],
  ["…simple → medium → extremely complicated structures", /SIMPLE → MEDIUM → EXTREMELY COMPLICATED/],
  ["…real sites (awwwards.com + similar) are the benchmark, not invented shapes", /REAL SITES ARE THE BENCHMARK[\s\S]*awwwards\.com/],
  ["…on the production build, fresh after every change, in parallel", /ON THE PRODUCTION BUILD, FRESH, IN PARALLEL/],
  ["…every pass ends in Preview at every rung, units + 150% text checked", /EVERY PASS ENDS IN PREVIEW, AT EVERY RUNG, WITH THE UNITS CHECKED/],
  ["…responsive and mobile, in the same sweep — every breakpoint", /RESPONSIVE AND MOBILE, IN THE SAME SWEEP/],
  ["…every test type from the get-go: BDD → unit → integration → functional → UAT → regression", /EVERY TEST TYPE, FROM THE GET-GO, NO EXCEPTION/],

  /**
   * RULE R — the user, 2026-09-27: the builder is general-purpose (schools first, decoupled later), the research
   * is stored once in docs/web-anatomy/ + LAYOUT_BENCHMARK and it is FOLLOWED before any builder feature is built.
   */
  /**
   * RULES C · P · D — the user, 2026-09-27: the deck's component/layout patterns, the website personalities and tone,
   * and the web design rules + framework (with responsive design) are each a rule that MUST be followed.
   */
  ["Component and layout patterns from the deck (RULE C)", /RULE C — COMPONENT AND LAYOUT PATTERNS FROM THE DECK ARE FOLLOWED/],
  ["…elements → components → section components → layout patterns → pages", /elements → components → section components → layout patterns → pages/],
  ["…a missing component is a placeholder AND a recorded gap", /docs\/COMPONENT_GAPS\.md/],
  /**
   * Decided 2026-09-28: no component is built during the layout work — realistic placeholders, recorded and NAMED in
   * the page report; and every layout test is a dressed, realistic page (RULE E), never bare boxes.
   */
  ["…components stay placeholders during layout work", /COMPONENTS ARE PLACEHOLDERS DURING LAYOUT WORK/],
  ["…a placeholder is NAMED in the page report", /NAMED in the page report/],
  ["Every layout test is a realistic, dressed page (RULE E)", /RULE E — EVERY LAYOUT TEST IS A REALISTIC, DRESSED PAGE/],
  ["…a menu is a list of Link blocks, not buttons", /a list of Link blocks, not buttons/],
  ["…the structures come from the crawl, tier by tier", /page-cover\.json[\s\S]*tier by tier/],
  ["…a structure the builder cannot build is a gap to fix", /A structure the builder cannot[\s\S]*build is a GAP to fix, not a case to skip/],
  ["…bare structures do not count", /Bare structures[\s\S]*do not count/],
  ["…any user, any layout imaginable — the vocabulary of the LLM builder", /ANY user build ANY layout imaginable/],
  /** The user, 2026-09-28: a story-like layout documentation when the layout closes, and a status line on every reply. */
  ["The layout is documented as a story a user can follow (RULE L)", /RULE L — THE LAYOUT IS DOCUMENTED AS A STORY A USER CAN FOLLOW/],
  ["…kept in docs/guide/layout-story.md", /docs\/guide\/layout-story\.md/],
  ["…scenario by scenario, by example, before templates/components/LLM start", /scenario by scenario, by example[\s\S]*written BEFORE they start/],
  ["…and it grows as we go: every finished area adds its story in the same change", /IT GROWS AS WE GO — A MUST[\s\S]*added to this[\s\S]*documentation in the SAME change/],
  ["Every reply ends with where the work is and what comes next", /STATUS, ALWAYS[\s\S]*Every reply ends with where the work is and what comes next/],
  /** The user, 2026-09-28: developing countries first — Africa facing, world ready — on every change. */
  ["Developing countries first — Africa facing, world ready (RULE AF)", /RULE AF — DEVELOPING COUNTRIES FIRST: AFRICA FACING, WORLD READY/],
  ["…a measured weight budget", /Weight budget:[\s\S]*100 KB compressed[\s\S]*500 KB with images/],
  ["…slow network as a test profile, low-cost devices in the list", /Slow network is a test profile[\s\S]*Low-cost devices are in the device list/],
  ["…offline first, local payments and messaging, cheap hosting", /Offline first[\s\S]*Paystack and Flutterwave[\s\S]*Cheap to host and own/],
  ["…languages are content: Yoruba, Hausa, Igbo, Twi and more, lang per page and block", /Languages are content:[\s\S]*Yoruba, Hausa,[\s\S]*Igbo, Twi[\s\S]*`lang` per page and per block/],
  ["…detail in docs/DEVELOPING_COUNTRIES_FIRST.md", /docs\/DEVELOPING_COUNTRIES_FIRST\.md/],
  /** The user, 2026-09-28: one engine, one catalogue, one method for the whole of Educo and the application builder. */
  ["One engine, one catalogue, one method for the whole of Educo (RULE APP)", /RULE APP — ONE ENGINE, ONE CATALOGUE, ONE METHOD FOR THE WHOLE OF EDUCO AND FOR THE APPLICATION BUILDER/],
  ["…the block model is the app model; the catalogue is Educo's design system", /The block model is the app model[\s\S]*The component catalogue is Educo's design system/],
  ["…every new or rebuilt Educo feature is built from the shared model and catalogue", /every new or rebuilt Educo feature is built from the shared model and catalogue/],
  ["…the LLM builder becomes the application composer, emitting the app model, never code", /LLM builder becomes the application composer[\s\S]*never code, never raw HTML/],
  /** The user, 2026-09-28: the two risks (scope, distribution) are mitigated by rule, never omitted. */
  ["The two risks are mitigated by rule (RULE RK)", /RULE RK — THE TWO RISKS ARE MITIGATED BY RULE, NEVER LEFT TO CHANCE/],
  ["…one area at a time, measured clean before the next", /One area at a time, measured clean before the next/],
  ["…every area ships something a real school can use the day it closes", /ships something a real school can use the day it closes/],
  ["…the three rare parts are non-negotiable", /non-negotiable and never watered down/],
  ["…a pilot cohort before the components finish, distribution with an owner and a date", /pilot cohort before the components finish[\s\S]*Distribution is planned as product work with an owner and a date/],
  ["…every rule has a measurement or it is not done", /Every rule has a measurement or it is not done/],
  ["…the register lives in docs/RISKS.md", /docs\/RISKS\.md/],
  /** The user, 2026-09-28: documentation is written for and published with Docusaurus, every time. */
  ["Documentation is written for, and published with, Docusaurus (RULE DOC)", /RULE DOC — DOCUMENTATION IS WRITTEN FOR, AND PUBLISHED WITH, DOCUSAURUS/],
  ["…stored research in docs/DOCUSAURUS.md, the Markdown in docs/guide is the single source", /docs\/DOCUSAURUS\.md[\s\S]*single source/],
  /** The user, 2026-09-28: the Ponytail discipline (github.com/dietrichgebert/ponytail) is a must on every change. */
  ["Ponytail — the least code that solves it correctly (RULE M)", /RULE M — PONYTAIL: THE LEAST CODE THAT SOLVES IT CORRECTLY/],
  ["…its ladder, in order, from YAGNI to the minimum that works", /does this need to exist[\s\S]*already in this codebase[\s\S]*standard library[\s\S]*native platform feature[\s\S]*installed dependency[\s\S]*one line[\s\S]*the minimum that works/i],
  ["…stored research in docs/PONYTAIL.md", /docs\/PONYTAIL\.md/],
  ["…never on the chopping block: validation, error handling, security, accessibility", /Never on the[\s\S]*chopping block:[\s\S]*validation at trust boundaries[\s\S]*security, accessibility/],
  ["…in every session, every context, and in how the agent itself works", /IN EVERY SESSION, EVERY SECTION, EVERY CONTEXT — and in how the agent itself works/],
  ["Website personality and tone (RULE P)", /RULE P — WEBSITE PERSONALITY AND TONE ARE FOLLOWED/],
  ["…every template/theme/page declares one personality", /declares one personality/],
  ["The web design rules and framework (RULE D)", /RULE D — THE WEB DESIGN RULES AND FRAMEWORK ARE FOLLOWED/],
  ["…checked by measuring, never assumed", /Checked by measuring, never assumed/],
  ["The research is the reference (RULE R)", /RULE R — THE RESEARCH IS THE REFERENCE/],
  ["…the builder is general-purpose, schools first", /builder is GENERAL-PURPOSE/],
  ["…read the research before building any builder feature", /Before building any builder feature, read what the research says/],
  ["…captured once, extended forever", /Captured once, extended forever/],
  /** The user, 2026-09-28: MDN's element reference and the DOM Element interface are stored and followed everywhere. */
  ["MDN is the source for the elements and the DOM", /MDN IS THE SOURCE FOR THE ELEMENTS AND THE DOM/],
  ["…every element stored in html-semantics.md, the DOM Element interface in dom-element-api.md", /docs\/web-anatomy\/html-semantics\.md[\s\S]*docs\/web-anatomy\/dom-element-api\.md/],
  ["…every block publishes the element MDN says it is; every interaction is written against the DOM API", /Every block publishes the element MDN says[\s\S]*it is; every interaction is written against the DOM API/],

  ["Build it through the UI (RULE Y)", /RULE Y/],
  ["…seeding state is not UAT", /Seeding state is not UAT/i],
  ["…a seeded tree only pins a repro already found", /narrow regression guard/i],
  ["…an unreproducible bug means you built it wrong", /you have not built it the way the user did/i],
  ["Capability parity (Rule A)", /Rule A — capability parity/i],
  ["Full CRUD per item (Rule B)", /Rule B/],
  ["The component workflow needs approval", /get approval|→ \*\*get approval\*\*/i],
  ["Artifacts updated in the SAME change", /SAME change/],
  ["Living guide updated with the feature", /docs\/guide\//],
  ["Full suite before a COMMIT", /before a COMMIT/i],
  ["Never vitest and Playwright at once", /NEVER run vitest and Playwright/i],
  ["The fast gate is the browser gate", /npm run test:fast/],
  ["The production build is part of the gate", /build:check/],
  ["Stop the dev server before building", /holds `\.next\/trace`/],
  ["A load-only failure is a race, not the server", /suspect a RACE, not the server/i],
  ["Responsive Field Guide — four ingredients", /Fluid layouts/i],
  ["Container queries, not the viewport", /Container queries/i],
  ["Token-driven, no hardcoded hex", /no hardcoded hex/i],
  ["Contrast asserted, not assumed", /ASSERTED, not assumed/i],
  ["The five-rung ladder, base IS desktop", /base.{0,4} IS desktop/i],
  ["Edge-anchored resize", /edge you grab is the ONLY one that moves/i],
  ["Nothing rounded until asked", /Nothing is rounded until someone asks/i],
  ["Space by default, always overridable", /Space by default, always overridable/i],
  ["…on every element and every component", /inner spacing \(padding\) and outer spacing/i],
  ["…and measured by the page audit", /no words are closer than\s+the gutter floor/i],
  ["No alert/confirm/prompt", /No .?alert\(\)/i],
  ["Loading spinners on all pages", /PageLoader/],
  ["Every UI element actually works", /working functionality/i],
  ["WCAG 2.1 AA everywhere", /WCAG 2\.1 AA/],
  ["Keyboard path for every feature", /keyboard shortcuts/i],
  ["All themes supported", /ALL available themes|ALL themes/i],
  ["BDD feature files are the source of truth", /\.feature/],
  ["Mobile + tablet parity", /apps\/mobile\//],
  ["Verify on both emulators", /emulator/i],
  ["Session continuity — save state at the end", /project_last_session/],
  ["The task tree is the map across sessions", /THE TASK TREE IS THE MAP/],
  ["…and it is read before anything else", /READ THE TASK TREE/],
  ["…the handover is written the moment the user says new session", /THE MOMENT THE USER SAYS "new session"/],
  ["…and the tree reminds the user what is still open", /IT REMINDS THE USER TOO/],
  ["…and it is checked before anything is called done", /THE TASK TREE IS UP TO DATE/],
  ["Reuse-first component architecture", /components\/shared\//],
  ["One branch per AREA, named for the area", /One branch per AREA/],
  ["…and named for the area, not the audience", /never the audience/i],
  ["Branches stay short", /Keep a branch SHORT/],
  ["Merge through a pull request", /PULL REQUEST/],
  ["The gate is green at the merged commit", /green at the commit being merged/i],
  ["Delete the branch after merging", /delete the branch/i],

  /**
   * RULE 20 — one engine, three surfaces. Each line is here because losing it costs a rewrite, not a tidy-up:
   * a second renderer in React Native would make canvas ≠ export permanent, and an app per school would make
   * a teacher's edit wait on an App Store review.
   */
  ["The web builder is finished first", /WEB builder is finished first/i],
  ["The engine stays portable, and is guarded", /engine-stays-portable/],
  ["A phone or tablet canvas is a WebView, never a second renderer", /canvas on a phone or\s*\n?\s*tablet is a WEBVIEW/i],
  ["Why: Yoga cannot render what the builder emits", /Yoga: flexbox only/i],
  ["The built site lives inside the existing Educo app, not an app per school", /not an app\s*\n?\s*per school/i],
  ["Tablet is not a third build", /Tablet is not a third build/i],

  /**
   * THE UNITS HIERARCHY. Rule 16 said "rem / clamp() units — never a stored pixel" for months, and the product
   * shipped stored pixels in four block types, every corner radius and every shadow the whole time. A rule
   * with no guard is a rule that is not followed, so these cases pin the ORDER and the one exception, and
   * `units-not-pixels.test.ts` enforces it against the real catalogue.
   */
  ["rem and em come first", /`rem` \/ `em` first/],
  ["percent is for what is relative to its parent", /relative to its PARENT/],
  ["px only for a hairline", /1px hairline/i],
  ["a fluid clamp carries a rem in its ideal term", /carries a `rem` in its IDEAL term/],
  ["the units rule covers media too", /applies to MEDIA too/],
  ["…and it is guarded rather than merely written down", /units-not-pixels/],
];

describe("CLAUDE.md is the complete rule register", () => {
  it.each(RULES)("states the rule: %s", (_name, mustSay) => {
    expect(CLAUDE).toMatch(mustSay);
  });

  it("puts the bug rule FIRST in the AFTER checklist, where it cannot be scrolled past", () => {
    const after = CLAUDE.slice(CLAUDE.indexOf("## ✅ AFTER"));
    const firstItem = after.slice(after.indexOf("- [ ]"), after.indexOf("- [ ]") + 400);
    expect(firstItem, "the rule most often broken goes at the top of the list that is read last")
      .toMatch(/EVERY BUG IN THE LEDGER READS FIXED/);
  });

  it("opens the ledger in the BEFORE checklist, so there is somewhere to write a bug down", () => {
    const before = CLAUDE.slice(CLAUDE.indexOf("## ⚠️ BEFORE"), CLAUDE.indexOf("## ✅ AFTER"));
    expect(before).toMatch(/BUG LEDGER/);
  });

  it("links the detail rather than burying it, so the file stays readable", () => {
    expect(CLAUDE).toMatch(/docs\/FIX_WHAT_YOU_FIND\.md/);
  });

  it("has a task tree with exactly ONE place marked YOU ARE HERE, so a new session knows where to start", () => {
    const tree = readFileSync(resolve(process.cwd(), "docs/TASK_TREE.md"), "utf8").replace(/\r\n/g, "\n");
    expect(tree.match(/← YOU ARE HERE/g) ?? []).toHaveLength(1);
    expect(tree, "every session leaves a line in the log").toMatch(/## Session log/);
    expect(tree).toMatch(/Last updated: \*\*\d{4}-\d{2}-\d{2}\*\*/);
  });

  it("numbers its Core Rules in order, so a reader can tell none is missing", () => {
    const nums = [...CLAUDE.matchAll(/^### (\d+)\. /gm)].map((m) => Number(m[1]));
    expect(nums, "an out-of-order list is one somebody edited without reading").toEqual(
      Array.from({ length: nums.length }, (_, i) => i + 1),
    );
  });
});
