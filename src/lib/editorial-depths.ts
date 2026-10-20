import { fromMarkdown } from 'mdast-util-from-markdown';
import { slug } from './slug';
type Node = { type: string; value?: string; children?: Node[] };
const plain = (n: Node): string =>
  n.type === 'html' ? '' : n.value || (n.children || []).map(plain).join('');
export function validateChapterDepths(
  body: string,
  depths: readonly { anchor: string }[],
): void {
  const headings = fromMarkdown(body)
    .children.filter((n) => n.type === 'heading' && n.depth === 2)
    .map((n) => ({
      anchor: slug(plain(n)),
      offset: n.position?.start.offset ?? 0,
    }));
  const indices = depths.map(
    (d) => headings.find((h) => h.anchor === d.anchor)?.offset ?? -1,
  );
  if (
    indices.length !== 3 ||
    indices.some((index, i) => index < 0 || (i > 0 && index <= indices[i - 1]))
  )
    throw Error('Três profundidades ordenadas são obrigatórias');
  for (let i = 0; i < 3; i++)
    if (
      body.slice(indices[i], indices[i + 1] ?? body.length).trim().length < 500
    )
      throw Error('Camada editorial insuficiente');
}
