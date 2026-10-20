import { z } from 'zod';
import data from '../../content/flashcards.json' with { type: 'json' };
import { catalog } from '../lib/content';
const cardSchema = z.strictObject({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  chapterId: z.string(),
  front: z.string().min(10),
  back: z.string().min(20),
  difficulty: z.enum(['basico', 'intermediario', 'avancado']),
  sourceUrl: z.url().refine((v) => v.startsWith('https://')),
  reviewedAt: z.iso.date(),
});
export const flashcards = z.array(cardSchema).parse(data);
if (new Set(flashcards.map((c) => c.id)).size !== flashcards.length)
  throw Error('Cartão duplicado');
for (const card of flashcards)
  if (!catalog.chapters.some((c) => c.id === card.chapterId))
    throw Error(`Capítulo do cartão inexistente: ${card.id}`);
export const knownLearningIds = {
  chapters: new Set(catalog.chapters.map((c) => c.id)),
  cards: new Set(flashcards.map((c) => c.id)),
};
