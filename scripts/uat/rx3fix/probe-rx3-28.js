// RX3-28 (headed, through the UI): does a Centred-column band holding ONE plain Stack override that Stack's own left / right
// inner spacing (L6-2: `padding-inline: max(gutter, (100% − measure)/2) !important`)? And at Edge to edge, is 3rem honoured?
const path = require('path'); const H = require('../h.js'); const I = require('../inspector.js');
const X = require('../uat-rx3-headed.js'); const { cls, nodeOf, band, into, at, ins, field, chip, pvOpen, pvAt, pvClose } = X;
const OUT = __dirname;
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1366, h: 820, pos: [640, 80] }); page.setDefaultTimeout(12000);
  const cons = []; page.on('console', (m) => { if (m.type() === 'error') cons.push(m.text().slice(0, 160)); });
  const out = {};
  try {
    const b = await band(page); const s = await into(page, b, 'Stack'); const t = await into(page, s, 'Text'); await H.panel(page, false);
    await I.text(page, t, 'Where do these words start?');
    await at(page, (process.env.ON_BAND ? b : s), 'Design', 'Spacing'); await field(page, 'Inner spacing left', 3); await field(page, 'Inner spacing right', 0.5);
    out.fields = { left: await ins(page).getByLabel('Inner spacing left', { exact: true }).inputValue(), right: await ins(page).getByLabel('Inner spacing right', { exact: true }).inputValue() };
    out.stored = (({ paddingLeft, paddingRight, padding }) => ({ paddingLeft, paddingRight, padding }))(await nodeOf(page, process.env.ON_BAND ? b : s)); out.target = process.env.ON_BAND ? 'the band-level Stack (the one section the band holds)' : 'the Stack inside it';
    const measure = async (tag) => {
      const r = {};
      await chip(page, 'Desktop (1280px)');
      r.canvasDesktop = await page.evaluate(([b, s, t]) => { const sc = Number(document.querySelector('[data-canvas-scale]')?.dataset.canvasScale || 1); const B = document.querySelector(`[data-box-id="${b}"]`), S = document.querySelector(`[data-box-id="${s}"]`), T = document.querySelector(`[data-box-id="${t}"]`); const cs = getComputedStyle(S); return { bandPadCanvas: `${getComputedStyle(B).paddingLeft} / ${getComputedStyle(B).paddingRight}`, padL: cs.paddingLeft, padR: cs.paddingRight, textFromStack: Math.round((T.getBoundingClientRect().left - S.getBoundingClientRect().left) / sc), textFromBand: Math.round((T.getBoundingClientRect().left - B.getBoundingClientRect().left) / sc), stackW: Math.round(S.getBoundingClientRect().width / sc), bandW: Math.round(B.getBoundingClientRect().width / sc) }; }, [b, s, t]);
      await page.screenshot({ path: path.join(OUT, `re3${process.env.ON_BAND ? 'b' : ''}-${tag}-canvas-desktop.png`) }); await chip(page, 'Full width');
      await pvOpen(page);
      for (const w of [1280, 1920]) {
        const f = await pvAt(page, w);
        r[`preview${w}`] = await f.evaluate(([b, s, t]) => { const B = document.querySelector(b), S = document.querySelector(s), T = document.querySelector(t); const cs = getComputedStyle(S); const cb = getComputedStyle(B); return { padL: cs.paddingLeft, padR: cs.paddingRight, bandPad: `${cb.paddingLeft} / ${cb.paddingRight}`, textFromStack: Math.round(T.getBoundingClientRect().left - S.getBoundingClientRect().left), textFromPage: Math.round(T.getBoundingClientRect().left), stackW: Math.round(S.getBoundingClientRect().width), stackCls: S.className.slice(0, 60), bandCls: B.className.slice(0, 80) }; }, [cls(b), cls(s), cls(t)]);
        await page.screenshot({ path: path.join(OUT, `re3${process.env.ON_BAND ? 'b' : ''}-${tag}-preview-${w}.png`) });
      }
      await pvClose(page, 1366); return r;
    };
    await I.contentWidth(page, b, 'Centred column'); out.centred = await measure('centred');
    await I.contentWidth(page, b, 'Edge to edge'); out.edge = await measure('edge');
  } catch (e) { out.error = e.message.split('\n')[0]; await page.screenshot({ path: path.join(OUT, 're3-ERROR.png') }); }
  out.errors = { page: errs, console: [...new Set(cons)] };
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})();
