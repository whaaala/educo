// Mutation proof: break the policy one way at a time, re-run the tests, each mutation must be CAUGHT.
// run: node docs/web-anatomy/app-builder/examples/t3-roles/mutate.mjs
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, 'policy.mjs'), 'utf8');
const MUTATIONS = {
  'no tenant check': ['if (row.tenant_id !== p.tenantId) return false;', ''],
  'guardian link ignores the pupil': ['&& g.pupil_id === pupilId', ''],
  'teacher class ignored': ['&& c.class_id === pupil.class_id', ''],
  'fees readable by teachers': ["fees: {\n    read: [{ role: 'admin' }", "fees: {\n    read: [{ role: 'teacher' }, { role: 'admin' }"],
  'field rule off': ['if (!roles.some((r) => p.roles.includes(r))) delete out[field];', ''],
  'allow by default': ['if (!p || !rules) return false;', 'if (!p) return false; if (!rules) return true;'],
};
const dir = mkdtempSync(join(tmpdir(), 't3-mut-'));
let survived = 0;
for (const [name, [from, to]] of Object.entries(MUTATIONS)) {
  if (!src.includes(from)) { console.log(`?? ${name}: pattern not found`); survived++; continue; }
  const file = join(dir, `${name.replace(/\W+/g, '-')}.mjs`);
  writeFileSync(file, src.replace(from, to));
  const r = spawnSync(process.execPath, ['--test', join(here, 't3.check.mjs')], { env: { ...process.env, T3_POLICY: file }, encoding: 'utf8' });
  const caught = r.status !== 0;
  if (!caught) survived++;
  const failed = (r.stdout.match(/^# fail (\d+)/m) || [])[1];
  console.log(`${caught ? 'CAUGHT  ' : 'SURVIVED'} ${name}${caught ? ` (${failed} test(s) failed)` : ''}`);
}
console.log(survived ? `${survived} mutation(s) survived` : 'all mutations caught');
rmSync(dir, { recursive: true, force: true });
process.exit(survived ? 1 : 0);
