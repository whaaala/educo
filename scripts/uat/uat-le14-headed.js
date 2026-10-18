// HEADED UAT — BATCH LE-14 · editing (docs/TASK_TREE.md "CHECKLIST LE-14", H1 … H7). Every state BUILT THROUGH THE UI (RULE Y):
// palette tiles, clicks and Shift-clicks, the keyboard, the Inspector's controls, the layers tree's rows dragged; localStorage
// only READ. Six visible windows; every width of screens.js (RULE Z); canvas == Preview for the grouped page.
//   group    H1  Ctrl+G in place · Ctrl+Shift+G back · undo / redo · two sections refused · a line's shares kept · Preview
//   several  H2  Shift-click adds / takes out · inside a Stack without it · Mixed · the arrows move both
//   kind     H3  Stack → Side by side → Grid → Stack · two Stacks share the line · a span left behind is said · keyboard
//   style    H4  Ctrl+Alt+C / V · the ⋮ menu · the phone only · several in one undo
//   marks    H5  Set here · From a wider screen · its reset · the Per-device list · keyboard
//   layers   H6  L · rows in order · select both ways · keys · rename · hide · lock · drag · menu
//   chrome   H7  the new controls in four themes × 375 · 768 · 1280 · 1536
//   widths   H7  every width of screens.js with the layers open · a touch phone: 44 px rows, Select several
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le14-headed.js [--only=group,kind]
const path = require('path'); const fs = require('fs');
const H = require('./h.js');
const { WIDTHS } = require('./screens.js');
const { sleep, deselect, band, into, under, beside, ins, nodeOf, parentOf, expandInspector, openAll, slider, field, chip, cls, pvOpen, pvClose, sweep, site } = require('./uat-rx3-headed.js');
const { CONTRAST } = require('./uat-le13-headed.js');
const W = require('../../config/inspector.json');
const SCREEN = Object.fromEntries(Object.entries(require('../../config/layout.json').rungs).map(([k, v]) => [k, v.label]));
const OUT = path.join(__dirname, 'logs', 'le14'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const results = [];
const rec = (job, id, ok, ev) => { results.push({ job, id, ok, ev }); console.log(`[${job}] ${id} ${ok ? 'PASS' : 'FAIL'} · ${ev}`); };
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') }).catch(() => {});
const short = (x) => (x || 'none').slice(-4);

/** What is selected on the canvas (every outlined block). */
const picked = (page) => page.evaluate(() => Array.from(document.querySelectorAll('.outline-indigo-500')).map((e) => e.getAttribute('data-box-id')).filter(Boolean));
/** Shift-click a block as a person does: where it SHOWS — never under the selected block's toolbar or a handle over it. */
async function shiftClick(page, id) {
  const pt = await page.evaluate((id) => {
    const el = document.querySelector(`[data-box-id="${id}"]`); const b = el.getBoundingClientRect();
    for (const fy of [0.5, 0.3, 0.7, 0.15, 0.85]) for (const fx of [0.5, 0.3, 0.7, 0.15, 0.85, 0.05, 0.95]) {
      const x = b.left + b.width * fx, y = b.top + b.height * fy; const hit = document.elementFromPoint(x, y);
      if (hit && el.contains(hit) && !hit.closest('[role=toolbar]')) return [x, y];
    }
    return null;
  }, id);
  if (!pt) throw new Error(`no open point on ${id.slice(-4)} to Shift-click`);
  await page.keyboard.down('Shift'); await page.mouse.click(pt[0], pt[1]); await page.keyboard.up('Shift'); await sleep(page, 400);
}
const key = async (page, k) => { await page.keyboard.press(k); await sleep(page, 600); };
const rect = (page, id) => page.locator(`[data-box-id="${id}"]`).first().boundingBox();
const near = (a, b) => !!a && !!b && ['x', 'y', 'width', 'height'].every((k) => Math.abs(a[k] - b[k]) <= 1);
/** The leaves of the page in reading order (container ids skipped), from what is stored. */
async function reading(page) {
  const s = await site(page); const root = s.pages[0].root; const out = [];
  const w = (n) => { if (n.type !== 'container') out.push(n.id); (n.children || []).forEach(w); }; w(root); return out;
}
async function groupOf(page, id) { let p = await parentOf(page, id); while (p && !p.group) p = await parentOf(page, p.id); return p; }
const kind = (page) => ins(page).getByRole('group', { name: W.kind.label });

const JOBS = {
  async group(page, J) {
    const h1 = await band(page, 'Heading'); const h2 = await band(page, 'Heading'); const t = await band(page, 'Text'); await H.panel(page, false);
    const before = { h1: await rect(page, h1), h2: await rect(page, h2), t: await rect(page, t) };
    const start = JSON.stringify((await site(page)).pages[0].root);
    await H.select(page, h1); await shiftClick(page, h2);
    const sel = await picked(page);
    rec(J, 'H1 Shift-click the second Heading: both selected, "2 blocks selected"', sel.length === 2 && sel.includes(h1) && sel.includes(h2) && /2 blocks selected/.test(await ins(page).innerText()), `selected ${sel.map(short)}`);
    await key(page, 'Control+g'); await shot(page, 'H1-grouped');
    const g = await groupOf(page, h1); const order = await reading(page);
    rec(J, 'H1 Ctrl+G: one group holds both, the page reads Heading · Heading · Text (LE14-2)', !!g && (await groupOf(page, h2))?.id === g.id && JSON.stringify(order) === JSON.stringify([h1, h2, t]), `group ${short(g?.id)} · order ${order.map(short).join(' · ')}`);
    rec(J, 'H1 the group does not float, adds no gap or padding, no fixed height (LE14-3, LE14-6)', !!g && !g.position && !g.gap && !g.padding && g.height == null, JSON.stringify({ position: g?.position, gap: g?.gap, padding: g?.padding, height: g?.height }));
    const w1 = (await nodeOf(page, h1)).width, w2 = (await nodeOf(page, h2)).width;
    rec(J, 'H1 each Heading keeps its width (LE14-4)', w1 === 'auto' && w2 === 'auto', `${w1} · ${w2}`);
    const after = { h1: await rect(page, h1), h2: await rect(page, h2), t: await rect(page, t) };
    rec(J, 'H1 nothing moved on the canvas (every block within 1 px)', near(before.h1, after.h1) && near(before.h2, after.h2) && near(before.t, after.t), JSON.stringify({ before, after }));
    rec(J, 'H1 the group is selected as one block', JSON.stringify(await picked(page)) === JSON.stringify([g?.id]), `selected ${(await picked(page)).map(short)}`);
    // the Preview at every width: the same reading order, nothing sideways
    await pvOpen(page);
    const pv = await sweep(page, (f) => f.evaluate(([a, b, c]) => { const r = (s) => document.querySelector(s)?.getBoundingClientRect(); const A = r(a), B = r(b), C = r(c); if (!A || !B || !C) return 'missing'; return (A.top < B.top && B.top < C.top ? 'in order' : 'OUT OF ORDER') + (document.documentElement.scrollWidth > innerWidth ? ', sideways' : ''); }, [cls(h1), cls(h2), cls(t)]));
    await pvClose(page, 1366);
    rec(J, 'H1 the Preview at every width: Heading · Heading · Text, nothing sideways', /^in order: all \d+ widths$/.test(pv), pv);
    await key(page, 'Control+z');
    rec(J, 'H1 Ctrl+Z: ungrouped in one step', !(await groupOf(page, h1)), `group after undo: ${short((await groupOf(page, h1))?.id)}`);
    await key(page, 'Control+y');
    rec(J, 'H1 Ctrl+Y: grouped again', !!(await groupOf(page, h1)), `group after redo: ${short((await groupOf(page, h1))?.id)}`);
    await H.select(page, (await groupOf(page, h1)).id); await key(page, 'Control+Shift+g'); await shot(page, 'H1-ungrouped');
    const back = JSON.stringify((await site(page)).pages[0].root);
    rec(J, 'H1 Ctrl+Shift+G: the page as it was built — the same tree (LE14-4, LE14-5)', back === start, back === start ? 'identical' : `differs: ${back.length} vs ${start.length} chars`);
    // blocks in two sections cannot be grouped, and the button says why
    const s1 = await band(page, 'Stack'); const x = await into(page, s1, 'Heading'); const s2 = await band(page, 'Stack'); const y = await into(page, s2, 'Heading'); await H.panel(page, false);
    await H.select(page, x); await shiftClick(page, y); await expandInspector(page);
    const gb = ins(page).getByRole('button', { name: /Group these 2/ });
    const off = await gb.isDisabled().catch(() => false), why = await ins(page).getByText(W.group.cannot).count();
    await key(page, 'Control+g');
    rec(J, 'H1 a Heading in each of two Stacks: Group cannot be pressed, says why, Ctrl+G does nothing', off && why === 1 && !(await groupOf(page, x)), `disabled ${off} · reason ${why} · grouped ${!!(await groupOf(page, x))}`);
    await shot(page, 'H1-two-sections');
    // three blocks side by side, the first two grouped: the same places and sizes
    await deselect(page);
    // three Stacks on one line: each added BESIDE the one before (a drop into the line lands inside the Stack that fills it)
    const sb = await band(page, 'Side by side'); const a = await into(page, sb, 'Stack'); const b = await beside(page, a, 'Stack'); const c = await beside(page, b, 'Stack'); await H.panel(page, false);
    const rb = { a: await rect(page, a), b: await rect(page, b), c: await rect(page, c) };
    await H.select(page, a); await shiftClick(page, b); await key(page, 'Control+g');
    const ra = { a: await rect(page, a), b: await rect(page, b), c: await rect(page, c) }; const gl = await groupOf(page, a);
    rec(J, 'H1 a line of three, the first two grouped: a side by side on the line, the three where they were', !!gl && gl.direction === 'row' && near(rb.a, ra.a) && near(rb.b, ra.b) && near(rb.c, ra.c), `group ${gl?.direction} ${gl?.width} · ${JSON.stringify({ rb, ra })}`);
    await shot(page, 'H1-line');
  },

  async several(page, J) {
    const st = await band(page, 'Stack'); const a = await into(page, st, 'Heading'); const b = await into(page, st, 'Heading'); await H.panel(page, false);
    await H.select(page, a); await shiftClick(page, b);
    let sel = await picked(page);
    rec(J, 'H2 two Headings in a Stack: Shift-click adds the second, not the Stack (LE14-7)', sel.length === 2 && sel.includes(a) && sel.includes(b), `selected ${sel.map(short)} (stack ${short(st)})`);
    await shiftClick(page, b); sel = await picked(page);
    rec(J, 'H2 Shift-click it again: taken out', JSON.stringify(sel) === JSON.stringify([a]), `selected ${sel.map(short)}`);
    await deselect(page); await H.select(page, a); await expandInspector(page); await openAll(page); await slider(page, 'Rounded corners', 12);
    await H.select(page, a); await shiftClick(page, b); await expandInspector(page); await shot(page, 'H2-mixed');
    const txt = (await ins(page).innerText()).replace(/\s+/g, ' ');
    rec(J, 'H2 one with rounded corners, one without: "Rounded corners: Mixed"; a shared field shows its value', txt.includes(`Rounded corners: ${W.group.mixed}`) && /See-through: 100%/.test(txt), (txt.match(/Rounded corners: \S+/) || [''])[0] + ' · ' + (txt.match(/See-through: \S+/) || [''])[0]);
    // the arrows move both
    await deselect(page);
    const hs = []; for (let i = 0; i < 4; i++) hs.push(await band(page, 'Heading')); await H.panel(page, false);
    await H.select(page, hs[1]); await shiftClick(page, hs[2]); await page.locator('body').press('ArrowDown'); await sleep(page, 600);
    const order = (await reading(page)).filter((x) => hs.includes(x)).map((x) => hs.indexOf(x));
    rec(J, 'H2 the second and third selected, ↓: both move one place down together', JSON.stringify(order) === '[0,3,1,2]', `order ${order.join(' · ')}`);
  },

  async kind(page, J) {
    const st = await band(page, 'Stack'); const hs = []; for (let i = 0; i < 3; i++) hs.push(await into(page, st, 'Heading')); await H.panel(page, false);
    const leaves = async () => (await reading(page)).filter((x) => hs.includes(x));
    const steps = [['row', W.kind.choices.row], ['grid', W.kind.choices.grid], ['stack', W.kind.choices.stack]];
    for (const [k, label] of steps) {
      await deselect(page); await H.select(page, st); await expandInspector(page);
      await kind(page).getByRole('button', { name: label, exact: true }).click(); await sleep(page, 700);
      const n = await nodeOf(page, st); const got = n.layout === 'grid' ? 'grid' : n.direction === 'row' ? 'row' : 'stack';
      rec(J, `H3 Kind → ${label}: it is one, the three Headings kept in order`, got === k && JSON.stringify(await leaves()) === JSON.stringify(hs), `${got} · ${(await leaves()).map(short).join(' · ')}${k === 'grid' ? ` · columns ${n.columns}` : ''}`);
      await shot(page, `H3-${k}`);
    }
    await key(page, 'Control+z'); const u = await nodeOf(page, st);
    rec(J, 'H3 Ctrl+Z steps back to the Grid', u.layout === 'grid', `layout ${u.layout}`);
    // a Stack of two Stacks → Side by side: two halves (LE14-8)
    await deselect(page); // the second Stack goes UNDER the first, as a person adds it — the first fills its parent, so a drop there lands in the first
    const outer = await band(page, 'Stack'); const p = await into(page, outer, 'Stack'); const q = await under(page, p, 'Stack'); await H.panel(page, false);
    await H.select(page, outer); await expandInspector(page); await kind(page).getByRole('button', { name: W.kind.choices.row, exact: true }).click(); await sleep(page, 700);
    const rp = await rect(page, p), rq = await rect(page, q), ro = await rect(page, outer); await shot(page, 'H3-halves');
    rec(J, 'H3 a Stack of two Stacks → Side by side: two halves side by side, not full-width bands (LE14-8)', Math.abs(rp.y - rq.y) < 2 && Math.abs(rp.width - ro.width / 2) < ro.width * 0.06 && rq.x > rp.x, `p ${Math.round(rp.x)},${Math.round(rp.y)} ${Math.round(rp.width)} · q ${Math.round(rq.x)},${Math.round(rq.y)} ${Math.round(rq.width)} · of ${Math.round(ro.width)}`);
    // a Grid with a block spanning two columns → Stack: "Left behind: column spans", read out
    await deselect(page); await H.select(page, st); await expandInspector(page); await kind(page).getByRole('button', { name: W.kind.choices.grid, exact: true }).click(); await sleep(page, 700);
    await H.select(page, st); await expandInspector(page);
    await kind(page).getByRole('button', { name: W.kind.choices.row, exact: true }).click(); await sleep(page, 500);
    await kind(page).getByRole('button', { name: W.kind.choices.grid, exact: true }).click(); await sleep(page, 700);
    await H.select(page, hs[0]); await expandInspector(page); await openAll(page); await field(page, 'Columns wide', 2);
    const span = (await nodeOf(page, hs[0])).colSpan;
    await H.select(page, st); await expandInspector(page); await kind(page).getByRole('button', { name: W.kind.choices.stack, exact: true }).click(); await sleep(page, 700);
    const status = await ins(page).getByRole('status').filter({ hasText: W.kind.dropped.spans }).count(); await shot(page, 'H3-left-behind');
    rec(J, 'H3 a Grid with a block spanning two → Stack: "Left behind: column spans" (role=status)', span === 2 && status === 1, `span set ${span} · status ${status}`);
    // by keyboard: Tab to Side by side, Enter
    const target = kind(page).getByRole('button', { name: W.kind.choices.row, exact: true });
    let reached = false; for (let i = 0; i < 60 && !reached; i++) { await page.keyboard.press('Tab'); reached = await target.evaluate((e) => e === document.activeElement).catch(() => false); }
    if (reached) { await page.keyboard.press('Enter'); await sleep(page, 700); }
    const nk = await nodeOf(page, st);
    rec(J, 'H3 Kind by keyboard: Tab to "Side by side", Enter → a Side by side', reached && nk.direction === 'row' && nk.layout !== 'grid', `reached ${reached} · ${nk.layout} ${nk.direction}`);
  },

  async style(page, J) {
    const mk = async () => { const s = await band(page, 'Stack'); const t = await into(page, s, 'Text'); return [s, t]; };
    const [s1, t1] = await mk(); const [s2, t2] = await mk(); const [s3] = await mk(); const [s4] = await mk(); const [s5] = await mk(); const [s6] = await mk(); await H.panel(page, false);
    await H.select(page, s1); await expandInspector(page); await openAll(page); await slider(page, 'Rounded corners', 16); await slider(page, 'See-through', 70);
    await H.select(page, s1); await key(page, 'Control+Alt+c');
    await H.select(page, s2); await key(page, 'Control+Alt+v'); await shot(page, 'H4-pasted');
    const n2 = await nodeOf(page, s2), w2 = (await nodeOf(page, t2)).text, w1 = (await nodeOf(page, t1)).text;
    rec(J, 'H4 Ctrl+Alt+C on a styled Stack, Ctrl+Alt+V on a plain one: corners and see-through taken, its words its own', n2.radius === 16 && n2.opacity === 70 && w2 === w1 && !!(await parentOf(page, t2)), `radius ${n2.radius} · opacity ${n2.opacity} · its Text "${w2}"`);
    // the ⋮ menu
    await H.select(page, s3);
    await page.getByRole('toolbar', { name: 'Block toolbar' }).getByRole('button', { name: /More|Block actions|⋮/ }).first().click().catch(() => {}); await sleep(page, 400);
    const ps = page.getByRole('menuitem', { name: new RegExp(W.style.paste) });
    const has = await ps.count(); if (has) { await ps.first().click(); await sleep(page, 600); }
    rec(J, 'H4 the ⋮ menu has Copy style and Paste style; Paste style pastes', has > 0 && (await nodeOf(page, s3)).radius === 16, `menu item ${has} · radius ${(await nodeOf(page, s3)).radius}`);
    await page.keyboard.press('Escape');
    // on the phone screen only
    await chip(page, 'Mobile (375px)'); await H.select(page, s4); await key(page, 'Control+Alt+v');
    const n4 = await nodeOf(page, s4); await chip(page, 'Full width');
    rec(J, 'H4 pasted while editing the phone: the phone has it, the desktop keeps its own', n4.radius == null && n4.responsive?.phone?.radius === 16, `base ${n4.radius} · phone ${JSON.stringify(n4.responsive?.phone)}`);
    // several at once, one undo
    await H.select(page, s5); await shiftClick(page, s6); await key(page, 'Control+Alt+v');
    const both = (await nodeOf(page, s5)).radius === 16 && (await nodeOf(page, s6)).radius === 16;
    await key(page, 'Control+z');
    const off = (await nodeOf(page, s5)).radius == null && (await nodeOf(page, s6)).radius == null;
    rec(J, 'H4 two selected, one paste: both take it; one Ctrl+Z takes it off both', both && off, `pasted ${both} · undone ${off}`);
  },

  async marks(page, J) {
    const st = await band(page, 'Stack'); await into(page, st, 'Text'); await H.panel(page, false);
    await chip(page, 'Tablet (768px)'); await H.select(page, st); await expandInspector(page); await openAll(page); await slider(page, 'Rounded corners', 24);
    await chip(page, 'Mobile (375px)'); await H.select(page, st); await expandInspector(page); await openAll(page);
    const from = W.marks.from.replace('{screen}', SCREEN.tabletPortrait);
    rec(J, `H5 a tablet value seen on the phone: "${from}"`, (await ins(page).getByText(from).count()) > 0, `marks: ${(await ins(page).getByText(/^From /).allInnerTexts()).join(' / ')}`);
    await slider(page, 'Rounded corners', 4); await slider(page, 'See-through', 50); await shot(page, 'H5-set-here');
    const label = (name) => W.marks.resetLabel.replace('{name}', name).replace('{screen}', SCREEN.phone);
    const here = ins(page).getByRole('button', { name: label('Rounded corners') });
    rec(J, 'H5 set on the phone: "Set here" beside Rounded corners, with an icon', (await here.count()) === 1 && (await here.innerText()).includes(W.marks.here) && (await here.locator('svg').count()) === 1, `buttons ${await here.count()}`);
    await here.click(); await sleep(page, 600);
    const n = await nodeOf(page, st);
    rec(J, 'H5 "Set here" resets that one value: the phone takes the tablet\'s corners, its see-through stays', !('radius' in (n.responsive?.phone || {})) && n.responsive?.phone?.opacity === 50, JSON.stringify(n.responsive));
    await key(page, 'Control+z');
    rec(J, 'H5 one undo step brings it back', (await nodeOf(page, st)).responsive?.phone?.radius === 4, JSON.stringify((await nodeOf(page, st)).responsive?.phone));
    await H.select(page, st); await expandInspector(page);
    await ins(page).getByRole('tab', { name: 'Per-device' }).click(); await sleep(page, 400);
    const list = ins(page).getByRole('region', { name: W.marks.listTitle.replace('{screen}', SCREEN.phone) });
    const items = await list.getByRole('listitem').allInnerTexts(); await shot(page, 'H5-per-device');
    rec(J, 'H5 the Per-device tab lists what is set on the phone, each with Reset', items.length === 2 && items.every((x) => x.includes(W.marks.reset)), items.join(' | '));
    await ins(page).getByRole('tab', { name: 'Design' }).click(); await sleep(page, 300);
    // by keyboard
    // from its slider, one Tab reaches its mark
    const btn = ins(page).getByRole('button', { name: label('See-through') });
    await ins(page).getByRole('slider', { name: 'See-through', exact: true }).first().focus(); await page.keyboard.press('Tab'); await sleep(page, 200);
    const reached = await btn.evaluate((e) => e === document.activeElement).catch(() => false);
    if (reached) { await page.keyboard.press('Enter'); await sleep(page, 600); }
    rec(J, 'H5 Tab reaches "Set here" (See-through), Enter resets it', reached && !('opacity' in ((await nodeOf(page, st)).responsive?.phone || {})), `reached ${reached}`);
    await chip(page, 'Full width'); await H.select(page, st); await expandInspector(page);
    rec(J, 'H5 on the desktop: no mark', (await ins(page).getByText(W.marks.here, { exact: true }).count()) === 0, 'Set here marks: ' + (await ins(page).getByText(W.marks.here, { exact: true }).count()));
  },

  async layers(page, J) {
    const st = await band(page, 'Stack'); const hd = await into(page, st, 'Heading'); const tx = await into(page, st, 'Text'); const bt = await band(page, 'Button'); await H.panel(page, false);
    await deselect(page); await page.locator('body').press('l'); await sleep(page, 600);
    const tree = page.getByRole('tree', { name: W.layers.title });
    const rows = async () => tree.getByRole('treeitem').evaluateAll((els) => els.map((e) => [e.dataset.layerId, e.getAttribute('aria-level')]));
    let r = await rows(); await shot(page, 'H6-layers');
    rec(J, 'H6 L opens Layers: Stack ▸ Heading · Text, then Button, no band', JSON.stringify(r) === JSON.stringify([[st, '1'], [hd, '2'], [tx, '2'], [bt, '1']]), JSON.stringify(r.map(([i, l]) => [short(i), l])));
    const row = (id) => tree.locator(`[data-layer-id="${id}"]`);
    await row(tx).click(); await sleep(page, 500);
    rec(J, 'H6 a click on "Text" selects the Text on the canvas', JSON.stringify(await picked(page)) === JSON.stringify([tx]), `selected ${(await picked(page)).map(short)}`);
    await H.select(page, bt); await sleep(page, 300);
    if (!(await tree.isVisible().catch(() => false))) { await page.locator('body').press('l'); await sleep(page, 500); }
    rec(J, 'H6 a canvas click on the Button marks its row', (await row(bt).getAttribute('aria-selected')) === 'true', `aria-selected ${await row(bt).getAttribute('aria-selected')}`);
    // keys
    await row(st).focus(); await page.keyboard.press('ArrowDown'); await sleep(page, 200);
    const k1 = await page.evaluate(() => document.activeElement?.dataset.layerId);
    await page.keyboard.press('End'); const k2 = await page.evaluate(() => document.activeElement?.dataset.layerId);
    await page.keyboard.press('Home'); await page.keyboard.press('ArrowLeft'); await sleep(page, 200); const shut = (await rows()).length;
    await page.keyboard.press('ArrowRight'); await sleep(page, 200); const open = (await rows()).length;
    rec(J, 'H6 ↓ Home End ← → by keyboard', k1 === hd && k2 === bt && shut === 2 && open === 4, `↓ ${short(k1)} · End ${short(k2)} · ← ${shut} rows · → ${open} rows`);
    await page.keyboard.press('F2'); await sleep(page, 200); await page.keyboard.type('Welcome'); await page.keyboard.press('Enter'); await sleep(page, 600);
    await row(hd).click(); await sleep(page, 400); await expandInspector(page);
    const trail = (await ins(page).getByRole('navigation', { name: W.trail.label }).innerText().catch(() => '')).replace(/\s+/g, ' ');
    rec(J, 'H6 F2 renames the Stack "Welcome": the tree and the trail say so', (await nodeOf(page, st)).layerName === 'Welcome' && /Welcome/.test(trail) && /Welcome/.test(await row(st).innerText()), `layerName ${(await nodeOf(page, st)).layerName} · trail "${trail}"`);
    // hide on the phone, lock
    await chip(page, 'Mobile (375px)'); if (!(await tree.isVisible().catch(() => false))) { await page.locator('body').press('l'); await sleep(page, 500); }
    await row(tx).hover(); await row(tx).getByRole('button', { name: W.layers.hide.replace('{name}', 'Text').replace('{screen}', SCREEN.phone) }).click(); await sleep(page, 500);
    const nt = await nodeOf(page, tx); await chip(page, 'Full width');
    rec(J, 'H6 Hide while editing the phone: hidden on the phone only', nt.responsive?.phone?.hidden === true && !nt.hidden, JSON.stringify({ base: nt.hidden, phone: nt.responsive?.phone }));
    if (!(await tree.isVisible().catch(() => false))) { await page.locator('body').press('l'); await sleep(page, 500); }
    await row(bt).hover(); await row(bt).getByRole('button', { name: W.layers.lock.replace('{name}', 'Button') }).click(); await sleep(page, 500);
    rec(J, 'H6 Lock: the Button is locked', (await nodeOf(page, bt)).locked === true, `locked ${(await nodeOf(page, bt)).locked}`);
    // drag rows
    const drag = async (from, to, where) => { const b = await row(to).boundingBox(); await row(from).dragTo(row(to), { targetPosition: { x: b.width / 2, y: where === 'before' ? 2 : where === 'after' ? b.height - 2 : b.height / 2 } }); await sleep(page, 700); };
    const order = async () => (await reading(page)).filter((x) => [hd, tx, bt].includes(x)).map((x) => ({ [hd]: 'Heading', [tx]: 'Text', [bt]: 'Button' })[x]).join(' · ');
    await drag(tx, hd, 'before'); const o1 = await order();
    await drag(bt, st, 'inside'); const o2 = await order(); const inSt = (await groupOrHost(page, bt)) === st;
    await drag(st, hd, 'inside'); const o3 = await order();
    await shot(page, 'H6-dragged');
    rec(J, 'H6 drag Text above Heading → Text · Heading', o1 === 'Text · Heading · Button', o1);
    rec(J, 'H6 drag Button into the Stack → inside it, at the end', o2 === 'Text · Heading · Button' && inSt, `${o2} · in the Stack ${inSt}`);
    rec(J, 'H6 drag the Stack into its own Heading: nothing moves', o3 === o2, o3);
    // the row's menu by keyboard
    await row(hd).focus(); await page.keyboard.press('Shift+F10'); await sleep(page, 400);
    const items = await page.getByRole('menuitem').allInnerTexts();
    const want = [W.layers.duplicate, W.layers.moveUp, W.layers.moveDown, W.layers.delete];
    rec(J, 'H6 Shift+F10 opens the row\'s menu: Rename, Hide, Lock, Duplicate, Move up / down, Delete', want.every((w) => items.some((x) => x.includes(w))) && items.some((x) => x.includes('Rename')), items.map((x) => x.split('\n')[0]).join(' / '));
    const del = page.getByRole('menuitem', { name: new RegExp(W.layers.delete) }); await del.click(); await sleep(page, 600);
    rec(J, 'H6 Delete in the menu deletes the Heading', !(await nodeOf(page, hd)), `heading ${await nodeOf(page, hd) ? 'still there' : 'gone'}`);
  },

  async chrome(page, J) {
    const base = process.env.BASE || 'http://localhost:3100';
    for (const theme of ['light', 'dark', 'midnight', 'purple']) {
      await page.goto(`${base}/website/box-demo?theme=${theme}`); await page.waitForFunction(() => !!document.querySelector('[data-box-id]'), null, { timeout: 60000 }); await sleep(page, 1200);
      await page.setViewportSize({ width: 1366, height: 860 }); await sleep(page, 300);
      const st = await band(page, 'Stack'); await into(page, st, 'Heading'); await H.panel(page, false);
      for (const w of [375, 768, 1280, 1536]) {
        await page.setViewportSize({ width: w, height: 860 }); await sleep(page, 500);
        const ev = []; let ok = true;
        try {
          await H.select(page, st); await expandInspector(page);
          const k = kind(page).getByRole('button', { name: W.kind.choices.row, exact: true });
          await k.scrollIntoViewIfNeeded(); const c1 = await k.evaluate(CONTRAST); ev.push(`Kind ${c1}:1`); if (c1 < 4.5) ok = false;
          const side = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth); ev.push(`sideways ${side}`); if (side) ok = false;
          if (w === 375 || w === 1536) await shot(page, `H7-${theme}-${w}-kind`);
          await deselect(page); await page.locator('body').press('l'); await sleep(page, 600);
          const tree = page.getByRole('tree', { name: W.layers.title });
          const rowC = await tree.getByRole('treeitem').first().evaluate(CONTRAST); ev.push(`row ${rowC}:1`); if (rowC < 4.5) ok = false;
          const hint = await page.getByText(W.layers.hint).evaluate(CONTRAST); ev.push(`hint ${hint}:1`); if (hint < 4.5) ok = false;
          const clip = await tree.evaluate((t) => { const a = t.getBoundingClientRect(); return [...t.querySelectorAll('[role=treeitem]')].some((r) => r.getBoundingClientRect().right > a.right + 1); }); ev.push(`clipped ${clip}`); if (clip) ok = false;
          if (w === 375 || w === 1536) await shot(page, `H7-${theme}-${w}-layers`);
          await page.keyboard.press('Escape'); await sleep(page, 300);
        } catch (e) { ok = false; ev.push(e.message.split('\n')[0]); await shot(page, `H7-ERR-${theme}-${w}`); }
        rec(J, `H7 ${theme} · ${w}: Kind and the layers readable, nothing clipped or sideways`, ok, ev.join(' · '));
      }
    }
  },

  async widths(page, J) {
    const st = await band(page, 'Stack'); await into(page, st, 'Heading'); await into(page, st, 'Text'); await H.panel(page, false);
    const bad = [];
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 860 }); await sleep(page, 250);
      try {
        const tree = page.getByRole('tree', { name: W.layers.title });
        if (!(await tree.isVisible().catch(() => false))) { await deselect(page); await page.locator('body').press('l'); await sleep(page, 400); }
        const m = await page.evaluate(() => ({ side: document.documentElement.scrollWidth > innerWidth, rows: document.querySelectorAll('[role=treeitem]').length }));
        if (m.side || m.rows !== 3) bad.push(`${w}: rows ${m.rows}, sideways ${m.side}`);
      } catch (e) { bad.push(`${w}: ${e.message.split('\n')[0]}`); }
    }
    rec(J, `H7 every width of screens.js (${WIDTHS.length}) with Layers open: three rows, nothing sideways`, !bad.length, bad.join(' · ') || 'every width');
    // a touch phone: 44 px rows, Select several by a tap
    const browser = page.context().browser();
    const ctx = await browser.newContext({ viewport: { width: 393, height: 851 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    const tp = await ctx.newPage(); const errs = []; tp.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
    await tp.goto((process.env.BASE || 'http://localhost:3100') + '/website/box-demo', { waitUntil: 'load' });
    await tp.waitForFunction(() => !!document.querySelector('[data-box-id]'), null, { timeout: 60000 }); await sleep(tp, 1500);
    try {
      const a = await band(tp, 'Heading'); const b = await band(tp, 'Heading'); await deselect(tp); await H.panel(tp, true);
      await tp.getByRole('group', { name: W.layers.view }).getByRole('button', { name: W.layers.title }).tap(); await sleep(tp, 500);
      const tree = tp.getByRole('tree', { name: W.layers.title });
      const hts = await tree.getByRole('treeitem').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
      const btns = await tree.locator('button:not([aria-hidden=true])').evaluateAll((els) => els.map((e) => Math.round(Math.min(e.getBoundingClientRect().width, e.getBoundingClientRect().height))));
      rec(J, 'H7 touch phone 393: every row and its buttons at least 44 px', hts.every((x) => x >= 44) && btns.every((x) => x >= 44), `rows ${hts.join(',')} · buttons ${btns.join(',')}`);
      await tp.getByRole('checkbox', { name: W.layers.several }).tap(); await sleep(tp, 300);
      await tree.locator(`[data-layer-id="${a}"]`).tap(); await sleep(tp, 300); await tree.locator(`[data-layer-id="${b}"]`).tap(); await sleep(tp, 500);
      await shot(tp, 'H7-touch-several');
      const sel = await picked(tp);
      rec(J, 'H7 touch phone: Select several, two taps pick both (LE14-9)', sel.includes(a) && sel.includes(b), `selected ${sel.map(short)}`);
    } catch (e) { rec(J, 'H7 touch phone', false, e.message.split('\n')[0]); await shot(tp, 'H7-touch-ERR'); }
    rec(J, 'H7 touch phone console', !errs.length, errs.join(' | ') || 'no errors');
    await ctx.close();
  },
};
/** The Stack (or other box) the block sits in, row bands skipped. */
async function groupOrHost(page, id) { let p = await parentOf(page, id); while (p && p.rowBand) p = await parentOf(page, p.id); return p?.id; }

(async () => {
  const jobs = Object.keys(JOBS).filter((n) => !ONLY.length || ONLY.includes(n));
  let slot = 0; const queue = [...jobs];
  const worker = async (s) => {
    while (queue.length) {
      const J = queue.shift();
      const { browser, page, errs } = await H.open({ headed: true, w: 1366, h: 860, pos: [(s % 3) * 620, Math.floor(s / 3) * 480] });
      try { await JOBS[J](page, J); } catch (e) { rec(J, 'ERROR', false, `${e.message.split('\n')[0]}`); await shot(page, `ERR-${J}`); }
      rec(J, 'console', !errs.length, errs.join(' | ') || 'no errors');
      await browser.close();
    }
  };
  await Promise.all(Array.from({ length: Math.min(6, jobs.length) }, () => worker(slot++)));
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.ok);
  console.log(`SUMMARY ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})();
