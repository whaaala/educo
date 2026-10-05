// SIX WINDOWS AT ALL TIMES (RULE Z): run a queue of headed probe commands, six at once, each slot refilled the moment it
// finishes. Each line of the queue file is one command's arguments after `node`; `{slot}` is replaced by the window slot.
//   NODE_PATH=node_modules node scripts/uat/six.js <queue.txt> [--jobs=6]
const fs = require('fs'); const { spawn } = require('child_process');
const queue = fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
const JOBS = +((process.argv.find((a) => a.startsWith('--jobs=')) || '=6').split('=')[1]);
let done = 0; const total = queue.length; const t0 = Date.now();
const next = (slot) => {
  const line = queue.shift(); if (!line) return;
  const args = line.replace(/\{slot\}/g, String(slot)).split(/\s+/);
  const c = spawn(process.execPath, args, { env: process.env, stdio: ['ignore', 'pipe', 'pipe'] });
  let buf = ''; c.stdout.on('data', (d) => { buf += d; }); c.stderr.on('data', (d) => { buf += d; });
  c.on('exit', () => { done++; console.log(`[${done}/${total} ${Math.round((Date.now() - t0) / 1000)}s] ${args.slice(1).join(' ')}\n   ${buf.trim().split('\n').slice(-1)[0]}`); next(slot); });
};
for (let s = 0; s < Math.min(JOBS, queue.length); s++) next(s);
