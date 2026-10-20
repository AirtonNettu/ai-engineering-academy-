import { cardStateSchema, type CardState } from './model';
const intervals = [1, 3, 7, 14, 30];
export function scheduleReview(
  previous: CardState | undefined,
  correct: boolean,
  now: number,
): CardState {
  if (!Number.isSafeInteger(now) || now < 0 || now > 253400000000000)
    throw Error('Relógio inválido');
  const prev = previous ? cardStateSchema.parse(previous) : undefined;
  const streak = correct ? (prev?.streak || 0) + 1 : 0;
  const intervalDays = correct
    ? intervals[Math.min(streak - 1, intervals.length - 1)]
    : 0;
  return cardStateSchema.parse({
    correct: (prev?.correct || 0) + (correct ? 1 : 0),
    incorrect: (prev?.incorrect || 0) + (correct ? 0 : 1),
    streak,
    intervalDays,
    dueAt: now + (correct ? intervalDays * 86400000 : 600000),
    lastReviewedAt: now,
  });
}
export function reviewStats(cards: Record<string, CardState>) {
  const values = Object.values(cards);
  const correct = values.reduce((sum, c) => sum + c.correct, 0);
  const incorrect = values.reduce((sum, c) => sum + c.incorrect, 0);
  return {
    reviews: correct + incorrect,
    correct,
    incorrect,
    studied: values.filter((c) => c.correct + c.incorrect > 0).length,
  };
}
