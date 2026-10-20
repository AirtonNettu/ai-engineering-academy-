import { catalog } from './content';
import { slug } from './slug';
export const publicRoutes = [
  '/',
  '/biblioteca',
  '/trilhas',
  '/arquiteturas',
  '/projetos/fastapi-ollama',
  '/recursos',
  '/glossario',
  '/busca',
  ...catalog.chapters.map((c) => `/capitulos/${c.id}`),
];
export function validateMarkdownLinks(
  markdown: string,
  chapterId?: string,
  documents: Record<string, string> = {},
): void {
  for (const [, target] of markdown.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (!target.startsWith('/') && !target.startsWith('#')) continue;
    const url = new URL(
      target,
      `https://academy.invalid/capitulos/${chapterId || ''}`,
    );
    if (!publicRoutes.includes(url.pathname))
      throw Error(`Link interno inválido: ${target}`);
    if (!url.hash) continue;
    let headings: string[];
    if (url.pathname.startsWith('/capitulos/')) {
      const id = url.pathname.split('/')[2];
      const body = id === chapterId ? markdown : documents[id];
      if (body)
        headings = [
          'referencias',
          ...Array.from(body.matchAll(/^##? (.+)$/gm), (m) => slug(m[1])),
        ];
      else continue;
    } else if (url.pathname === '/glossario')
      headings = catalog.glossary.map((t) => t.id);
    else if (url.pathname === '/recursos')
      headings = catalog.resources.map((t) => t.id);
    else throw Error(`Âncora não suportada: ${target}`);
    if (!headings.includes(decodeURIComponent(url.hash.slice(1))))
      throw Error(`Âncora inválida: ${target}`);
  }
}
