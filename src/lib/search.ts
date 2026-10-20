import { catalog, chapterUrl } from './content';
export type SearchItem = {
  id: string;
  title: string;
  description: string;
  kind: string;
  url: string;
  terms: string;
};
export const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
const bodies = import.meta.glob('../../content/chapters/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const index: SearchItem[] = [
  ...catalog.chapters.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    kind: 'Capítulo',
    url: chapterUrl(c.id),
    terms: [
      ...c.tags,
      ...c.concepts,
      bodies[`../../content/chapters/${c.id}.md`],
    ].join(' '),
  })),
  ...catalog.glossary.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.definition,
    kind: 'Conceito',
    url: `/glossario#${c.id}`,
    terms: '',
  })),
  ...catalog.roadmaps.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    kind: 'Trilha',
    url: `/trilhas?trilha=${c.id}`,
    terms: c.steps.map((s) => s.title).join(' '),
  })),
  ...catalog.projects.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    kind: 'Projeto',
    url: `/projetos/${c.id}`,
    terms: 'Python código fonte FastAPI Ollama',
  })),
  ...catalog.resources.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    kind: c.kind,
    url: `/recursos#${c.id}`,
    terms: c.category,
  })),
  ...catalog.chapters.flatMap((c) =>
    c.sources.map((s, i) => ({
      id: `${c.id}-${i}`,
      title: s.title,
      description: `Referência do capítulo ${c.title}`,
      kind: 'Referência',
      url: chapterUrl(c.id) + '#referencias',
      terms: c.tags.join(' '),
    })),
  ),
];
export function search(query: string): SearchItem[] {
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return index
    .map((item) => ({
      item,
      score: words.reduce(
        (s, w) =>
          s +
          (normalize(item.title).includes(w) ? 3 : 0) +
          (normalize(`${item.description} ${item.terms}`).includes(w) ? 1 : 0),
        0,
      ),
    }))
    .filter(({ item }) =>
      words.every((w) =>
        normalize(`${item.title} ${item.description} ${item.terms}`).includes(
          w,
        ),
      ),
    )
    .sort((a, b) => b.score - a.score)
    .map((r) => r.item);
}
