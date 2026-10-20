import { z } from 'zod';
import data from '../../content/catalog.json';

const id = z.string().regex(/^[a-z][a-z0-9-]*$/);
const text = z.string().min(1);
const https = z.url().refine(v => v.startsWith('https://'), 'Fonte deve usar HTTPS');
const chapter = z.object({
  id, title: text, category: id, description: text, minutes: z.number().int().positive(),
  tags: z.array(text).min(1), concepts: z.array(id), sources: z.array(z.object({ title: text, url: https })).min(1),
  reviewedAt: z.iso.date(), status: z.enum(['revisado-tecnicamente']),
  codeFiles: z.array(text), diagrams: z.array(id), related: z.array(id),
});
const schema = z.object({
  areas: z.array(z.object({ id, title: text, label: text, description: text, topics: z.array(text).min(1) })).min(1),
  chapters: z.array(chapter).min(1),
  glossary: z.array(z.object({ id, title: text, definition: text, chapters: z.array(id) })),
  roadmaps: z.array(z.object({ id, title: text, description: text, focus: text, steps: z.array(z.object({ title: text, description: text, chapters: z.array(id) })).min(1) })),
  resources: z.array(z.object({ id, title: text, category: text, url: https, description: text, kind: z.enum(['Skill', 'Recurso']), compatibility: text })),
  projects: z.array(z.object({ id, title: text, description: text, files: z.array(z.object({ path: text, role: text, symbols: text, imports: z.array(text) })).min(1) })),
  diagrams: z.array(z.object({ id, title: text, description: text, nodes: z.array(z.object({ id, title: text, description: text, file: text.nullable() })).min(1) })),
});
export type Catalog = z.infer<typeof schema>;
export type Chapter = Catalog['chapters'][number];
export function validateCatalog(input: unknown): Catalog {
  const c = schema.parse(input);
  for (const list of [c.areas, c.chapters, c.glossary, c.roadmaps, c.resources, c.projects, c.diagrams]) {
    if (new Set(list.map(item => item.id)).size !== list.length) throw Error('Identificador duplicado');
  }
  const sets = { areas: new Set(c.areas.map(a => a.id)), chapters: new Set(c.chapters.map(a => a.id)),
    terms: new Set(c.glossary.map(a => a.id)), diagrams: new Set(c.diagrams.map(a => a.id)),
    files: new Set(c.projects.flatMap(p => p.files.map(f => f.path))) };
  const refs = (values: string[], known: Set<string>) => { for (const v of values) if (!known.has(v)) throw Error(`Referência inválida: ${v}`); };
  for (const a of c.chapters) { refs([a.category], sets.areas); refs(a.related, sets.chapters); refs(a.concepts, sets.terms); refs(a.diagrams, sets.diagrams); refs(a.codeFiles, sets.files); }
  for (const a of c.glossary) refs(a.chapters, sets.chapters);
  for (const a of c.roadmaps) for (const s of a.steps) refs(s.chapters, sets.chapters);
  for (const d of c.diagrams) { if (new Set(d.nodes.map(n => n.id)).size !== d.nodes.length) throw Error('Nó duplicado'); for (const n of d.nodes) if(n.file) refs([n.file], sets.files); }
  for (const p of c.projects) for (const f of p.files) if (f.path.includes('..') || f.path.startsWith('/')) throw Error('Caminho de arquivo inválido');
  return c;
}
export const catalog = validateCatalog(data);
export const chapters = catalog.chapters;
export const chapterById = (id: string) => chapters.find(c => c.id === id);
export const chapterUrl = (id: string) => `/capitulos/${id}`;
