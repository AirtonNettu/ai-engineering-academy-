import { fromMarkdown } from 'mdast-util-from-markdown';
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
type MarkdownNode = {
  type: string;
  children?: MarkdownNode[];
  value?: string;
  url?: string;
  identifier?: string;
  depth?: number;
};
function walk(node: MarkdownNode): MarkdownNode[] {
  return [node, ...(node.children || []).flatMap(walk)];
}
function headingIds(markdown: string): string[] {
  const text = (node: MarkdownNode): string =>
    node.type === 'html'
      ? ''
      : node.value || (node.children || []).map(text).join('');
  return walk(fromMarkdown(markdown))
    .filter((n) => n.type === 'heading' && (n.depth === 2 || n.depth === 3))
    .map((n) => slug(text(n)));
}
export function validateMarkdownLinks(
  markdown: string,
  chapterId?: string,
  documents: Record<string, string> = {},
): void {
  const nodes = walk(fromMarkdown(markdown));
  const definitions = new Map(
    nodes
      .filter((n) => n.type === 'definition')
      .map((n) => [n.identifier!, n.url!]),
  );
  const links = nodes
    .filter((n) => n.type === 'link' || n.type === 'linkReference')
    .map((n) => n.url || definitions.get(n.identifier!));
  for (const target of links) {
    if (!target) throw Error('Referência Markdown sem definição');
    if (target.startsWith('https://')) {
      new URL(target);
      continue;
    }
    // A single canonical convention avoids browser-relative links after route changes.
    if (
      target.startsWith('//') ||
      (!target.startsWith('/') && !target.startsWith('#'))
    )
      throw Error(
        `Link não permitido: ${target}. Use HTTPS, /rota ou #âncora.`,
      );
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
      if (!body) throw Error(`Documento necessário para validar âncora: ${id}`);
      headings = ['referencias', ...headingIds(body)];
    } else if (url.pathname === '/glossario')
      headings = catalog.glossary.map((t) => t.id);
    else if (url.pathname === '/recursos')
      headings = catalog.resources.map((t) => t.id);
    else throw Error(`Âncora não suportada: ${target}`);
    if (!headings.includes(decodeURIComponent(url.hash.slice(1))))
      throw Error(`Âncora inválida: ${target}`);
  }
}
