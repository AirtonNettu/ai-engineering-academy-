import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { publicRoutes } from '../src/lib/routes';

type Node = { type: string; url?: string; children?: Node[] };
const root = process.cwd();
const skip = new Set([
  'node_modules',
  '.git',
  'dist',
  'coverage',
  'test-results',
  'playwright-report',
]);
function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (skip.has(entry.name)) return [];
    const path = resolve(dir, entry.name);
    return entry.isDirectory()
      ? files(path)
      : extname(path) === '.md'
        ? [path]
        : [];
  });
}
function walk(node: Node): Node[] {
  return [node, ...(node.children || []).flatMap(walk)];
}
const external = new Set<string>();
const errors: string[] = [];
let checked = 0;
for (const file of files(root)) {
  for (const node of walk(fromMarkdown(readFileSync(file, 'utf8')))) {
    if (!node.url) continue;
    const href = node.url;
    checked++;
    if (/^https?:\/\//.test(href)) {
      const url = new URL(href);
      if (url.username || url.password)
        errors.push(`${file}: credenciais em URL`);
      external.add(url.href.split('#')[0]);
      continue;
    }
    if (href.startsWith('#')) continue;
    if (href.startsWith('/') && publicRoutes.includes(href.split(/[?#]/)[0]))
      continue;
    if (/^[a-z]+:/i.test(href)) {
      errors.push(`${file}: esquema não permitido ${href}`);
      continue;
    }
    const path = resolve(
      dirname(file),
      decodeURIComponent(href.split(/[?#]/)[0]),
    );
    if (!path.startsWith(root + '/') || !existsSync(path))
      errors.push(`${file}: destino ausente ${href}`);
  }
}
// Fontes versionadas também participam da auditoria externa.
for (const path of ['content/catalog.json', 'content/flashcards.json']) {
  const visit = (value: unknown): void => {
    if (typeof value === 'string' && /^https:\/\//.test(value))
      external.add(new URL(value).href.split('#')[0]);
    else if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === 'object')
      Object.values(value).forEach(visit);
  };
  visit(JSON.parse(readFileSync(path, 'utf8')));
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
}
console.log(
  `${checked} links Markdown locais/formato verificados; ${external.size} URLs externas identificadas.`,
);
if (process.argv.includes('--external')) {
  const queue = [...external].sort();
  const results: {
    url: string;
    status: number | null;
    finalUrl?: string;
    error?: string;
  }[] = [];
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (queue.length) {
        const url = queue.shift()!;
        try {
          const response = await fetch(url, {
            redirect: 'follow',
            signal: AbortSignal.timeout(8000),
          });
          results.push({
            url,
            status: response.status,
            finalUrl: response.url,
          });
          await response.body?.cancel();
        } catch (error) {
          results.push({ url, status: null, error: String(error) });
        }
      }
    }),
  );
  const report = {
    checkedAt: new Date().toISOString(),
    localErrors: errors,
    results: results.sort((a, b) => a.url.localeCompare(b.url)),
  };
  writeFileSync(
    'docs/consolidation/link-audit.json',
    JSON.stringify(report, null, 2) + '\n',
  );
  console.log(
    `Auditoria externa registrada; falhas/403/timeouts exigem revisão humana, sem presumir link quebrado.`,
  );
}
