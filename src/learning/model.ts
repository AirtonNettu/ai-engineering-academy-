import { z } from 'zod';
import { readProgress } from '../lib/storage';
const id = z.string().regex(/^[a-z][a-z0-9-]*$/);
const timestamp = z.number().int().min(0).max(253402300799999);
export const cardStateSchema = z
  .strictObject({
    correct: z.number().int().min(0).max(1000000),
    incorrect: z.number().int().min(0).max(1000000),
    streak: z.number().int().min(0).max(1000000),
    intervalDays: z.union([
      z.literal(0),
      z.literal(1),
      z.literal(3),
      z.literal(7),
      z.literal(14),
      z.literal(30),
    ]),
    dueAt: timestamp,
    lastReviewedAt: timestamp,
  })
  .refine((c) => c.streak <= c.correct, 'Sequência inconsistente');
export const learningSchema = z.strictObject({
  version: z.literal(1),
  reading: z.record(id, z.boolean()),
  cards: z.record(id, cardStateSchema),
  study: z.record(
    id,
    z.strictObject({
      step: z.number().int().min(0).max(5),
      completed: z
        .array(z.number().int().min(0).max(5))
        .max(6)
        .refine((a) => new Set(a).size === a.length),
      updatedAt: timestamp,
    }),
  ),
});
export type CardState = z.infer<typeof cardStateSchema>;
export type LearningState = z.infer<typeof learningSchema>;
export const emptyLearning = (): LearningState => ({
  version: 1,
  reading: {},
  cards: {},
  study: {},
});
export function loadLearning(): LearningState {
  try {
    const raw = localStorage.getItem('academy:learning');
    if (raw) {
      const parsed = learningSchema.safeParse(JSON.parse(raw));
      if (parsed.success) return parsed.data;
    }
  } catch {
    /* Migração usa somente os marcadores de leitura válidos. */
  }
  return { ...emptyLearning(), reading: readProgress() };
}
export function persistLearning(state: LearningState): boolean {
  try {
    localStorage.setItem('academy:learning', JSON.stringify(state));
    localStorage.setItem('academy:progress', JSON.stringify(state.reading));
    return true;
  } catch {
    return false;
  }
}
export function createBackup(state: LearningState, now = Date.now()): string {
  return JSON.stringify(
    {
      format: 'ia-engineer-academy-learning',
      version: 1,
      exportedAt: new Date(now).toISOString(),
      data: learningSchema.parse(state),
    },
    null,
    2,
  );
}
export function parseBackup(
  raw: string,
  known: { chapters: Set<string>; cards: Set<string> },
): LearningState {
  if (raw.length > 500000)
    throw Error('O arquivo excede o limite de 500 KB de texto.');
  const backup = z
    .strictObject({
      format: z.literal('ia-engineer-academy-learning'),
      version: z.literal(1),
      exportedAt: z.iso.datetime(),
      data: learningSchema,
    })
    .parse(JSON.parse(raw));
  for (const key of [
    ...Object.keys(backup.data.reading),
    ...Object.keys(backup.data.study),
  ])
    if (!known.chapters.has(key))
      throw Error(`Capítulo desconhecido no backup: ${key}`);
  for (const key of Object.keys(backup.data.cards))
    if (!known.cards.has(key))
      throw Error(`Cartão desconhecido no backup: ${key}`);
  return backup.data;
}
