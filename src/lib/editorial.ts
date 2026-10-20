import { z } from 'zod';
import { catalog } from './content';
import { validateMarkdownLinks } from './routes';
export const proposalSchema = z.strictObject({
  version: z.literal(1),
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  baseCommit: z.string().regex(/^[0-9a-f]{40}$/),
  title: z.string().min(10).max(200),
  humanReviewRequired: z.literal(true),
  sources: z
    .array(
      z.strictObject({
        title: z.string().min(1),
        url: z.url().refine((v) => v.startsWith('https://')),
        retrievedAt: z.iso.date(),
      }),
    )
    .min(1)
    .max(50),
  changes: z
    .array(
      z.strictObject({
        chapterId: z.string(),
        rationale: z.string().min(50),
        markdown: z.string().min(2000).max(100000),
      }),
    )
    .min(1)
    .max(20),
});
export function validateProposal(input: unknown) {
  const p = proposalSchema.parse(input);
  const ids = new Set(catalog.chapters.map((c) => c.id));
  if (new Set(p.changes.map((c) => c.chapterId)).size !== p.changes.length)
    throw Error('Alteração duplicada');
  for (const c of p.changes) {
    if (!ids.has(c.chapterId)) throw Error('Capítulo alvo inexistente');
    validateMarkdownLinks(c.markdown, c.chapterId);
  }
  return p;
}
