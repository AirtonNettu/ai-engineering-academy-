import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { catalog } from '../src/lib/content';
import { siteOrigin } from './site-origin';
const origin = siteOrigin(process.env.SITE_URL);
const robots = readFileSync('dist/robots.txt', 'utf8');
const rewrites = readFileSync('dist/_redirects', 'utf8');
assert.equal(
  readFileSync('dist/_headers', 'utf8'),
  readFileSync('public/_headers', 'utf8'),
);
assert.ok(rewrites.trim().endsWith('/* /index.html 200'));
for (const chapter of catalog.chapters) {
  const route = `/capitulos/${chapter.id}`;
  const html = readFileSync(`dist${route}.html`, 'utf8');
  assert.ok(html.includes(`data-static-chapter="${chapter.id}"`));
  assert.ok(html.includes('id="referencias"'));
  assert.ok(html.includes('id="fundamentacao"'));
  assert.ok(rewrites.includes(`${route} ${route}.html 200`));
  assert.equal((html.match(/<h1>/g) || []).length, 1);
  if (origin) {
    assert.ok(
      html.includes(`<link rel="canonical" href="${origin}${route}"/>`),
    );
    assert.ok(html.includes(`${origin}/social-card.png`));
    assert.ok(!html.includes('content="noindex, follow"'));
  } else assert.ok(html.includes('content="noindex, follow"'));
}
for (const route of [
  '/busca',
  '/meus-dados',
  ...catalog.chapters.map((c) => `/estudar/${c.id}`),
]) {
  assert.ok(
    readFileSync(`dist${route}.html`, 'utf8').includes(
      'content="noindex, follow"',
    ),
  );
}
if (origin) {
  assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
  const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
  assert.ok(
    !sitemap.includes('/estudar/') &&
      !sitemap.includes('/meus-dados') &&
      !sitemap.includes('/busca'),
  );
  for (const c of catalog.chapters)
    assert.ok(sitemap.includes(`${origin}/capitulos/${c.id}`));
} else {
  assert.ok(robots.includes('Disallow: /'));
  assert.ok(!existsSync('dist/sitemap.xml'));
}
console.log(
  `HTML/headers/rewrites e SEO verificados: ${catalog.chapters.length} capítulos; origem ${origin || 'preview noindex'}.`,
);
