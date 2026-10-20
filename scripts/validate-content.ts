import { validateChapterDepths } from '../src/lib/editorial-depths';
import { flashcards } from '../src/learning/content';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { catalog } from '../src/lib/content';
import { validateMarkdownLinks } from '../src/lib/routes';
import { slug } from '../src/lib/slug';
const documents = Object.fromEntries(
  catalog.chapters.map((c) => [
    c.id,
    readFileSync(`content/chapters/${c.id}.md`, 'utf8'),
  ]),
);
const expected = new Set(catalog.chapters.map((c) => `${c.id}.md`));
for (const file of readdirSync('content/chapters'))
  if (file.endsWith('.md') && !expected.has(file))
    throw Error(`Capítulo sem metadados: ${file}`);
for (const c of catalog.chapters) {
  const body = documents[c.id];
  if (body.trim().length < 2000 || !body.includes('## '))
    throw Error(`Capítulo insuficiente: ${c.id}`);
  const headings = Array.from(body.matchAll(/^## (.+)$/gm), (m) => slug(m[1]));
  if (new Set(headings).size !== headings.length)
    throw Error(`Títulos duplicados: ${c.id}`);
  validateMarkdownLinks(body, c.id, documents);
  validateChapterDepths(body, c.depths);
  validateMarkdownLinks(
    `[Implementação](${c.implementation.url})`,
    c.id,
    documents,
  );
  if (flashcards.filter((f) => f.chapterId === c.id).length < 3)
    throw Error(`Cartões editoriais insuficientes: ${c.id}`);
}
for (const p of catalog.projects) {
  if (new Set(p.files.map((f) => f.path)).size !== p.files.length)
    throw Error('Arquivo duplicado no catálogo');
  for (const f of p.files)
    if (!existsSync(`examples/${p.id}/${f.path}`))
      throw Error(`Arquivo ausente: ${f.path}`);
}
console.log(
  `Conteúdo válido: ${catalog.chapters.length} capítulos, ${catalog.roadmaps.length} trilhas, ${catalog.resources.length} recursos.`,
);
