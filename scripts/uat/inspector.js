// THE INSPECTOR, DRIVEN THE WAY A PERSON DRIVES IT — select a block, open the section, use the control by its label.
// Every helper returns true when the control was there and used, false when it was not offered for that block.
const H = require('./h.js');

/** Open an Inspector accordion section by its title ("Meaning", "Placement", "Arrange", "Background", "Spacing"). */
async function section(page, title) {
  const head = page.getByRole('button', { name: new RegExp(`^\\s*${title}\\s*$`, 'i') }).first();
  if (!(await head.count())) return false;
  if ((await head.getAttribute('aria-expanded')) === 'false') { await head.click(); await page.waitForTimeout(250); }
  return true;
}
async function tab(page, name) { const t = page.getByRole('tab', { name }).first(); if (await t.count()) { await t.click(); await page.waitForTimeout(200); return true; } return false; }

/** What is this block? — "Page header" · "Menu" · "Main content" · "Section" · "Article / card" · "Sidebar" · "Page footer" … */
async function meaning(page, id, label) {
  await H.select(page, id); await tab(page, 'Design'); if (!(await section(page, 'Meaning'))) return false;
  // The shared dropdown (not a native <select>): open it, pick the option by its words.
  const trigger = page.getByRole('button', { name: /^What is this block/ }).first(); if (!(await trigger.count())) return false;
  // Scrolled to FIRST, as a person does: the menu closes when its panel scrolls, so a click that has to scroll the
  // Inspector opens it and shuts it again in the same moment.
  await trigger.scrollIntoViewIfNeeded(); await page.waitForTimeout(200);
  await trigger.click(); await page.waitForTimeout(250);
  const opt = page.getByRole('option', { name: new RegExp(`^\\s*${label.replace(/[/()]/g, '\\$&')}`) }).first();
  if (!(await opt.count())) { await page.keyboard.press('Escape'); return false; }
  await opt.click(); await page.waitForTimeout(250); return true;
}
/** Stays put while scrolling → "Sticks when reached". */
async function sticky(page, id) {
  await H.select(page, id); await tab(page, 'Design'); if (!(await section(page, 'Placement'))) return false;
  const tile = page.getByRole('radio', { name: /Sticks when reached/ }).or(page.getByRole('button', { name: /Sticks when reached/ })).first();
  if (!(await tile.count())) return false; await tile.click(); await page.waitForTimeout(250); return true;
}
/** A page-level section's content width: "Edge to edge" or "Centred column". */
async function contentWidth(page, id, which) {
  await H.select(page, id); await tab(page, 'Design'); if (!(await section(page, 'Arrange'))) return false;
  const b = page.getByRole('group', { name: 'Content width' }).getByRole('button', { name: which }).or(page.getByRole('radio', { name: which })).first();
  if (!(await b.count())) return false; await b.click(); await page.waitForTimeout(250); return true;
}
/** A block's width mode — "Fit" (hug its content) · "Full" · "Custom" — under Design → Size. */
async function widthMode(page, id, which) {
  await H.select(page, id); await tab(page, 'Design'); if (!(await section(page, 'Size'))) return false;
  const b = page.getByRole('group', { name: 'Width' }).getByRole('button', { name: which, exact: true }).or(page.getByRole('radio', { name: which, exact: true })).first();
  if (!(await b.count())) return false; await b.scrollIntoViewIfNeeded(); await b.click(); await page.waitForTimeout(250); return true;
}
/** Background colour, typed into the hex field and confirmed with Enter. */
async function background(page, id, hex) {
  await H.select(page, id); await tab(page, 'Design'); if (!(await section(page, 'Background'))) return false;
  const f = page.getByLabel('Background colour hex value').first(); if (!(await f.count())) return false;
  await f.fill(hex); await f.press('Enter'); await page.waitForTimeout(250); return true;
}
/** A block's words, through the Content tab's "Text" field. */
async function text(page, id, words) {
  await H.select(page, id); if (!(await tab(page, 'Content'))) return false;
  const f = page.getByLabel(/^Text$/).first(); if (!(await f.count())) return false;
  await f.fill(words); await f.blur(); await page.waitForTimeout(150); await tab(page, 'Design'); return true;
}
/** Hidden on phones (or shown only on phones: `show` = true hides it everywhere else). */
async function phoneOnly(page, id, { hideOnPhone = false, onlyOnPhone = false } = {}) {
  const chip = (n) => page.getByRole('button', { name: n }).first();
  if (onlyOnPhone) { await H.select(page, id); await tab(page, 'Per-device'); const c = page.getByLabel(/Hidden everywhere/).first(); if (!(await c.count())) return false; await c.check(); await page.waitForTimeout(200); }
  await chip('Mobile (375px)').click(); await page.waitForTimeout(500);
  await H.select(page, id); await tab(page, 'Per-device');
  const c = page.getByLabel(/Hidden on (mobile|phone)/i).first(); if (!(await c.count())) { await chip('Full width').click(); return false; }
  if (hideOnPhone) await c.check(); if (onlyOnPhone) await c.uncheck();
  await page.waitForTimeout(200); await tab(page, 'Design');
  await chip('Full width').click(); await page.waitForTimeout(500); return true;
}
/** A Text style toggle ("Bold" · "Italic" · "Underline") set to on or off. */
async function textToggle(page, id, name, on) {
  // A container's Text style is on the Design tab; a single block's is on the Content tab.
  await H.select(page, id);
  let b = null;
  for (const t of ['Content', 'Design']) { await tab(page, t); if (await section(page, 'Text style')) { const c = page.getByRole('button', { name, exact: true }).first(); if (await c.count()) { b = c; break; } } }
  if (!b) return false;
  await b.scrollIntoViewIfNeeded(); if (((await b.getAttribute('aria-pressed')) === 'true') !== on) { await b.click(); await page.waitForTimeout(200); }
  return true;
}
/** An Arrange spacing slider ("Space between blocks" · "Space across" · "Space down") moved with the arrow keys to `px`. */
async function spacing(page, id, name, px) {
  await H.select(page, id); await tab(page, 'Design'); if (!(await section(page, 'Arrange'))) return false;
  const s = page.getByRole('slider', { name: new RegExp('^' + name) }).first(); if (!(await s.count())) return false;
  await s.scrollIntoViewIfNeeded(); await s.focus();
  for (let k = 0; k < 200; k++) {
    const now = +(await s.getAttribute('aria-valuenow') ?? await s.inputValue());
    if (now === px) break;
    await page.keyboard.press(now < px ? 'ArrowRight' : 'ArrowLeft');
  }
  await page.waitForTimeout(300); return true;
}
/** A block's "Text size" slider moved with the arrow keys to `px` (the Content tab for a single block, Design for a box). */
async function textSize(page, id, px) {
  await H.select(page, id);
  let s = null;
  // The slider lives inside the "Text style" section (collapsed by default) — a person opens it first.
  for (const t of ['Content', 'Design']) { await tab(page, t); await section(page, 'Text style( \\(everything inside\\))?'); const c = page.getByRole('slider', { name: /^Text size/ }).first(); if (await c.count()) { s = c; break; } }
  if (!s) return false;
  await s.scrollIntoViewIfNeeded(); await s.focus();
  for (let k = 0; k < 200; k++) { const now = +(await s.getAttribute('aria-valuenow') ?? await s.inputValue()); if (now === px) break; await page.keyboard.press(now < px ? 'ArrowRight' : 'ArrowLeft'); }
  await page.waitForTimeout(300); await tab(page, 'Design'); return true;
}
module.exports = { spacing, textToggle, section, tab, meaning, sticky, contentWidth, background, text, phoneOnly, widthMode, textSize };
