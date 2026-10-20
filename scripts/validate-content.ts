import { readFileSync, existsSync } from 'node:fs';
import { catalog } from '../src/lib/content';
const known = new Set(catalog.chapters.map(c => c.id));
for (const c of catalog.chapters) {
  const path = `content/chapters/${c.id}.md`;
  const body = readFileSync(path, 'utf8');
  if (body.trim().length < 2000 || !body.includes('## ')) throw Error(`Capítulo insuficiente: ${c.id}`);
  for (const [,target] of body.matchAll(/\]\((\/[^)]+)\)/g)) {
    if (target.startsWith('/capitulos/') && !known.has(target.slice(11).split('#')[0])) throw Error(`Link inválido: ${target}`);
  }
}
for (const p of catalog.projects) for (const f of p.files) if(!existsSync(`examples/${p.id}/${f.path}`)) throw Error(`Arquivo ausente: ${f.path}`);
console.log(`Conteúdo válido: ${catalog.chapters.length} capítulos, ${catalog.roadmaps.length} trilhas, ${catalog.resources.length} recursos.`);
