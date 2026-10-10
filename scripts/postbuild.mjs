// After `vite build`: publish dist/ to the repo root (what GitHub Pages serves) and fail loudly
// on obvious mistakes.
import { writeFileSync, readFileSync, readdirSync, statSync, rmSync, cpSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const repo = new URL('../', import.meta.url).pathname;
const dist = join(repo, 'dist');

const html = readFileSync(join(dist, 'index.html'), 'utf8');
const problems = [];
if (/src="\/src\//.test(html) || !/assets\/index-[\w-]+\.js/.test(html)) problems.push('index.html was not rewritten to built assets');
const js = readdirSync(join(dist, 'assets')).filter(f => f.endsWith('.js')).map(f => readFileSync(join(dist, 'assets', f), 'utf8')).join('');
if (/console\.log\(/.test(js)) problems.push('console.log left in the bundle');
for (const ref of html.matchAll(/(?:href|src|content)="\.\/([^"]+)"/g)) if (!existsSync(join(dist, ref[1]))) problems.push(`missing file referenced by index.html: ${ref[1]}`);
for (const abs of html.matchAll(/https:\/\/hapybeing\.github\.io\/barsaat\/([\w.-]+\.(?:png|jpg|xml|txt))/g)) if (!existsSync(join(dist, abs[1]))) problems.push(`missing file for absolute URL: ${abs[1]}`);
if (problems.length) { console.error('postbuild problems:\n - ' + problems.join('\n - ')); process.exit(1); }

// publish: replace the previous build at the root, never touch source folders
const published = readdirSync(dist);
rmSync(join(repo, 'assets'), { recursive: true, force: true });
for (const f of published) cpSync(join(dist, f), join(repo, f), { recursive: true });
writeFileSync(join(repo, '.nojekyll'), '');

let total = 0;
const walk = d => readdirSync(d).forEach(f => { const p = join(d, f); const s = statSync(p); s.isDirectory() ? walk(p) : (total += s.size); });
walk(dist);
console.log(`published ${published.length} entries to the repo root — ${(total / 1024).toFixed(0)} KB`);
